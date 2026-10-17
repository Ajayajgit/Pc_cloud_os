"""Deterministic routing and local audit state. No network or production writes."""
import hashlib
import json
import re
import sqlite3
from datetime import datetime, timezone
from pathlib import Path

NON_CLIENT = {'templates', 'internal', 'archive', 'feedback', 'fonts', 'logos', 'tasks'}
RECORD_DIRS = {'source', 'working', 'deliverables', 'execution'}
VENDORS = {'oracle.com': 'NetSuite', 'netsuite.com': 'NetSuite',
           'spscommerce.com': 'SPS Commerce', 'celigo.com': 'Celigo',
           'andersonfrank.com': 'Anderson Frank'}


def load_vendors(path):
    vendors = dict(VENDORS)
    for line in Path(path).read_text(encoding='utf-8-sig').splitlines():
        line = line.strip()
        if not line or line.startswith('#'):
            continue
        parts = re.split(r'\s+', line.lstrip('- '), maxsplit=1)
        if len(parts) != 2 or not re.fullmatch(r'[a-z0-9-]+(?:\.[a-z0-9-]+)+', parts[0].lower()):
            raise ValueError('Vendor lines must contain a domain followed by a label')
        vendors[parts[0].lower()] = parts[1].lstrip('—-: ')
    return vendors


def normalize(value):
    return re.sub(r'[^a-z0-9]', '', value.lower())


def field(text, name):
    values = []
    for value in re.findall(r'^\s*[-*]\s*' + re.escape(name) + r':\s*([^\r\n]*)', text, re.I | re.M):
        if '{' in value:
            continue
        for part in value.split(','):
            part = part.strip().strip('`').strip()
            if part and part.lower() not in {'none', 'n/a', 'tbd', 'unknown'}:
                values.append(part)
    return values


def asana_project_gid(value):
    """Project gid from an Asana URL in either the /1/{workspace}/project/{gid} or legacy /0/{gid} shape."""
    match = re.search(r'app\.asana\.com/(?:\d+/\d+/project|0)/(\d+)', value or '')
    return match.group(1) if match else None


def chat_space_name(value):
    """Canonical spaces/{id} from a Chat room URL, a Gmail-embedded Chat URL, or a bare space name."""
    match = re.search(r'(?:chat\.google\.com/room/|#chat/space/|^\s*spaces/)([A-Za-z0-9_-]+)', value or '')
    return 'spaces/' + match.group(1) if match else None


def client_record(path, text, folder_id=None):
    names = [path, path.split('/')[-1]] + field(text, 'NetSuite customer') + field(text, 'Meeting aliases')
    domains = [d.lower().lstrip('@') for d in field(text, 'Email domains')]
    domains = [d for d in domains if re.fullmatch(r'[a-z0-9-]+(?:\.[a-z0-9-]+)+', d)]
    # Board updates: exactly one project and one space, or nothing. Two of either is a hold, not a guess.
    projects = sorted({g for g in map(asana_project_gid, field(text, 'Asana project')) if g})
    spaces = sorted({s for s in map(chat_space_name, field(text, 'Project chat')) if s})
    return {'path': path, 'folder_id': folder_id, 'names': sorted(set(names)), 'domains': sorted(set(domains)),
            'asana_project': projects[0] if len(projects) == 1 else None,
            'chat_space': spaces[0] if len(spaces) == 1 else None}


def build_client_index(root):
    """Read only root clients and one-level custom projects; never recurse into evidence."""
    root = Path(root)
    result = []
    for client in sorted(root.iterdir()):
        if not client.is_dir() or client.name.startswith('.') or client.name.lower() in NON_CLIENT:
            continue
        folders = [client] + [p for p in sorted(client.iterdir()) if p.is_dir()
                              and not p.name.startswith('.') and p.name.lower() not in RECORD_DIRS]
        for folder in folders:
            context = folder / 'CONTEXT.md'
            if context.is_file():
                result.append(client_record(folder.relative_to(root).as_posix(), context.read_text(encoding='utf-8-sig')))
    return result


def match_clients(name, index):
    key = normalize(name)
    if not key:
        return []
    exact = [c['path'] for c in index if any(normalize(n) == key for n in c['names'])]
    if exact:
        return sorted(set(exact))
    # GW lesson: neither side may be a short key or an all-letter initialism.
    def initialism(n):
        return bool(re.fullmatch(r'[A-Z]{2,}', n.strip()))
    if len(key) < 5 or initialism(name):
        return []
    return sorted({c['path'] for c in index for n in c['names']
                   if len(normalize(n)) >= 5 and not initialism(n)
                   and (key in normalize(n) or normalize(n) in key)})


def attendee_domains(event):
    return sorted({a['email'].rsplit('@', 1)[1].lower() for a in event.get('attendees', [])
                   if '@' in a.get('email', '') and not a.get('resource')})


