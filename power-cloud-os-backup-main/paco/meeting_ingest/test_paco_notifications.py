import json
import unittest
from .paco import connect
from .paco_notifications import ingest
from .paco_worker import monday_destination_allowed


class Notifications(unittest.TestCase):
    def setUp(self):
        self.db = connect(':memory:')
        self.addCleanup(self.db.close)
        self.payload = dict(version=1, id='2026-09-14:success', channel='test', text='Monday — café')
        self.routes = {'test': 'spaces/test'}

    def test_duplicate_is_one_outbox_message(self):
        first = ingest(self.db, self.payload, self.routes)
        self.assertEqual(first, ingest(self.db, self.payload, self.routes))
        self.assertEqual(self.db.execute('SELECT count(*) FROM paco_outbox').fetchone()[0], 1)

    def test_conflicting_replay_does_not_replace(self):
        ingest(self.db, self.payload, self.routes)
        with self.assertRaises(ValueError):
            ingest(self.db, dict(self.payload, text='changed'), self.routes)
        self.assertEqual(json.loads(self.db.execute('SELECT body FROM paco_outbox').fetchone()[0])['text'], self.payload['text'])

    def test_cannot_inject_destination_or_chat_event(self):
        for extra in ({'space': 'spaces/other'}, {'action': {'command': 'confirm'}}, {'user': {'email': 'mike@example.com'}}):
            with self.assertRaises(ValueError):
                ingest(self.db, dict(self.payload, **extra), self.routes)

    def test_live_requires_explicit_route(self):
        with self.assertRaises(ValueError):
            ingest(self.db, dict(self.payload, channel='live'), self.routes)

    def test_malformed_payloads(self):
        for payload in ([], {}, dict(self.payload, version=True), dict(self.payload, text=''),
                        dict(self.payload, id='bad/id'), dict(self.payload, text='é' * 16000)):
            with self.assertRaises(ValueError):
                ingest(self.db, payload, self.routes)

    def test_no_meeting_or_user_mutation(self):
        ingest(self.db, self.payload, self.routes)
        self.assertEqual(self.db.execute('SELECT count(*) FROM paco_meetings').fetchone()[0], 0)
        self.assertEqual(self.db.execute('SELECT count(*) FROM paco_users').fetchone()[0], 0)

    def test_delivery_requires_explicit_destinations_and_gate(self):
        config = {'enable_monday_delivery': True, 'monday_routes': self.routes}
        self.assertTrue(monday_destination_allowed(config, 'spaces/test'))
        self.assertFalse(monday_destination_allowed(config, 'spaces/other'))
        config['enable_monday_delivery'] = False
        self.assertFalse(monday_destination_allowed(config, 'spaces/test'))
