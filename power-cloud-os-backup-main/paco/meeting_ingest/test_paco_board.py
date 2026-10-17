import io
import json
import tempfile
import unittest
from datetime import datetime, timedelta, timezone
from pathlib import Path
from types import SimpleNamespace
from . import core
from . import paco_board as board
from .paco import connect
from .paco_worker import board_delivery_enabled, is_board_post

NOW = datetime(2026, 9, 14, 14, 0, tzinfo=timezone.utc)  # Monday 10:00 ET
GID = '1209498416538424'


def stamp(days_ago):
    return (NOW - timedelta(days=days_ago)).isoformat().replace('+00:00', 'Z')


def task(name, *, done=False, completed_days_ago=None, due=None, owner='Ada', modified_days_ago=1, section='In progress', gid=GID):
    return {'gid': 'g' + name, 'name': name, 'completed': done,
            'completed_at': stamp(completed_days_ago) if completed_days_ago is not None else None,
            'due_on': due, 'due_at': None, 'assignee': {'name': owner} if owner else None,
            'modified_at': stamp(modified_days_ago),
            'memberships': [{'project': {'gid': gid}, 'section': {'name': section}}]}


PROJECT = {'gid': GID, 'name': 'Brixton', 'permalink_url': 'https://app.asana.com/0/' + GID,
           'current_status_update': {'created_at': stamp(3), 'status_type': 'on_track', 'title': 'On track'}}
SECTIONS = [{'name': 'Backlog'}, {'name': 'In progress'}, {'name': 'With client'}, {'name': 'Done'}]
TASKS = [
    task('Ship labels', done=True, completed_days_ago=2, section='Done'),
    task('Old win', done=True, completed_days_ago=20, section='Done'),
    task('Fix payout recon', due='2026-09-03', owner='Steve'),
    task('Write use case', due='2026-09-17'),
    task('Unowned idea', owner=None, section='Backlog', modified_days_ago=40),
    task('Forgotten build', modified_days_ago=21, due=None),
    task('Parked item', section='With client', modified_days_ago=30, due='2026-10-30'),
]
SUMMARIES = [{'kind': 'working', 'name': 'exec_summary_2026-09-14.md', 'date': '2026-09-14', 'link': 'https://drive.google.com/file/d/W1/view'},
             {'kind': 'deliverables', 'name': 'Brixton_Executive_Summary_2026-09-14.docx', 'date': '2026-09-14', 'link': 'https://drive.google.com/file/d/D1/view'}]


class FakeReader:
    def __init__(self, project=PROJECT, sections=SECTIONS, tasks=TASKS, fail_for=()):
        self._project, self._sections, self._tasks, self.fail_for = project, sections, tasks, fail_for

    def project(self, gid):
        if gid in self.fail_for:
            raise RuntimeError('Asana 403 for ' + gid)
        return dict(self._project, gid=gid)

    def sections(self, gid):
        return self._sections

    def tasks(self, gid):
        return [dict(t, memberships=[{'project': {'gid': gid}, 'section': m['section']} for m in t['memberships']])
                for t in self._tasks]


def folder(fid, name):
    return {'id': fid, 'name': name, 'mimeType': board.FOLDER}


def doc(fid, name):
    return {'id': fid, 'name': name, 'mimeType': 'text/markdown', 'webViewLink': 'https://drive.google.com/file/d/' + fid + '/view'}