def private(event):
    return bool(re.search(r'\[private\]|(?:^|\|)\s*private\s*(?:\||$)', event.get('summary', ''), re.I))


def route(event, index, internal_domains, aliases=None, vendors=None):
    """First confident rung wins. Pending work is not marked as asked or filed."""
    # Mike's revised filing convention: root clients only; preserve nested records
    # in the index for visibility but never auto-select them as filing targets.
    index = [c for c in index if '/' not in c['path']]
    vendors = VENDORS if vendors is None else vendors
    domains = attendee_domains(event)
    internal = bool(domains) and set(domains) <= set(internal_domains)
    vendor_hits = sorted({vendors[d] for d in domains if d in vendors})
    kind = 'internal' if internal else ('third-party:' + ', '.join(vendor_hits) if vendor_hits else 'client')
    def decision(state, rung, reason, targets=None, prospect=None):
        return dict(state=state, rung=rung, reason=reason, targets=targets or [], prospect=prospect,
                    kind=kind, domains=domains)
    if private(event):
        return decision('skipped-private', 0, 'Explicit private tag')
    client_hits = sorted({c['path'] for c in index if set(c['domains']) & (set(domains) - set(internal_domains) - set(vendors))})
    if not event.get('artifacts'):
        if event.get('discovery_complete', True) is False:
            return decision('skipped-undiscovered', 0, 'No artifacts discovered; discovery incomplete, not proof of no recording')
        if client_hits:
            return decision('completeness-gap', 0, 'no transcript (recording not started)', client_hits)
        return decision('skipped-empty', 0, 'No recording, transcript, or notes')
    if client_hits:
        return decision('would-file' if len(client_hits) == 1 else 'needs-multi-client-review', 1,
                        'Attendee domain match' if len(client_hits) == 1 else 'Multiple clients; one original cannot have multiple destination parents', client_hits)
    title = event.get('summary', '')
    parts = [p.strip() for p in title.split('|')]
    aliases = aliases or {}
    alias = aliases.get('series', {}).get(event.get('recurringEventId', '')) or aliases.get('titles', {}).get(normalize(parts[0]))
    if alias:
        # Read confirmed aliases only; phase one never learns from simulated filings.
        if not alias.get('confirmed_by') or not alias.get('confirmed_at'):
            return decision('unfiled', 2, 'Alias lacks confirmation provenance')
        if alias.get('client') in {c['path'] for c in index}:
            return decision('would-file', 2, 'Confirmed alias', [alias['client']])
        if alias.get('prospect'):
            return decision('held-prospect', 2, 'Confirmed prospect alias', prospect=alias['prospect'])
        return decision('unfiled', 2, 'Alias destination no longer exists')
    if len(parts) > 1:
        if parts[0].lower() == 'internal':
            return decision('would-file', 2, 'Explicit Internal title', ['Internal'])
        hits = match_clients(parts[0], index)
        if len(hits) == 1:
            return decision('would-file', 2, 'Title name match', hits)
        if hits:
            return decision('unfiled', 2, 'Ambiguous title; human confirmation required', hits)
        if len(parts) >= 3 and parts[0] and parts[1].lower() == 'sales':
            return decision('held-prospect', 2, 'Sales title without existing client folder', prospect=parts[0])
    # Ordinary titles need no delimiter. Match whole names, never fragments of
    # words or inferred initials; retain every match for ambiguity review.
    title_words = ' '.join(re.findall(r'[a-z0-9]+', title.lower()))
    hits = sorted({c['path'] for c in index for name in c['names']
                   if (len(normalize(name)) >= 5 or normalize(name) == normalize(title))
                   and (words := ' '.join(re.findall(r'[a-z0-9]+', name.lower())))
                   and (' ' + words + ' ') in (' ' + title_words + ' ')})
    if hits:
        return decision('would-file' if len(hits) == 1 else 'unfiled', 2,
                        'Full client name in title' if len(hits) == 1 else
                        'Multiple client names in title; human confirmation required', hits)
    if internal:
        return decision('skipped-internal', 2, 'Internal-only meeting without deterministic client match; classifier deferred')
    return decision('unfiled', 2, 'Rungs 0–2 unresolved; client selection required')


def destinations(event, decision):
    if decision['state'] in {'already-shared', 'owner-review'}:
        return []
    return [f"{t}/source/" for t in decision['targets'] if '/' not in t]


