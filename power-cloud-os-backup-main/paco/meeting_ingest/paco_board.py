"""Weekly board update behind Paco.

Every Monday, for each client whose CONTEXT.md names an Asana project and a team Chat space:
link the week's executive summary from the client's folder (the internal draft in working/ and,
when rendered, the client-facing document in deliverables/), and post the Asana tasks that need
attention (past due, due this week, active but untouched, missing owner or date) as a separate
message. Facts are computed from the Asana API in the shape the customer-exec-summary skill uses.
Destinations come from CONTEXT.md and must also appear on the VPS allowlist; anything else holds
and the admin hears about it privately.
"""
import argparse
import hashlib
import json
import re
import sys
import time
from datetime import date, datetime, timedelta, timezone, tzinfo
from pathlib import Path
from .paco import connect
from .filing import journal_lock

LOCK_ATTEMPTS = 40
LOCK_DELAY = 15
# flock on Linux raises BlockingIOError; msvcrt on Windows raises PermissionError for the same thing.
LOCK_BUSY = (BlockingIOError, PermissionError)
CHAT_API = 'https://chat.googleapis.com/v1/'
LIVE_STATES = ('JOINED', 'INVITED')


class NotInSpace(Exception):
    """Paco has not been added to the space, which is the human gate on posting there."""


class AudienceUnsafe(Exception):
    """The space holds someone who is not verified Power Cloud staff, or could not be fully read."""


class ChatDirectory:
    """Reads space metadata and membership with Paco's own Chat credentials."""

    def __init__(self, session):
        self.session = session

    @classmethod
    def from_config(cls, config):
        from google.oauth2 import service_account
        from google.auth.transport.requests import AuthorizedSession
        creds = service_account.Credentials.from_service_account_file(
            config['chat_key_path'], scopes=['https://www.googleapis.com/auth/chat.bot'])
        return cls(AuthorizedSession(creds))

    def space(self, space):
        response = self.session.get(CHAT_API + space, timeout=30)
        if response.status_code == 403:
            raise NotInSpace('Paco is not a member of ' + space)
        response.raise_for_status()
        return response.json()

    def members(self, space):
        results, params = [], {'pageSize': 100}
        while True:
            response = self.session.get(CHAT_API + space + '/members', params=params, timeout=30)
            if response.status_code == 403:
                raise NotInSpace('Paco is not a member of ' + space)
            response.raise_for_status()
            page = response.json()
            results.extend(page.get('memberships', []))
            token = page.get('nextPageToken')
            if not token:
                return results
            params = dict(params, pageToken=token)


def audit_audience(chat, space, internal_domain_id=None):
    """Confirm every person in the space is internal, or refuse.

    Replaces the static allowlist. A list cannot notice a client being added to an approved
    space next month; this runs immediately before every post. Fails closed: an unreadable or
    incomplete member list is treated as unsafe, not as an empty one.
    """
    info = chat.space(space)
    members = chat.members(space)
    people = [m for m in members if (m.get('member') or {}).get('type') == 'HUMAN'
              and m.get('state') in LIVE_STATES]
    outsiders, apps = [], []
    for membership in members:
        member = membership.get('member') or {}
        if member.get('type') != 'HUMAN':
            if membership.get('state') in LIVE_STATES:
                apps.append(member.get('displayName') or member.get('name') or 'unnamed app')
            continue
        if membership.get('state') not in LIVE_STATES:
            continue
        label = member.get('displayName') or member.get('name') or 'unnamed person'
        if membership.get('affiliation') != 'INTERNAL':
            outsiders.append(label + ' (affiliation ' + str(membership.get('affiliation')) + ')')
        elif internal_domain_id and member.get('domainId') != internal_domain_id:
            outsiders.append(label + ' (outside domain)')
    expected = (info.get('membershipCount') or {}).get('joinedDirectHumanUserCount')
    joined = len([m for m in people if m.get('state') == 'JOINED'])
    if expected is not None and joined != expected:
        raise AudienceUnsafe('member list looks incomplete for ' + space + ': read ' + str(joined) +
                             ' joined people, the space reports ' + str(expected))
    if outsiders:
        raise AudienceUnsafe('not an internal space: ' + ', '.join(sorted(outsiders)))
    return {'space': space, 'name': info.get('displayName'), 'people': len(people), 'apps': apps}

