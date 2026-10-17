import base64
import json
import sys
import tempfile
import unittest
from datetime import datetime, timedelta, timezone
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import Mock, patch
from . import paco_prep, paco_worker
from .paco import connect
from .paco_prep import ingest

A, B = '11111111-2222-4333-8444-555555555555', 'aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee'
NOW = datetime(2026, 9, 22, 13, 0, tzinfo=timezone.utc)
LATER = '2026-09-22T14:00:00Z'


def google_modules(*sessions):
    """Stand-ins for the lazily imported google auth modules; sessions are handed out in order."""
    handed = iter(sessions)
    service_account = SimpleNamespace(Credentials=Mock())
    requests = SimpleNamespace(AuthorizedSession=lambda *a, **k: next(handed))
    return {'google': SimpleNamespace(), 'google.oauth2': SimpleNamespace(service_account=service_account),
            'google.auth': SimpleNamespace(), 'google.auth.transport': SimpleNamespace(),
            'google.auth.transport.requests': requests}


def response(payload=None, status=200):
    result = Mock(status_code=status)
    result.json.return_value = payload or {}
    return result


class PrepIngest(unittest.TestCase):
    def setUp(self):
        self.db = connect(':memory:')
        self.addCleanup(self.db.close)
        with self.db:
            self.db.execute("INSERT INTO paco_users VALUES('a@example.com','users/a','spaces/dmA')")
            self.db.execute("INSERT INTO paco_users VALUES('b@example.com','users/b','spaces/dmB')")
        self.payload = dict(version=1, id=A + ':evt1:2026-09-22T14:00:00Z', tenant=A, expires=LATER, text='Prep — café')
        self.routes = {A: 'a@example.com', B: 'b@example.com'}
        self.allowed = ['a@example.com', 'b@example.com']

    def put(self, payload=None, routes=None, allowed=None):
        return ingest(self.db, self.payload if payload is None else payload, self.routes if routes is None else routes,
                      self.allowed if allowed is None else allowed, now=NOW)

    def count(self, table):
        return self.db.execute('SELECT count(*) FROM ' + table).fetchone()[0]

    def test_schema_rejections(self):
        extra = dict(self.payload, space='spaces/dmB')
        missing = {k: v for k, v in self.payload.items() if k != 'expires'}
        for payload in ([], {}, extra, missing, dict(self.payload, recipient='b@example.com'),
                        dict(self.payload, version=True), dict(self.payload, version=2), dict(self.payload, version='1'),
                        dict(self.payload, id='bad/id'), dict(self.payload, id=''), dict(self.payload, id='x' * 161),
                        dict(self.payload, tenant=B.upper()), dict(self.payload, tenant='not-a-uuid'), dict(self.payload, tenant=A.replace('-', '')),
                        dict(self.payload, expires='2026-09-22T12:59:59Z'), dict(self.payload, expires='2026-09-22T13:00:00Z'),
                        dict(self.payload, expires='2026-09-22T14:00:00+00:00'), dict(self.payload, expires='tomorrow'),
                        dict(self.payload, text=''), dict(self.payload, text='  '), dict(self.payload, text='x' * 4001), dict(self.payload, text=5)):
            with self.assertRaises(ValueError, msg=repr(payload)[:60]):
                self.put(payload, routes=dict(self.routes, **{B.upper(): "b@example.com"}))
        self.assertEqual(self.count('paco_outbox'), 0)

    def test_text_limit_is_inclusive(self):
        self.put(dict(self.payload, text='é' * 4000))

    def test_routing_rejections(self):
        with self.assertRaises(ValueError):
            self.put(routes={B: 'b@example.com'})
        with self.assertRaises(ValueError):
            self.put(allowed=['b@example.com'])
        with self.db:
            self.db.execute("DELETE FROM paco_users WHERE email='a@example.com'")
        with self.assertRaises(ValueError):
            self.put()
        self.assertEqual(self.count('paco_outbox'), 0)

    def test_happy_path_inserts_outbox_and_prep_row(self):
        oid = self.put()
        self.assertTrue(oid.startswith('client-prep-') and len(oid) == 52)
        out = self.db.execute('SELECT * FROM paco_outbox').fetchone()
        self.assertEqual((out['id'], out['space'], out['sent']), (oid, 'spaces/dmA', 0))
        self.assertEqual(json.loads(out['body']), {'text': self.payload['text']})
        row = self.db.execute('SELECT * FROM paco_prep_rows').fetchone()
        self.assertEqual(tuple(row), (oid, A, 'a@example.com', 'spaces/dmA', LATER, 0))

    def test_duplicate_is_one_row(self):
        self.assertEqual(self.put(), self.put())
        self.assertEqual((self.count('paco_outbox'), self.count('paco_prep_rows')), (1, 1))

    def test_conflicting_replay_does_not_replace(self):
        self.put()
        for changed in (dict(self.payload, text='changed'), dict(self.payload, expires='2026-09-22T15:00:00Z')):
            with self.assertRaises(ValueError):
                self.put(changed)
        self.assertEqual(json.loads(self.db.execute('SELECT body FROM paco_outbox').fetchone()[0])['text'], self.payload['text'])
        self.assertEqual(self.db.execute('SELECT expires FROM paco_prep_rows').fetchone()[0], LATER)

    def test_tenant_a_cannot_reach_owner_b(self):
        self.put()
        self.put(dict(self.payload, id=B + ':evt1:x', tenant=B))
        spaces = dict(self.db.execute('SELECT tenant,space FROM paco_prep_rows').fetchall())
        self.assertEqual(spaces, {A: 'spaces/dmA', B: 'spaces/dmB'})
        # The same producer id under a different tenant is a different message, not a replay.
        self.assertNotEqual(self.put(dict(self.payload, tenant=B)), self.put())

    def test_no_meeting_or_user_mutation(self):
        self.put()
        self.assertEqual(self.count('paco_meetings'), 0)
        self.assertEqual(self.count('paco_users'), 2)


