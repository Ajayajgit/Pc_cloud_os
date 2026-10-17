import unittest
from .paco import connect, enqueue, handle, attach_plan


class AddonEventsTests(unittest.TestCase):
    def test_pubsub_card_callback_names_full_topic(self):
        from .paco_worker import delivery_body
        body={'cardsV2':[{'onClick':{'action':{'function':'meeting','parameters':[{'key':'paco_action','value':'meeting'}]}}}]}
        sent=delivery_body(body,'projects/test/topics/paco')
        self.assertEqual(sent['cardsV2'][0]['onClick']['action']['function'],'projects/test/topics/paco')
        self.assertEqual(body['cardsV2'][0]['onClick']['action']['function'],'meeting')
        with self.assertRaises(ValueError):delivery_body(body,None)

    def test_welcome_posts_without_reply_option(self):
        from .paco_worker import message_params
        self.assertEqual(message_params('client-test', {'text':'hello'}), {'messageId':'client-test'})
        self.assertEqual(message_params('client-test', {'thread':{'name':'spaces/dm/threads/t'}})['messageReplyOption'],
                         'REPLY_MESSAGE_FALLBACK_TO_NEW_THREAD')

    def setUp(self):
        self.db = connect(':memory:')
        self.addCleanup(self.db.close)
        self.allowed = ['mike@example.com']
        self.index = [{'path': 'Acme', 'name': 'Acme', 'names': ['Acme'],
                       'customers': [], 'domains': [], 'aliases': [], 'folder_id': 'folder'}]
        self.key = enqueue(self.db, {'id': 'event', 'summary': 'Client call',
                                    'organizer': {'email': self.allowed[0]}})

    def event(self, text='help', button=False):
        payload = {'space': {'name': 'spaces/dm', 'spaceType': 'DIRECT_MESSAGE'},
                   'message': {'text': text, 'sender': {'name': 'users/bot'},
                               'thread': {'name': 'spaces/dm/threads/one'}}}
        event = {'chat': {'user': {'name': 'users/1', 'email': self.allowed[0]},
                         'buttonClickedPayload' if button else 'messagePayload': payload}}
        if button:
            event['commonEventObject'] = {'parameters': {'paco_action': 'meeting',
                                                        'meeting_id': self.key, 'command': text}}
        return event

    def send(self, event, event_id='delivery'):
        return handle(self.db, event_id, event, self.index, self.allowed)

    def state(self):
        return self.db.execute('SELECT state FROM paco_meetings').fetchone()[0]

    def test_message_binds_actor_and_private_space(self):
        self.assertIn('Paco', self.send(self.event())['text'])
        self.assertEqual(self.db.execute('SELECT user_id FROM paco_users').fetchone()[0], 'users/1')

    def test_group_space_cannot_use_deprecated_dm_flag(self):
        e = self.event('private', True)
        e['chat']['buttonClickedPayload']['space'].update(spaceType='GROUP_CHAT', type='DM')
        self.assertIsNone(self.send(e))
        self.assertEqual(self.state(), 'pending')

    def test_button_preview_and_token_confirmation(self):
        self.send(self.event('Acme', True))
        self.assertEqual(self.state(), 'preparing')
        token = attach_plan(self.db, self.key, 'plan-hash')
        self.send(self.event('confirm '+token, True), 'confirm-delivery')
        self.assertEqual(self.state(), 'approved')

    def test_card_sender_never_substitutes_for_actor(self):
        e = self.event('private', True)
        e['chat']['user'] = {'name': 'users/other', 'email': 'other@example.com'}
        e['chat']['buttonClickedPayload']['message']['sender'] = {'name': 'users/1', 'email': self.allowed[0]}
        self.assertIsNone(self.send(e))
        self.assertEqual(self.state(), 'pending')

    def test_unknown_card_and_dialog_ignored(self):
        e = self.event('private', True)
        e['commonEventObject']['parameters']['paco_action'] = 'unrelated'
        self.assertIsNone(self.send(e))
        e = self.event('private', True)
        e['chat']['buttonClickedPayload']['isDialogEvent'] = True
        self.assertIsNone(self.send(e))
        self.assertEqual(self.state(), 'pending')

    def test_duplicate_button_has_one_durable_response(self):
        e = self.event('private', True)
        self.assertEqual(self.send(e), self.send(e))
        self.assertEqual(self.db.execute('SELECT count(*) FROM paco_outbox').fetchone()[0], 1)

    def test_conflicting_space_and_multiple_payloads_ignored(self):
        e = self.event('private', True)
        e['chat']['space'] = {'name': 'spaces/other'}
        self.assertIsNone(self.send(e))
        e = self.event()
        e['chat']['removedFromSpacePayload'] = {}
        self.assertIsNone(self.send(e))

    def test_added_dm_registration_and_removed_silent(self):
        e = self.event()
        e['chat']['addedToSpacePayload'] = e['chat'].pop('messagePayload')
        self.assertIsNone(self.send(e))
        e['chat']['removedFromSpacePayload'] = e['chat'].pop('addedToSpacePayload')
        self.assertIsNone(self.send(e, 'removed'))