FOLDER = 'application/vnd.google-apps.folder'
SUMMARY_PATTERNS = (('working', re.compile(r'^exec_summary_(\d{4}-\d{2}-\d{2})\.md$', re.I)),
                    ('deliverables', re.compile(r'Executive_Summary_(\d{4}-\d{2}-\d{2})\.(?:docx|pdf)$', re.I)))
SUMMARY_MAX_AGE_DAYS = 7


class _USEastern(tzinfo):
    """US Eastern under the post-2007 DST rule. Fallback for a Windows Python with no IANA
    database (stock installs lack the tzdata package); Linux hosts use the system zone data."""

    def _bounds(self, year):
        march = datetime(year, 3, 8)
        november = datetime(year, 11, 1)
        start = march + timedelta(days=(6 - march.weekday()) % 7)      # second Sunday of March
        end = november + timedelta(days=(6 - november.weekday()) % 7)  # first Sunday of November
        return start.replace(hour=2), end.replace(hour=2)

    def dst(self, dt):
        if dt is None:
            return timedelta(0)
        start, end = self._bounds(dt.year)
        return timedelta(hours=1) if start <= dt.replace(tzinfo=None) < end else timedelta(0)

    def utcoffset(self, dt):
        return timedelta(hours=-5) + self.dst(dt)

    def tzname(self, dt):
        return 'EDT' if self.dst(dt) else 'EST'


try:
    from zoneinfo import ZoneInfo
    EASTERN = ZoneInfo('America/New_York')
except Exception:  # noqa: BLE001 - ZoneInfoNotFoundError or a missing zoneinfo module
    EASTERN = _USEastern()

ASANA_API = 'https://app.asana.com/api/1.0'
PROJECT_FIELDS = ('name,permalink_url,current_status_update.created_at,'
                  'current_status_update.status_type,current_status_update.title')
TASK_FIELDS = ('name,completed,completed_at,due_on,due_at,assignee.name,modified_at,'
               'memberships.section.name,memberships.project.gid,permalink_url')
WINDOW_DAYS = 7
STALE_DAYS = 14
STATUS_STALE_DAYS = 14
CHAT_LIMIT = 4000
LIST_CAP = 8
PASSIVE_STAGES = ('backlog', 'done', 'complete', 'closed', 'with client', 'waiting',
                  'blocked', 'on hold', 'deferred', 'released')
DEFAULT_MODEL = 'claude-opus-5'

SYSTEM_PROMPT = (
    'You write the weekly "health read" for one client project board, posted by Paco into the '
    'Power Cloud internal team chat for that project. Audience: the consultants on the account. '
    'Never the client.\n\n'
    'Write three to five plain sentences, no bullets, no headers, no em-dashes. Name tasks and '
    'owners when it sharpens the point. Be candid; this is the internal view. Do not dramatize '
    'and do not use words like crisis, alarming, urgent or critical.\n\n'
    'Rules of evidence. Everything in the facts block was read from Asana and is verified. Your '
    'verdict on health is an inference and must be phrased as one ("reads as", "looks", '
    '"suggests"). Absence in Asana is absence in Asana, not absence of work or of next steps; '
    'never say the team has no plan because the board is quiet. If the data is thin (no status '
    'update, most open tasks unowned or undated, a blank board), say the data is thin and that '
    'the read is unreliable, rather than reporting the artifact of it. Do not invent next steps, '
    'dates or commitments that are not in the facts.'
)