class FakeDrive:
    """Brixton (folder fB) has this week's draft and render plus an old draft; Acme (fA) has an old draft only."""
    tree = {
        'fB': [folder('fBw', 'working'), folder('fBd', 'deliverables'), folder('fBs', 'source'), doc('x', 'CONTEXT.md')],
        'fBw': [doc('W0', 'exec_summary_2026-08-31.md'), doc('W1', 'exec_summary_2026-09-14.md'), doc('W2', 'exec_summary_2026-09-12.md'), doc('n', 'notes.md')],
        'fBd': [doc('D1', 'Brixton_Executive_Summary_2026-09-14.docx'), doc('D2', 'Brixton_Executive_Summary_2026-09-14.pdf'), doc('D0', 'Brixton_Assessment_2026-09-01.docx')],
        'fA': [folder('fAw', 'working')],
        'fAw': [doc('A0', 'exec_summary_2026-09-01.md')],
    }

    def children(self, parent):
        if parent == 'fBroken':
            raise RuntimeError('Drive 500')
        return list(self.tree.get(parent, []))


DOMAIN = '3hq9vy0'


def member(name, *, affiliation='INTERNAL', domain=DOMAIN, state='JOINED', kind='HUMAN'):
    """Shaped like a real Chat membership: affiliation and domainId are what the live API returns."""
    return {'name': 'spaces/X/members/' + name, 'state': state, 'role': 'ROLE_MEMBER',
            'affiliation': affiliation,
            'member': {'name': 'users/' + name, 'displayName': name, 'type': kind, 'domainId': domain}}


class FakeChat:
    """Spaces Paco belongs to, with their membership. Anything else raises NotInSpace, as Chat does."""

    def __init__(self, spaces, counts=None):
        self.spaces, self.counts = spaces, counts or {}

    def space(self, space):
        if space not in self.spaces:
            raise board.NotInSpace('Paco is not a member of ' + space)
        joined = len([m for m in self.spaces[space]
                      if m['member']['type'] == 'HUMAN' and m['state'] == 'JOINED'])
        return {'name': space, 'displayName': space.split('/')[-1],
                'membershipCount': {'joinedDirectHumanUserCount': self.counts.get(space, joined)}}

    def members(self, space):
        if space not in self.spaces:
            raise board.NotInSpace('Paco is not a member of ' + space)
        return list(self.spaces[space])


STAFF = [member('Mike'), member('Steve'), member('Paco', kind='BOT')]
WITH_CLIENT = [member('Mike'), member('Julie Fitzpatrick', affiliation='EXTERNAL', domain='other')]


class AudienceTests(unittest.TestCase):
    """The check that replaced the static allowlist. A list cannot notice a client joining later."""

    def test_all_staff_passes_and_reports_apps(self):
        detail = board.audit_audience(FakeChat({'spaces/TEAM': STAFF}), 'spaces/TEAM', DOMAIN)
        self.assertEqual((detail['people'], detail['apps']), (2, ['Paco']))

    def test_external_member_refuses(self):
        with self.assertRaises(board.AudienceUnsafe) as caught:
            board.audit_audience(FakeChat({'spaces/TEAM': WITH_CLIENT}), 'spaces/TEAM', DOMAIN)
        self.assertIn('Julie Fitzpatrick', str(caught.exception))
        self.assertIn('not an internal space', str(caught.exception))

    def test_internal_affiliation_but_foreign_domain_refuses(self):
        sneaky = [member('Mike'), member('Contractor', domain='someone-else')]
        with self.assertRaises(board.AudienceUnsafe):
            board.audit_audience(FakeChat({'spaces/TEAM': sneaky}), 'spaces/TEAM', DOMAIN)
        self.assertTrue(board.audit_audience(FakeChat({'spaces/TEAM': sneaky}), 'spaces/TEAM', None),
                        'without a configured domain id the affiliation flag is the only signal')

    def test_invited_but_not_yet_joined_still_counts(self):
        pending = [member('Mike'), member('Client', affiliation='EXTERNAL', domain='x', state='INVITED')]
        with self.assertRaises(board.AudienceUnsafe):
            board.audit_audience(FakeChat({'spaces/TEAM': pending}, {'spaces/TEAM': 1}), 'spaces/TEAM', DOMAIN)

    def test_incomplete_member_list_fails_closed(self):
        chat = FakeChat({'spaces/TEAM': STAFF}, {'spaces/TEAM': 9})
        with self.assertRaises(board.AudienceUnsafe) as caught:
            board.audit_audience(chat, 'spaces/TEAM', DOMAIN)
        self.assertIn('incomplete', str(caught.exception))

    def test_not_a_member_is_its_own_signal(self):
        with self.assertRaises(board.NotInSpace):
            board.audit_audience(FakeChat({}), 'spaces/TEAM', DOMAIN)