def open_ledger(path=':memory:'):
    db = sqlite3.connect(path)
    db.row_factory = sqlite3.Row
    tables = {r[0] for r in db.execute("SELECT name FROM sqlite_master WHERE type='table'")}
    if tables:
        mode = db.execute("SELECT value FROM metadata WHERE key='mode'").fetchone() if 'metadata' in tables else None
        if not mode or mode['value'] != 'dry-run':
            db.close()
            raise ValueError('Refusing an existing database without a dry-run marker')
    db.executescript('''
      CREATE TABLE IF NOT EXISTS metadata (key TEXT PRIMARY KEY, value TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS events (
        organizer TEXT NOT NULL, event_id TEXT NOT NULL, start_time TEXT NOT NULL,
        rung INTEGER NOT NULL, state TEXT NOT NULL, decision TEXT NOT NULL,
        artifacts_before TEXT NOT NULL, artifacts_after TEXT NOT NULL DEFAULT '[]',
        exports TEXT NOT NULL DEFAULT '[]', card_message_id TEXT,
        created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
        PRIMARY KEY (organizer, event_id));
    ''')
    mode = db.execute("SELECT value FROM metadata WHERE key='mode'").fetchone()
    if mode and mode['value'] != 'dry-run':
        db.close()
        raise ValueError('Refusing a non-dry-run ledger')
    db.execute("INSERT OR IGNORE INTO metadata VALUES ('mode', 'dry-run')")
    db.commit()
    return db


def survey(events, index, internal_domains, db, aliases=None, vendors=None, exclusions=None):
    results = []
    exclusions = exclusions or {}
    for value in exclusions.values():
        if value.get('state') not in {'skipped-private', 'skipped-internal'} or not value.get('confirmed_by') or not value.get('confirmed_at'):
            raise ValueError('Exclusions require an internal/private state and confirmation provenance')
    with db:
        for event in events:
            if event.get('status') == 'cancelled':
                continue
            organizer = event['organizer']['email'].lower()
            if not event.get('id'):
                raise ValueError('Event is missing its Calendar instance ID')
            if organizer + ':' + event['id'] in exclusions:
                db.execute('DELETE FROM events WHERE organizer=? AND event_id=?', (organizer, event['id']))
                continue
            d = route(event, index, internal_domains, aliases, vendors)
            artifacts = event.get('artifacts', [])
            if event.get('storage_checked') and artifacts and d['state'] not in {'skipped-private', 'skipped-internal'}:
                shared = [a for a in artifacts if a.get('driveId')]
                other_owned = [a for a in artifacts if not a.get('driveId') and organizer not in
                               {o.get('emailAddress', '').lower() for o in a.get('owners', [])}]
                if len(shared) == len(artifacts):
                    d.update(state='already-shared', reason='All discovered originals are already in shared drives; preserve existing locations')
                elif shared:
                    d.update(state='owner-review', reason='Mixed shared and personal storage; preserve existing shared originals and review ownership')
                elif other_owned:
                    d.update(state='owner-review', reason='Personal Drive owner is not the organizer or ownership is unavailable; do not move as organizer')
            if event.get('discovery_complete', True) is False and d['state'] == 'would-file':
                d.update(state='unfiled', reason='Routing candidate found, but artifact discovery is incomplete')
            # No personal title, emails, or artifact IDs retained for silent exclusions.
            if d['state'] in {'skipped-private', 'skipped-internal', 'skipped-empty', 'skipped-undiscovered'}:
                db.execute('DELETE FROM events WHERE organizer=? AND event_id=?', (organizer, event['id']))
                continue
            start = event.get('start', {}).get('dateTime') or event.get('start', {}).get('date', '')
            record = dict(d, event_id=event['id'], organizer=organizer, start=start,
                          title=event.get('summary', ''), destinations=destinations(event, d))
            now = datetime.now(timezone.utc).isoformat()
            db.execute('''INSERT INTO events
              (organizer,event_id,start_time,rung,state,decision,artifacts_before,created_at,updated_at)
              VALUES (?,?,?,?,?,?,?,?,?) ON CONFLICT(organizer,event_id) DO UPDATE SET
              start_time=excluded.start_time,rung=excluded.rung,state=excluded.state,
              decision=excluded.decision,artifacts_before=excluded.artifacts_before,updated_at=excluded.updated_at''',
              (organizer, event['id'], start, d['rung'], d['state'], json.dumps(record),
               json.dumps(event.get('artifacts', [])), now, now))
            results.append(record)
    return results


def render_queue(db):
    def cell(value):
        return str(value).replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;').replace('|', '&#124;').replace('\r', ' ').replace('\n', ' ')
    lines = ['# Meeting ingest queue — DRY RUN', '',
             'Generated locally. No cards sent and no artifacts moved. Do not hand-edit.', '',
             '| Date | Organizer | Title | Attendee domains | Guess / targets | State | Reason |',
             '|---|---|---|---|---|---|---|']
    rows = db.execute("SELECT decision FROM events WHERE state IN ('asked','reminded','held-prospect','unfiled','needs-multi-client-review','owner-review') ORDER BY start_time DESC,organizer,event_id")
    for row in rows:
        d = json.loads(row['decision'])
        values = [d['start'], d['organizer'], d['title'], ', '.join(d['domains']),
                  d['prospect'] or ', '.join(d['targets']), d['state'], d['reason']]
        lines.append('| ' + ' | '.join(map(cell, values)) + ' |')
    return '\n'.join(lines) + '\n'