class AsanaReader:
    """Read-only Asana access with a personal access token. Every call pages to completion."""

    def __init__(self, token, session=None):
        if not token or not token.strip():
            raise ValueError('Asana token is empty')
        if session is None:
            import requests
            session = requests.Session()
        self.session = session
        self.headers = {'Authorization': 'Bearer ' + token.strip(), 'Accept': 'application/json'}

    def _get(self, path, params):
        response = self.session.get(ASANA_API + path, params=params, headers=self.headers, timeout=60)
        response.raise_for_status()
        return response.json()

    def _pages(self, path, params):
        params = dict(params, limit=100)
        while True:
            page = self._get(path, params)
            yield from page.get('data', [])
            offset = (page.get('next_page') or {}).get('offset')
            if not offset:
                return
            params['offset'] = offset

    def project(self, gid):
        return self._get('/projects/' + gid, {'opt_fields': PROJECT_FIELDS})['data']

    def sections(self, gid):
        return list(self._pages('/projects/' + gid + '/sections', {'opt_fields': 'name'}))

    def tasks(self, gid):
        return list(self._pages('/tasks', {'project': gid, 'opt_fields': TASK_FIELDS}))


def _when(value):
    if not value:
        return None
    stamp = datetime.fromisoformat(value.replace('Z', '+00:00'))
    return stamp if stamp.tzinfo else stamp.replace(tzinfo=timezone.utc)


def _due(task):
    if task.get('due_at'):
        return _when(task['due_at']).astimezone(EASTERN).date()
    if task.get('due_on'):
        return datetime.strptime(task['due_on'], '%Y-%m-%d').date()
    return None


def _owner(task):
    return (task.get('assignee') or {}).get('name') or 'unassigned'


def _section(task, project_gid):
    for membership in task.get('memberships') or []:
        if (membership.get('project') or {}).get('gid') == project_gid:
            return ((membership.get('section') or {}).get('name') or '').strip()
    return ''


def _brief(task, project_gid=None, today=None, extra=None):
    item = {'name': task.get('name') or '(untitled)', 'owner': _owner(task)}
    due = _due(task)
    if due:
        item['due'] = due.isoformat()
        if today and due < today:
            item['days_overdue'] = (today - due).days
    if project_gid is not None:
        item['stage'] = _section(task, project_gid) or 'No section'
    if extra:
        item.update(extra)
    return item


def review(project, sections, tasks, now):
    """Deterministic facts, in the shape the exec-summary skill's Asana step computes."""
    today = now.astimezone(EASTERN).date()
    window_start = now - timedelta(days=WINDOW_DAYS)
    stale_before = now - timedelta(days=STALE_DAYS)
    gid = project['gid']
    open_tasks = [t for t in tasks if not t.get('completed')]
    done_tasks = [t for t in tasks if t.get('completed')]
    completed = sorted((t for t in done_tasks
                        if _when(t.get('completed_at')) and _when(t['completed_at']) >= window_start),
                       key=lambda t: t.get('completed_at') or '', reverse=True)
    by_stage = {name: 0 for name in ((s.get('name') or '').strip() for s in sections) if name}
    for task in open_tasks:
        stage = _section(task, gid) or 'No section'
        by_stage[stage] = by_stage.get(stage, 0) + 1
    by_stage = {k: v for k, v in by_stage.items() if v}
    past_due = sorted((t for t in open_tasks if _due(t) and _due(t) < today), key=_due)
    due_soon = sorted((t for t in open_tasks
                       if _due(t) and today <= _due(t) <= today + timedelta(days=WINDOW_DAYS)), key=_due)
    unowned = [t for t in open_tasks if not (t.get('assignee') or {}).get('name')]
    undated = [t for t in open_tasks if not _due(t)]
    stale = [t for t in open_tasks
             if _when(t.get('modified_at')) and _when(t['modified_at']) < stale_before
             and not any(word in (_section(t, gid) or '').lower() for word in PASSIVE_STAGES)]
    status = project.get('current_status_update') or None
    status_age = (now - _when(status['created_at'])).days if status and status.get('created_at') else None
    total = len(tasks)
    thin_reasons = []
    if not total:
        thin_reasons.append('the board is empty')
    if status_age is None:
        thin_reasons.append('no project status update has ever been posted')
    elif status_age > 30:
        thin_reasons.append('the last status update is %d days old' % status_age)
    if open_tasks and len(unowned) * 2 > len(open_tasks):
        thin_reasons.append('most open tasks have no owner')
    if open_tasks and len(undated) * 2 > len(open_tasks):
        thin_reasons.append('most open tasks have no due date')
    local = now.astimezone(EASTERN)
    return {
        'project': project.get('name') or 'Asana project', 'url': project.get('permalink_url'),
        'as_of': local.strftime('%b %d, %Y %I:%M %p ET').replace(' 0', ' '),
        'week_of': (today - timedelta(days=today.weekday())).isoformat(),
        'total': total, 'open': len(open_tasks), 'done': len(done_tasks),
        'percent_complete': round(100 * len(done_tasks) / total) if total else 0,
        'completed_this_week': [_brief(t) for t in completed],
        'open_by_stage': by_stage,
        'past_due': [_brief(t, gid, today) for t in past_due],
        'due_this_week': [_brief(t, gid, today) for t in due_soon],
        'unowned_open': len(unowned), 'undated_open': len(undated),
        'stale_active': [_brief(t, gid, today, {'idle_days': (now - _when(t['modified_at'])).days})
                         for t in stale],
        'status_update': ({'age_days': status_age, 'type': status.get('status_type'),
                           'title': status.get('title')} if status else None),
        'thin_data': thin_reasons,
    }