class ParsingTests(unittest.TestCase):
    def test_project_gid_from_every_url_shape(self):
        for url in ['https://app.asana.com/1/89396020630874/project/1212806164665545',
                    'https://app.asana.com/1/89396020630874/project/1212806164665545/board/1205116454010100',
                    '[Brixton](https://app.asana.com/1/89396020630874/project/1212806164665545)',
                    'https://app.asana.com/0/1212806164665545/list']:
            self.assertEqual(core.asana_project_gid(url), '1212806164665545', url)
        self.assertIsNone(core.asana_project_gid('"ABSCI Project" in the workspace'))
        self.assertIsNone(core.asana_project_gid('https://app.asana.com/1/89396020630874/task/1218018152710310'))

    def test_chat_space_from_every_shape(self):
        for value in ['spaces/AAQA9f6K0zw', 'https://chat.google.com/room/AAQA9f6K0zw?cls=7',
                      'https://mail.google.com/chat/u/0/#chat/space/AAQA9f6K0zw']:
            self.assertEqual(core.chat_space_name(value), 'spaces/AAQA9f6K0zw', value)
        self.assertIsNone(core.chat_space_name('the Brixton room'))
        self.assertIsNone(core.chat_space_name('https://chat.google.com/dm/AAQA9f6K0zw'))

    def test_client_record_carries_board_fields_and_ignores_placeholders(self):
        record = core.client_record('Brixton', '- Asana project: https://app.asana.com/1/1/project/123 (confirmed)\n'
                                               '- Project chat: https://chat.google.com/room/AAAAbbb_-1\n')
        self.assertEqual((record['asana_project'], record['chat_space']), ('123', 'spaces/AAAAbbb_-1'))
        self.assertEqual(record['names'], ['Brixton'])
        blank = core.client_record('New', '- Asana project: {URL of the existing project}\n- Project chat: none\n')
        self.assertEqual((blank['asana_project'], blank['chat_space']), (None, None))
        two = core.client_record('Two', '- Asana project: https://app.asana.com/0/1/x\n- Asana project: https://app.asana.com/0/2/x\n'
                                        '- Project chat: spaces/A\n')
        self.assertIsNone(two['asana_project'], 'two projects is a hold, not a guess')


class ReviewTests(unittest.TestCase):
    def setUp(self):
        self.facts = board.review(PROJECT, SECTIONS, TASKS, NOW)

    def test_counts_and_window(self):
        f = self.facts
        self.assertEqual((f['total'], f['open'], f['done'], f['percent_complete']), (7, 5, 2, 29))
        self.assertEqual([t['name'] for t in f['completed_this_week']], ['Ship labels'])
        self.assertEqual(f['week_of'], '2026-09-14')
        self.assertEqual(f['open_by_stage'], {'Backlog': 1, 'In progress': 3, 'With client': 1})

    def test_past_due_due_soon_hygiene_and_stale(self):
        f = self.facts
        self.assertEqual(f['past_due'], [{'name': 'Fix payout recon', 'owner': 'Steve', 'due': '2026-09-03',
                                          'days_overdue': 11, 'stage': 'In progress'}])
        self.assertEqual([t['name'] for t in f['due_this_week']], ['Write use case'])
        self.assertEqual((f['unowned_open'], f['undated_open']), (1, 2))
        self.assertEqual([t['name'] for t in f['stale_active']], ['Forgotten build'],
                         'backlog and with-client items are not stale; active untouched work is')
        self.assertEqual(f['stale_active'][0]['idle_days'], 21)
        self.assertEqual(f['status_update']['age_days'], 3)
        self.assertEqual(f['thin_data'], [])

    def test_thin_data_is_named_not_reported_as_health(self):
        empty = board.review(dict(PROJECT, current_status_update=None), SECTIONS, [], NOW)
        self.assertIn('the board is empty', empty['thin_data'])
        self.assertIn('no project status update has ever been posted', empty['thin_data'])
        unowned = board.review(PROJECT, SECTIONS, [task('a', owner=None), task('b', owner=None), task('c')], NOW)
        self.assertIn('most open tasks have no owner', unowned['thin_data'])