class PrepRun(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.database = str(Path(self.temp.name) / 'paco.sqlite3')
        db = connect(self.database)
        with db:
            db.execute("INSERT INTO paco_users VALUES('a@example.com','users/a','spaces/dmA')")
        db.close()
        self.config = {'enable_prep_ingress': True, 'prep_subscription': 'projects/p/subscriptions/prep',
                       'chat_key_path': 'unused', 'database': self.database,
                       'prep_routes': {A: 'a@example.com'}, 'allowed_users': ['a@example.com']}

    def message(self, number, data):
        raw = data if isinstance(data, bytes) else json.dumps(data).encode()
        return {'ackId': 'ack%d' % number, 'message': {'messageId': 'm%d' % number, 'data': base64.b64encode(raw).decode()}}

    def test_gates(self):
        for config in (dict(self.config, enable_prep_ingress=False), dict(self.config, enable_prep_ingress='true'),
                       dict(self.config, prep_subscription='projects/p/topics/prep'), dict(self.config, prep_subscription=None)):
            with patch.dict(sys.modules, google_modules(Mock())), self.assertRaises(ValueError):
                paco_prep.run(config)

    def test_pull_ingests_valid_rejects_poison_and_acks_all(self):
        expires = (datetime.now(timezone.utc) + timedelta(hours=1)).strftime('%Y-%m-%dT%H:%M:%SZ')
        good = dict(version=1, id='e1', tenant=A, expires=expires, text='hello')
        session = Mock()
        session.post.return_value = response({'receivedMessages': [
            self.message(1, good), self.message(2, dict(good, tenant=B)), self.message(3, b'\xff'),
            self.message(4, b'x' * 50001)]})
        with patch.dict(sys.modules, google_modules(session)):
            paco_prep.run(self.config)
        acks = [c.kwargs['json']['ackIds'][0] for c in session.post.call_args_list if c.args[0].endswith(':acknowledge')]
        self.assertEqual(acks, ['ack1', 'ack2', 'ack3', 'ack4'])
        self.assertEqual(session.post.call_args_list[0].kwargs['json'], {'maxMessages': 20})
        db = connect(self.database)
        self.addCleanup(db.close)
        self.assertEqual(db.execute('SELECT count(*) FROM paco_outbox').fetchone()[0], 1)
        self.assertEqual(dict(db.execute('SELECT id,reason FROM paco_prep_rejections').fetchall()),
                         {'m2': 'ValueError', 'm3': 'UnicodeDecodeError', 'm4': 'ValueError'})


class PrepDelivery(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        root = Path(self.temp.name)
        self.database = str(root / 'paco.sqlite3')
        (root / 'index.json').write_text('[]')
        self.expires = (datetime.now(timezone.utc) + timedelta(hours=1)).strftime('%Y-%m-%dT%H:%M:%SZ')
        db = connect(self.database)
        with db:
            db.execute("INSERT INTO paco_users VALUES('a@example.com','users/a','spaces/dmA')")
            db.execute("INSERT INTO paco_users VALUES('b@example.com','users/b','spaces/dmB')")
            db.execute("INSERT INTO paco_outbox(id,space,body) VALUES('client-monday-x','spaces/monday','{\"text\": \"monday\"}')")
            db.execute("INSERT INTO paco_outbox(id,space,body) VALUES('client-private-x','spaces/dmB','{\"text\": \"private\"}')")
        self.prep = {}
        for tenant, event in ((A, 'e1'), (A, 'e2')):
            self.prep[event] = ingest(db, dict(version=1, id=event, tenant=tenant, expires=self.expires, text='prep ' + event),
                                      {A: 'a@example.com'}, ['a@example.com'])
        db.close()
        self.config = {'enable_prep_delivery': True, 'prep_routes': {A: 'a@example.com'},
                       'allowed_users': ['a@example.com', 'b@example.com'], 'enable_monday_delivery': True,
                       'monday_routes': {'live': 'spaces/monday'}, 'chat_key_path': 'unused', 'database': self.database,
                       'index_path': str(root / 'index.json'), 'subscription': 'projects/p/subscriptions/interactions'}

    def work(self, config=None, fail_space=None):
        pub, chat = Mock(), Mock()
        pub.post.return_value = response({})
        def post(url, **kwargs):
            if fail_space and '/' + fail_space + '/' in url:
                raise RuntimeError('chat down')
            return response({})
        chat.post.side_effect = post
        with patch.dict(sys.modules, google_modules(pub, chat)):
            paco_worker.run(config or self.config)
        db = connect(self.database)
        self.addCleanup(db.close)
        sent = {r['id'] for r in db.execute('SELECT id FROM paco_outbox WHERE sent=1')}
        quarantined = {r['id'] for r in db.execute('SELECT id FROM paco_prep_rows WHERE quarantined=1')}
        return sent, quarantined, [c.args[0].split('/v1/')[1] for c in chat.post.call_args_list]

    def test_enabled_delivers_to_owner_dm_with_other_rows(self):
        sent, quarantined, urls = self.work()
        self.assertEqual(sent, {'client-monday-x', 'client-private-x', *self.prep.values()})
        self.assertEqual(quarantined, set())
        self.assertEqual(sorted(u for u in urls if 'dmA' in u), ['spaces/dmA/messages'] * 2)

    def test_delivery_disabled_leaves_prep_unsent(self):
        for flag in (False, 'true', None):
            sent, quarantined, _ = self.work(dict(self.config, enable_prep_delivery=flag))
            self.assertFalse(set(self.prep.values()) & sent)
            self.assertEqual(quarantined, set())
        self.assertIn('client-private-x', sent)

    def test_route_changed_after_enqueue_quarantines_without_redirect(self):
        sent, quarantined, urls = self.work(dict(self.config, prep_routes={A: 'b@example.com'}))
        self.assertEqual(quarantined, set(self.prep.values()))
        self.assertEqual(sent, {'client-monday-x', 'client-private-x'})
        self.assertFalse([u for u in urls if 'dmA' in u])
        self.assertEqual(urls.count('spaces/dmB/messages'), 1)
        # Restoring the route does not release a quarantined row.
        sent, _, _ = self.work()
        self.assertFalse(set(self.prep.values()) & sent)

    def test_other_audience_drift_quarantines(self):
        for mutate in ("UPDATE paco_users SET space='spaces/other' WHERE email='a@example.com'",
                       "DELETE FROM paco_users WHERE email='a@example.com'"):
            self.setUp()
            db = connect(self.database)
            with db:
                db.execute(mutate)
            db.close()
            sent, quarantined, _ = self.work()
            self.assertEqual(quarantined, set(self.prep.values()), mutate)
        self.setUp()
        sent, quarantined, _ = self.work(dict(self.config, allowed_users=['b@example.com']))
        self.assertEqual(quarantined, set(self.prep.values()))
        self.setUp()
        sent, quarantined, _ = self.work(dict(self.config, prep_routes=None))
        self.assertEqual(quarantined, set(self.prep.values()))

    def test_expired_at_delivery_quarantines(self):
        db = connect(self.database)
        with db:
            db.execute("UPDATE paco_prep_rows SET expires='2026-01-01T00:00:00Z' WHERE id=?", (self.prep['e1'],))
        db.close()
        sent, quarantined, _ = self.work()
        self.assertEqual(quarantined, {self.prep['e1']})
        self.assertEqual(sent, {'client-monday-x', 'client-private-x', self.prep['e2']})

    def test_prep_row_without_ledger_is_never_sent(self):
        db = connect(self.database)
        with db:
            db.execute("INSERT INTO paco_outbox(id,space,body) VALUES('client-prep-forged','spaces/dmA','{\"text\": \"x\"}')")
        db.close()
        sent, _, _ = self.work()
        self.assertNotIn('client-prep-forged', sent)

    def test_failed_prep_send_does_not_stop_later_rows(self):
        db = connect(self.database)
        with db:
            db.execute("INSERT INTO paco_outbox(id,space,body) VALUES('client-private-y','spaces/dmB','{\"text\": \"later\"}')")
        db.close()
        sent, quarantined, urls = self.work(fail_space='dmA')
        self.assertEqual(sent, {'client-monday-x', 'client-private-x', 'client-private-y'})
        self.assertEqual(urls.count('spaces/dmA/messages'), 2)
        self.assertEqual(quarantined, set())

    def test_worker_never_runs_prep_ingress(self):
        with patch.object(paco_prep, 'run', side_effect=RuntimeError('prep auth failure')) as prep_run:
            sent, _, _ = self.work(dict(self.config, enable_prep_ingress=True, prep_subscription='projects/p/subscriptions/prep'))
        prep_run.assert_not_called()
        self.assertEqual(sent, {'client-monday-x', 'client-private-x', *self.prep.values()})