def narrative(facts, config, client_factory=None):
    """Claude's health read. Any failure returns None and the post goes out with facts only."""
    key_path = config.get('anthropic_key_path')
    if not key_path or not Path(key_path).is_file():
        return None
    try:
        if client_factory is None:
            import anthropic
            client_factory = anthropic.Anthropic
        client = client_factory(api_key=Path(key_path).read_text(encoding='utf-8').strip())
        request = dict(model=config.get('board_model') or DEFAULT_MODEL, max_tokens=1200,
                       system=SYSTEM_PROMPT,
                       output_config={'effort': config.get('board_effort') or 'medium'},
                       messages=[{'role': 'user',
                                  'content': 'Facts read from Asana:\n' + json.dumps(facts, indent=2)}])
        try:
            # Server-side refusal fallback keeps a policy decline from silently blanking the read.
            response = client.beta.messages.create(betas=['server-side-fallback-2026-07-01'],
                                                   fallbacks='default', **request)
        except TypeError:
            response = client.messages.create(**request)
        if response.stop_reason == 'refusal':
            return None
        text = ' '.join(block.text.strip() for block in response.content if block.type == 'text').strip()
        return text or None
    except Exception as error:  # noqa: BLE001 - deliberate fail-soft; run() reports the reason
        facts['_narrative_error'] = type(error).__name__
        return None


def find_summaries(drive, record, now):
    """Newest executive summary per folder kind (working draft, deliverables render) dated this week."""
    folder_id = record.get('folder_id')
    if not drive or not folder_id:
        return []
    today = now.astimezone(EASTERN).date()
    newest = {}
    for child in drive.children(folder_id):
        kinds = [p for k, p in SUMMARY_PATTERNS if k == (child.get('name') or '').lower()]
        if child.get('mimeType') != FOLDER or not kinds:
            continue
        for item in drive.children(child['id']):
            match = kinds[0].search(item.get('name') or '')
            if not match:
                continue
            dated = date.fromisoformat(match.group(1))
            if not 0 <= (today - dated).days <= SUMMARY_MAX_AGE_DAYS:
                continue
            kind = child['name'].lower()
            if kind not in newest or newest[kind]['date'] < dated.isoformat():
                newest[kind] = {'kind': kind, 'name': item['name'], 'date': dated.isoformat(),
                                'link': item.get('webViewLink') or 'https://drive.google.com/file/d/' + item['id'] + '/view'}
    return [newest[k] for k in ('working', 'deliverables') if k in newest]


def render_summary(client_path, week_of, summaries):
    """The link message. Posted only when a summary dated this week exists."""
    labels = {'working': 'Internal draft', 'deliverables': 'Client-facing render'}
    lines = ['*' + client_path.split('/')[-1] + ' executive summary · week of ' + week_of + '*']
    lines += [labels[s['kind']] + ': <' + s['link'] + '|' + s['name'] + '>' for s in summaries]
    lines += ['', '_The internal draft is the full picture, hours and all. The client-facing version goes out '
              'only after a consultant reviews it._']
    return '\n'.join(lines)