class SummaryLookupTests(unittest.TestCase):
    def test_newest_of_each_kind_inside_the_week(self):
        found = board.find_summaries(FakeDrive(), {'folder_id': 'fB'}, NOW)
        self.assertEqual([(s['kind'], s['name']) for s in found],
                         [('working', 'exec_summary_2026-09-14.md'), ('deliverables', 'Brixton_Executive_Summary_2026-09-14.docx')])
        self.assertEqual(found[0]['link'], 'https://drive.google.com/file/d/W1/view')

    def test_old_summaries_and_missing_folders_yield_nothing(self):
        self.assertEqual(board.find_summaries(FakeDrive(), {'folder_id': 'fA'}, NOW), [])
        self.assertEqual(board.find_summaries(FakeDrive(), {'folder_id': None}, NOW), [])
        self.assertEqual(board.find_summaries(None, {'folder_id': 'fB'}, NOW), [])

    def test_summary_message(self):
        text = board.render_summary('Brixton', '2026-09-14', SUMMARIES)
        self.assertTrue(text.startswith('*Brixton executive summary · week of 2026-09-14*'))
        self.assertIn('Internal draft: <https://drive.google.com/file/d/W1/view|exec_summary_2026-09-14.md>', text)
        self.assertIn('Client-facing render: <https://drive.google.com/file/d/D1/view|Brixton_Executive_Summary_2026-09-14.docx>', text)
        self.assertIn('only after a consultant reviews it', text)


class RenderTests(unittest.TestCase):
    def test_attention_shape(self):
        text = board.render_attention('Brixton', board.review(PROJECT, SECTIONS, TASKS, NOW), summaries=SUMMARIES)
        self.assertTrue(text.startswith('*Brixton tasks needing attention · week of 2026-09-14*'))
        self.assertIn('<https://app.asana.com/0/' + GID + '|Brixton> · 5 open, 2 done (29%) · 1 closed this week · status update 3 days ago', text)
        self.assertIn('*Past due (1)*', text)
        self.assertIn('Fix payout recon (Steve) · due 2026-09-03, 11 days over', text)
        self.assertIn('*Due this week (1)*', text)
        self.assertIn('Forgotten build (Ada) · untouched 21 days', text)
        self.assertIn('*Hygiene*: 1 open without an owner, 2 without a due date.', text)
        self.assertNotIn('Done this week', text, 'closed work lives in the exec summary, not the attention list')
        self.assertNotIn('Health read', text, 'off unless board_health_read is configured')
        self.assertNotIn('No executive summary', text)
        self.assertIn('Internal team view, not for the client.', text)
        self.assertNotIn('—', text, 'no em-dashes in anything the OS writes')

    def test_attention_without_summary_or_problems(self):
        facts = board.review(dict(PROJECT, current_status_update=None), SECTIONS, [task('Quiet', due='2026-11-01')], NOW)
        text = board.render_attention('Brixton', facts, health='Reads as quiet.', summaries=[])
        self.assertIn('Nothing on the board needs attention this week.', text)
        self.assertIn('_No executive summary dated this week in working/ yet._', text)
        self.assertIn('*Health read (Paco, inferred)*: Reads as quiet.', text)
        self.assertIn('no status update on the project', text)
        self.assertIn('_Thin data:', text)

    def test_attention_respects_chat_limit(self):
        many = [task('Overdue task number %03d with a deliberately long descriptive title' % i, due='2026-01-01') for i in range(300)]
        text = board.render_attention('Brixton', board.review(PROJECT, SECTIONS, many, NOW))
        self.assertLessEqual(len(text), board.CHAT_LIMIT)
        self.assertIn('*Past due (300)*', text)
        self.assertIn(' more', text)


class QueueTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(); self.addCleanup(self.temp.cleanup)
        self.config = {'database': str(Path(self.temp.name) / 'paco.db'), 'enable_board_delivery': True,
                       'allowed_users': ['mike@firm.example'], 'board_admin': 'mike@firm.example'}
        self.db = connect(self.config['database']); self.addCleanup(self.db.close)

    def test_one_row_per_client_kind_and_week(self):
        oid, inserted = board.queue(self.db, self.config, 'Brixton', 'spaces/TEAM', 'hello', '2026-W38')
        again, inserted_again = board.queue(self.db, self.config, 'Brixton', 'spaces/TEAM', 'changed', '2026-W38')
        summary_id, _ = board.queue(self.db, self.config, 'Brixton', 'spaces/TEAM', 'link', '2026-W38', board.SUMMARY)
        self.assertEqual((oid, inserted, again, inserted_again), (oid, True, oid, False))
        self.assertTrue(oid.startswith('client-board-') and not oid.startswith('client-board-summary-'))
        self.assertTrue(summary_id.startswith('client-board-summary-'))
        self.assertEqual(self.db.execute('SELECT count(*) FROM paco_outbox').fetchone()[0], 2)
        self.assertNotEqual(board.outbox_id('Brixton', '2026-W38'), board.outbox_id('Brixton', '2026-W38:rerun-1'))

    def test_master_switch_and_malformed_space(self):
        with self.assertRaises(ValueError):
            board.queue(self.db, self.config, 'Brixton', 'not-a-space', 'hello', '2026-W38')
        self.config['enable_board_delivery'] = False
        with self.assertRaises(ValueError):
            board.queue(self.db, self.config, 'Brixton', 'spaces/TEAM', 'hello', '2026-W38')
        self.assertEqual(self.db.execute('SELECT count(*) FROM paco_outbox').fetchone()[0], 0)

    def test_worker_keeps_only_the_pause_switch(self):
        self.assertTrue(board_delivery_enabled(self.config))
        self.assertFalse(board_delivery_enabled(dict(self.config, enable_board_delivery=False)))
        self.assertFalse(board_delivery_enabled({}))
        self.assertTrue(is_board_post('client-board-abc'))
        self.assertTrue(is_board_post('client-board-summary-abc'))
        self.assertFalse(is_board_post('client-board-admin-abc'), 'admin notes take the DM path')
        self.assertFalse(is_board_post('client-monday-abc'))

    def test_admin_note_goes_to_bound_dm_only(self):
        self.assertIsNone(board.notify_admin(self.db, self.config, 'held', '2026-W38'))
        with self.db:
            self.db.execute('INSERT INTO paco_users VALUES(?,?,?)', ('mike@firm.example', 'users/1', 'spaces/DM'))
        oid = board.notify_admin(self.db, self.config, 'held', '2026-W38')
        row = self.db.execute('SELECT * FROM paco_outbox WHERE id=?', (oid,)).fetchone()
        self.assertEqual((row['space'], json.loads(row['body'])['text']), ('spaces/DM', 'held'))
        self.assertTrue(oid.startswith('client-board-admin-'))
        self.assertFalse(is_board_post(oid), 'admin notes take the allowlisted-DM path in the worker')


class RunTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(); self.addCleanup(self.temp.cleanup)
        root = Path(self.temp.name)
        index = [{'path': 'Brixton', 'folder_id': 'fB', 'names': ['Brixton'], 'domains': [], 'asana_project': GID, 'chat_space': 'spaces/TEAM'},
                 {'path': 'Brixton/Custom', 'folder_id': 'fBc', 'names': [], 'domains': [], 'asana_project': GID, 'chat_space': 'spaces/TEAM'},
                 {'path': 'Acme', 'folder_id': 'fA', 'names': ['Acme'], 'domains': [], 'asana_project': '42', 'chat_space': 'spaces/OTHER'},
                 {'path': 'Legacy', 'folder_id': 'fL', 'names': ['Legacy'], 'domains': []},
                 {'path': 'Broken', 'folder_id': 'fBroken', 'names': ['Broken'], 'domains': [], 'asana_project': '99', 'chat_space': 'spaces/TEAM'}]
        (root / 'index.json').write_text(json.dumps(index))
        self.config = {'database': str(root / 'paco.db'), 'index_path': str(root / 'index.json'),
                       'enable_board_delivery': True,
                       'allowed_users': ['mike@firm.example'], 'board_admin': 'mike@firm.example'}
        self.config['board_internal_domain_id'] = DOMAIN
        self.chat = FakeChat({'spaces/TEAM': STAFF, 'spaces/OTHER': WITH_CLIENT})
        db = connect(self.config['database'])
        with db:
            db.execute('INSERT INTO paco_users VALUES(?,?,?)', ('mike@firm.example', 'users/1', 'spaces/DM'))
        db.close()

    def rows(self):
        db = connect(self.config['database'])
        try:
            return db.execute('SELECT id,space,body FROM paco_outbox ORDER BY space, id').fetchall()
        finally:
            db.close()

    def test_dry_run_prints_and_writes_nothing(self):
        out = io.StringIO()
        summary = board.run(self.config, dry_run=True, now=NOW, reader=FakeReader(fail_for=('99',)), drive=FakeDrive(), chat=self.chat, out=out)
        printed = out.getvalue()
        self.assertIn('=== Brixton -> spaces/TEAM', printed)
        self.assertEqual(printed.count('=== '), 1, 'parent and nested share one project and space; Acme is refused')
        self.assertIn('*Brixton executive summary', printed)
        self.assertIn('*Brixton tasks needing attention', printed)
        self.assertNotIn('*Acme', printed, 'Acme is refused: an outside consultancy sits in its space')
        self.assertIn('!!! Acme: not an internal space', printed)
        self.assertIn('!!! Broken: RuntimeError', printed)
        self.assertEqual(summary['queued'], [])
        self.assertEqual(len(self.rows()), 0)

    def test_run_queues_two_messages_holds_and_isolates_failures(self):
        summary = board.run(self.config, now=NOW, reader=FakeReader(fail_for=('99',)), drive=FakeDrive(), chat=self.chat, out=io.StringIO())
        self.assertEqual(summary['queued'], ['Brixton'])
        self.assertEqual(summary['held'], ['Acme'], 'a space with an outsider in it is held, not posted')
        self.assertEqual(len(summary['errors']), 2)
        self.assertTrue(any(e.startswith('Broken: RuntimeError') for e in summary['errors']))
        rows = self.rows()
        self.assertEqual([r['space'] for r in rows], ['spaces/DM', 'spaces/TEAM', 'spaces/TEAM'])
        team = [r for r in rows if r['space'] == 'spaces/TEAM']
        self.assertEqual(sum(r['id'].startswith('client-board-summary-') for r in team), 1, 'one summary link row')
        self.assertEqual(sum(not r['id'].startswith('client-board-summary-') for r in team), 1, 'one attention row')
        self.assertIn('exec_summary_2026-09-14.md', ''.join(r['body'] for r in team))
        note = json.loads(rows[0]['body'])['text']
        self.assertIn('Broken: RuntimeError', note)
        self.assertIn('Acme: not an internal space', note)
        self.assertIn('Julie Fitzpatrick', note)
        self.assertNotIn('Fix payout recon', note, 'board content stays out of the admin note')
        again = board.run(self.config, now=NOW, reader=FakeReader(fail_for=('99',)), drive=FakeDrive(), chat=self.chat, out=io.StringIO())
        self.assertEqual((again['queued'], again['skipped']), ([], ['Brixton']))
        self.assertEqual(again['stale'], [], 'this run own rows are not stale, and an admin note is never stale')
        self.assertEqual(len(self.rows()), 3, 'a second run in the same week posts nothing new, admin note deduplicated')

    def test_undelivered_rows_from_an_earlier_week_reach_the_admin(self):
        board.run(self.config, clients=['Brixton'], now=NOW, reader=FakeReader(), drive=FakeDrive(), chat=self.chat, out=io.StringIO())
        later = board.run(self.config, clients=['Brixton'], now=NOW + timedelta(days=7),
                          reader=FakeReader(), drive=FakeDrive(), chat=self.chat, out=io.StringIO())
        self.assertEqual(len(later['stale']), 2, 'last week two messages were queued and never delivered')
        note = [json.loads(r['body'])['text'] for r in self.rows() if r['space'] == 'spaces/DM'][0]
        self.assertIn('never delivered', note)
        self.assertIn('whether Paco is still in those spaces', note)

    def test_rerun_uses_a_fresh_key(self):
        board.run(self.config, clients=['Brixton'], now=NOW, reader=FakeReader(), drive=FakeDrive(), chat=self.chat, out=io.StringIO())
        summary = board.run(self.config, clients=['Brixton'], now=NOW, reader=FakeReader(), drive=FakeDrive(), chat=self.chat, rerun=True, out=io.StringIO())
        self.assertEqual(summary['queued'], ['Brixton'])
        self.assertIn(':rerun-', summary['run_key'])
        self.assertEqual(len([r for r in self.rows() if r['space'] == 'spaces/TEAM']), 4)

    def test_drive_failure_still_posts_attention(self):
        summary = board.run(self.config, clients=['Broken'], now=NOW, reader=FakeReader(), drive=FakeDrive(), chat=self.chat, out=io.StringIO())
        self.assertEqual(summary['queued'], ['Broken'])
        self.assertTrue(any('summary lookup failed' in e for e in summary['errors']))
        team = [r for r in self.rows() if r['space'] == 'spaces/TEAM']
        self.assertEqual(len(team), 1)
        self.assertIn('No executive summary dated this week', json.loads(team[0]['body'])['text'])

    def test_missing_token_tells_admin_and_reads_nothing(self):
        summary = board.run(dict(self.config, asana_token_path=str(Path(self.temp.name) / 'no-token')),
                            now=NOW, chat=self.chat, out=io.StringIO())
        self.assertEqual((summary['queued'], summary['held']), ([], []))
        self.assertTrue(summary['errors'][0].startswith('Asana token file is missing'))
        rows = self.rows()
        self.assertEqual([r['space'] for r in rows], ['spaces/DM'])
        self.assertIn('Asana token file is missing', json.loads(rows[0]['body'])['text'])