def _line(item):
    text = '• ' + item['name'] + ' (' + item['owner'] + ')'
    if item.get('days_overdue'):
        text += ' · due ' + item['due'] + ', ' + str(item['days_overdue']) + ' days over'
    elif item.get('due'):
        text += ' · due ' + item['due']
    if item.get('idle_days'):
        text += ' · untouched ' + str(item['idle_days']) + ' days'
    return text


def render_attention(client_path, facts, health=None, summaries=(), cap=LIST_CAP):
    """The tasks-that-need-attention message. Shrinks its lists until it fits the Chat limit."""
    def block(title, items):
        if not items:
            return []
        lines = ['*' + title + ' (' + str(len(items)) + ')*'] + [_line(i) for i in items[:cap]]
        if len(items) > cap:
            lines.append('  +' + str(len(items) - cap) + ' more')
        return lines + ['']
    status = facts['status_update']
    if status and status['age_days'] is not None:
        status_text = 'status update ' + str(status['age_days']) + ' days ago'
        if status['age_days'] > STATUS_STALE_DAYS:
            status_text += ' (stale)'
    else:
        status_text = 'no status update on the project'
    project = ('<' + facts['url'] + '|' + facts['project'] + '>') if facts.get('url') else facts['project']
    lines = ['*' + client_path.split('/')[-1] + ' tasks needing attention · week of ' + facts['week_of'] + '*',
             project + ' · ' + str(facts['open']) + ' open, ' + str(facts['done']) + ' done (' +
             str(facts['percent_complete']) + '%) · ' + str(len(facts['completed_this_week'])) +
             ' closed this week · ' + status_text, '']
    lines += block('Past due', facts['past_due'])
    lines += block('Due this week', facts['due_this_week'])
    lines += block('In progress but untouched ' + str(STALE_DAYS) + '+ days', facts['stale_active'])
    hygiene = []
    if facts['unowned_open']:
        hygiene.append(str(facts['unowned_open']) + ' open without an owner')
    if facts['undated_open']:
        hygiene.append(str(facts['undated_open']) + ' without a due date')
    if hygiene:
        lines += ['*Hygiene*: ' + ', '.join(hygiene) + '. See ASANA_CONVENTIONS.md.', '']
    if not (facts['past_due'] or facts['due_this_week'] or facts['stale_active'] or hygiene):
        lines += ['Nothing on the board needs attention this week.', '']
    if facts['thin_data']:
        lines += ['_Thin data: ' + '; '.join(facts['thin_data']) + '. Read the board with that in mind._', '']
    if health:
        lines += ['*Health read (Paco, inferred)*: ' + health, '']
    if not summaries:
        lines += ['_No executive summary dated this week in working/ yet._', '']
    lines += ['_Read from Asana ' + facts['as_of'] + '. Internal team view, not for the client. '
              'Paco does not read replies in this space; fix the board and the next post reflects it._']
    text = '\n'.join(lines)
    if len(text) > CHAT_LIMIT and cap > 1:
        return render_attention(client_path, facts, health, summaries, cap - 1)
    if len(text) > CHAT_LIMIT:
        text = text[:CHAT_LIMIT - 2].rstrip() + ' …'
    return text


def week_key(now):
    year, week, _ = now.astimezone(EASTERN).isocalendar()
    return '%d-W%02d' % (year, week)


ATTENTION = 'client-board-'
SUMMARY = 'client-board-summary-'


def outbox_id(client_path, run_key, prefix=ATTENTION):
    return prefix + hashlib.sha256((client_path + ':' + run_key).encode()).hexdigest()[:40]