class LedgerLockTests(unittest.TestCase):
    """The Chat worker holds this lock for the length of its blocking pull, and the board runs
    weekly, so a single failed attempt would cost a whole week rather than a minute."""

    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(); self.addCleanup(self.temp.cleanup)
        self.db = str(Path(self.temp.name) / 'paco.db')

    def test_waits_for_a_busy_lock_then_succeeds(self):
        from .filing import journal_lock
        held = journal_lock(self.db); held.__enter__()
        slept = []

        def release_after_two(seconds):
            slept.append(seconds)
            if len(slept) == 2:
                held.__exit__(None, None, None)
        lock = board.acquire_ledger(self.db, attempts=5, delay=15, sleep=release_after_two)
        self.assertEqual(slept, [15, 15], 'retried until the holder let go')
        lock.__exit__(None, None, None)

    def test_gives_up_loudly_rather_than_posting_nothing_silently(self):
        from .filing import journal_lock
        held = journal_lock(self.db); held.__enter__()
        self.addCleanup(held.__exit__, None, None, None)
        slept = []
        with self.assertRaises(board.LOCK_BUSY):
            board.acquire_ledger(self.db, attempts=3, delay=15, sleep=slept.append)
        self.assertEqual(slept, [15, 15], 'no sleep after the final attempt')

    def test_free_lock_is_taken_without_waiting(self):
        slept = []
        lock = board.acquire_ledger(self.db, sleep=slept.append)
        self.assertEqual(slept, [])
        lock.__exit__(None, None, None)

    def test_defaults_outlast_the_chat_worker_pull(self):
        self.assertGreaterEqual(board.LOCK_ATTEMPTS * board.LOCK_DELAY, 300,
                                'must wait longer than a 40s pull plus its 10s idle gap, several times over')


class NarrativeTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(); self.addCleanup(self.temp.cleanup)
        self.key = Path(self.temp.name) / 'anthropic.key'; self.key.write_text('sk-test')
        self.facts = board.review(PROJECT, SECTIONS, TASKS, NOW)
        self.config = {'anthropic_key_path': str(self.key)}

    def fake_client(self, response=None, error=None, beta_type_error=False):
        calls = []

        def create(**kwargs):
            calls.append(kwargs)
            if beta_type_error and 'fallbacks' in kwargs:
                raise TypeError('unexpected keyword fallbacks')
            if error:
                raise error
            return response
        client = SimpleNamespace(messages=SimpleNamespace(create=create),
                                 beta=SimpleNamespace(messages=SimpleNamespace(create=create)))
        return (lambda api_key: client), calls

    def test_text_is_joined_and_request_shape_is_current(self):
        response = SimpleNamespace(stop_reason='end_turn', content=[SimpleNamespace(type='thinking', thinking=''),
                                                                     SimpleNamespace(type='text', text=' Reads as steady. ')])
        factory, calls = self.fake_client(response)
        self.assertEqual(board.narrative(self.facts, self.config, factory), 'Reads as steady.')
        self.assertEqual(calls[0]['model'], 'claude-opus-5')
        self.assertEqual(calls[0]['fallbacks'], 'default')
        self.assertEqual(calls[0]['output_config'], {'effort': 'medium'})
        self.assertNotIn('thinking', calls[0], 'Opus 5 thinks adaptively by default; no budget_tokens')
        self.assertIn('Fix payout recon', calls[0]['messages'][0]['content'])

    def test_refusal_and_errors_fail_soft(self):
        factory, _ = self.fake_client(SimpleNamespace(stop_reason='refusal', content=[]))
        self.assertIsNone(board.narrative(self.facts, self.config, factory))
        factory, _ = self.fake_client(error=RuntimeError('network'))
        self.assertIsNone(board.narrative(self.facts, self.config, factory))
        self.assertEqual(self.facts['_narrative_error'], 'RuntimeError')

    def test_older_sdk_without_fallbacks_still_runs(self):
        response = SimpleNamespace(stop_reason='end_turn', content=[SimpleNamespace(type='text', text='ok')])
        factory, calls = self.fake_client(response, beta_type_error=True)
        self.assertEqual(board.narrative(self.facts, self.config, factory), 'ok')
        self.assertEqual(len(calls), 2)
        self.assertNotIn('fallbacks', calls[1])

    def test_missing_key_means_facts_only(self):
        self.assertIsNone(board.narrative(self.facts, {}, lambda api_key: None))
        self.assertIsNone(board.narrative(self.facts, {'anthropic_key_path': str(self.key) + '.missing'}, lambda api_key: None))


if __name__ == '__main__':
    unittest.main()