def queue(db, config, client_path, space, text, run_key, prefix=ATTENTION):
    """One durable outbox row per client, message kind and run key. Returns (id, inserted)."""
    if config.get('enable_board_delivery') is not True:
        raise ValueError('Board delivery is disabled')
    if not re.fullmatch(r'spaces/[A-Za-z0-9_-]+', space or ''):
        raise ValueError('Malformed Chat space for ' + client_path)
    if not text or not text.strip():
        raise ValueError('Empty board message')
    oid = outbox_id(client_path, run_key, prefix)
    with db:
        if db.execute('SELECT id FROM paco_outbox WHERE id=?', (oid,)).fetchone():
            return oid, False
        db.execute('INSERT INTO paco_outbox(id,space,body) VALUES(?,?,?)',
                   (oid, space, json.dumps({'text': text})))
    return oid, True


def notify_admin(db, config, text, run_key):
    """Private note to the configured admin's DM. Silent if no admin is bound."""
    admin = (config.get('board_admin') or '').lower()
    user = db.execute('SELECT space FROM paco_users WHERE email=?', (admin,)).fetchone() if admin else None
    if not user or admin not in config.get('allowed_users', []):
        return None
    oid = 'client-board-admin-' + hashlib.sha256((run_key + '\n' + text).encode()).hexdigest()[:40]
    with db:
        db.execute('INSERT OR IGNORE INTO paco_outbox(id,space,body) VALUES(?,?,?)',
                   (oid, user['space'], json.dumps({'text': text})))
    return oid


def targets(index, clients=None):
    """Records with exactly one project and one space; a project-and-space pair posts once."""
    seen = set()
    result = []
    for record in index:
        gid, space = record.get('asana_project'), record.get('chat_space')
        if not gid or not space:
            continue
        if clients is not None and record['path'] not in clients:
            continue
        if (gid, space) in seen:
            continue
        seen.add((gid, space))
        result.append(record)
    return result


def acquire_ledger(database, attempts=LOCK_ATTEMPTS, delay=LOCK_DELAY, sleep=time.sleep):
    """Wait for the ledger lock instead of losing the week.

    The Chat worker holds this lock for as long as its blocking Pub/Sub pull runs, and it
    starts again seconds later, so a single non-blocking attempt loses a coin flip. This runs
    weekly on a timer with no retry behind it, so a lost attempt is a lost week, not a lost
    minute. Returns an entered context manager; the caller must exit it.
    """
    for remaining in range(attempts, 0, -1):
        lock = journal_lock(database)
        try:
            lock.__enter__()
            return lock
        except LOCK_BUSY:
            if remaining == 1:
                raise
            sleep(delay)


def _drive_reader(config):
    """Read-only Drive access as the index-building identity, for the summary-file lookup."""
    from .google_read import GoogleReader, delegated_session
    source = json.loads(Path(config['survey_config']).read_text(encoding='utf-8'))
    return GoogleReader(delegated_session(source['key_path'], source['subject'], source['allowed_organizers']))


def stale_rows(db, current_ids):
    """Board rows an earlier run queued that never went out.

    The worker skips a board row it cannot deliver rather than blocking the whole outbox, so
    these accumulate silently. Surfacing them in the weekly admin note is what stops that being
    invisible.
    """
    rows = db.execute("SELECT id FROM paco_outbox WHERE sent=0 AND id LIKE 'client-board-%' "
                      "AND id NOT LIKE 'client-board-admin-%'").fetchall()
    return sorted(row['id'] for row in rows if row['id'] not in current_ids)


def run(config, *, clients=None, dry_run=False, rerun=False, now=None, reader=None, drive=None,
        chat=None, out=None):
    out = out or sys.stdout
    now = now or datetime.now(timezone.utc)
    run_key = week_key(now) + (':rerun-' + now.strftime('%Y%m%dT%H%M%S') if rerun else '')
    index = json.loads(Path(config['index_path']).read_text(encoding='utf-8'))
    problems = []
    if reader is None:
        token_path = Path(config.get('asana_token_path') or 'asana-token-path-not-configured')
        if token_path.is_file():
            reader = AsanaReader(token_path.read_text(encoding='utf-8'))
        else:
            problems.append('Asana token file is missing at ' + str(token_path) + '; no boards were read')
    if drive is None and reader is not None:
        try:
            drive = _drive_reader(config)
        except Exception as error:  # noqa: BLE001 - the attention post still goes out without links
            problems.append('Drive reader unavailable (' + type(error).__name__ + '); summary links skipped')
    can_post = reader is not None
    if chat is None and can_post:
        try:
            chat = ChatDirectory.from_config(config)
        except Exception as error:  # noqa: BLE001 - fail closed: no audience check means no posting
            problems.append('Chat directory unavailable (' + type(error).__name__ +
                            '); refusing to post without checking who is in the space')
            can_post = False
    posts, summary_held = [], []
    for record in (targets(index, clients) if can_post else []):
        try:
            audit_audience(chat, record['chat_space'], config.get('board_internal_domain_id'))
            gid = record['asana_project']
            facts = review(reader.project(gid), reader.sections(gid), reader.tasks(gid), now)
            summaries = []
            if drive is not None:
                try:
                    summaries = find_summaries(drive, record, now)
                except Exception as error:  # noqa: BLE001
                    problems.append(record['path'] + ': summary lookup failed (' + type(error).__name__ + ')')
            health = narrative(facts, config) if config.get('board_health_read') is True else None
            messages = []
            if summaries:
                messages.append((SUMMARY, render_summary(record['path'], facts['week_of'], summaries)))
            messages.append((ATTENTION, render_attention(record['path'], facts, health, summaries)))
            posts.append((record, messages, facts.get('_narrative_error')))
        except (NotInSpace, AudienceUnsafe) as refusal:
            summary_held.append(record['path'])
            problems.append(record['path'] + ': ' + str(refusal))
        except Exception as error:  # noqa: BLE001 - one client's failure must not silence the rest
            problems.append(record['path'] + ': ' + type(error).__name__ + ': ' + str(error)[:200])
    summary = {'run_key': run_key, 'queued': [], 'skipped': [], 'held': list(summary_held),
               'facts_only': [], 'stale': [], 'errors': []}
    for record, _, err in posts:
        if err:
            summary['facts_only'].append(record['path'])
    if dry_run:
        for record, messages, err in posts:
            out.write('=== ' + record['path'] + ' -> ' + record['chat_space'] +
                      (' (facts only: ' + err + ')' if err else '') + '\n' +
                      '\n\n'.join(text for _, text in messages) + '\n\n')
        for problem in problems:
            out.write('!!! ' + problem + '\n')
        summary['errors'] = problems
        return summary
    lock = acquire_ledger(config['database'])
    try:
        db = connect(config['database'])
        try:
            queued_ids = []
            for record, messages, _ in posts:
                try:
                    inserted_any = False
                    for prefix, text in messages:
                        oid, inserted = queue(db, config, record['path'], record['chat_space'], text, run_key, prefix)
                        queued_ids.append(oid)
                        inserted_any = inserted_any or inserted
                    summary['queued' if inserted_any else 'skipped'].append(record['path'])
                except ValueError as error:
                    summary['held'].append(record['path'])
                    problems.append(str(error))
            summary['stale'] = stale_rows(db, set(queued_ids))
            if summary['stale']:
                problems.append(str(len(summary['stale'])) + ' board message(s) from an earlier run were never '
                                'delivered and are still queued; check whether Paco is still in those spaces')
            if problems:
                notify_admin(db, config, 'Board update ' + run_key + ' held or failed for:\n' +
                             '\n'.join('- ' + p for p in problems), run_key)
        finally:
            db.close()
    finally:
        lock.__exit__(None, None, None)
    summary['errors'] = problems
    out.write(json.dumps(summary) + '\n')
    return summary


def main():
    parser = argparse.ArgumentParser(description='Queue the weekly Asana board update through Paco.')
    parser.add_argument('--config', required=True, type=Path)
    parser.add_argument('--client', action='append',
                        help='Client folder path; repeatable. Default: every mapped client')
    parser.add_argument('--dry-run', action='store_true', help='Print the messages; queue nothing')
    parser.add_argument('--rerun', action='store_true', help='Post again this week under a new run key')
    args = parser.parse_args()
    run(json.loads(args.config.read_text(encoding='utf-8')),
        clients=args.client, dry_run=args.dry_run, rerun=args.rerun)


if __name__ == '__main__':
    main()
