import json
import unittest
from .paco import connect,enqueue,handle,attach_plan


class PacoTests(unittest.TestCase):
    def setUp(self):
        self.db=connect(':memory:');self.addCleanup(self.db.close)
        self.index=[{'path':'Acme','name':'Acme','names':['Acme'],'customers':[],'domains':[],'aliases':[],'folder_id':'folder'}]
        self.allowed=['mike@example.com']
        self.key=enqueue(self.db,{'id':'e1','summary':'Client call','organizer':{'email':self.allowed[0]}})
        self.db.execute('UPDATE paco_meetings SET thread=?',('spaces/dm/threads/t',));self.db.commit()
    def event(self,text):
        return {'type':'MESSAGE','user':{'email':self.allowed[0],'name':'users/1'},'space':{'name':'spaces/dm','type':'DM'},'message':{'text':text,'thread':{'name':'spaces/dm/threads/t'}}}
    def send(self,text,id='event'):
        return handle(self.db,id,self.event(text),self.index,self.allowed)
    def state(self):return self.db.execute('SELECT state FROM paco_meetings').fetchone()[0]
    def test_group_room_silent(self):
        e=self.event('status');e['space']['type']='ROOM'
        self.assertIsNone(handle(self.db,'a',e,self.index,self.allowed))
        self.assertEqual(self.db.execute('SELECT count(*) FROM paco_outbox').fetchone()[0],0)
    def test_other_user_cannot_select_meeting(self):
        e=self.event('private');e['user']={'email':'other@example.com','name':'users/2'}
        e['action']={'actionMethodName':'meeting','parameters':[{'key':'meeting_id','value':self.key},{'key':'command','value':'private'}]}
        handle(self.db,'a',e,self.index,self.allowed+['other@example.com'])
        self.assertEqual(self.state(),'pending')
    def test_confirm_requires_current_plan(self):
        self.send('Acme');self.assertEqual(self.state(),'preparing')
        self.send('yes','b');self.assertEqual(self.state(),'preparing')
        token=attach_plan(self.db,self.key,'hash')
        self.send('confirm wrong','c');self.assertEqual(self.state(),'awaiting-confirmation')
        self.send('confirm '+token,'d');self.assertEqual(self.state(),'approved')
    def test_selection_is_silent_and_replay_preserves_preview(self):
        self.assertIsNone(self.send('Acme'))
        self.assertEqual(self.db.execute('SELECT count(*) FROM paco_outbox').fetchone()[0],0)
        token=attach_plan(self.db,self.key,'hash')
        self.assertIsNone(self.send('Acme'))
        self.assertEqual(self.state(),'awaiting-confirmation')
        self.assertEqual(self.db.execute('SELECT nonce FROM paco_meetings').fetchone()[0],token)
    def test_cancel_invalidates_confirmation(self):
        self.send('Acme');token=attach_plan(self.db,self.key,'hash')
        self.send('cancel','b');self.send('confirm '+token,'c')
        self.assertEqual(self.state(),'pending')
    def test_duplicate_delivery_no_second_outbox(self):
        a=self.send('private');b=self.send('private')
        self.assertEqual(a,b)
        self.assertEqual(self.db.execute('SELECT count(*) FROM paco_outbox').fetchone()[0],1)
    def test_unthreaded_message_not_applied_to_oldest(self):
        e=self.event('private');e['message'].pop('thread')
        handle(self.db,'a',e,self.index,self.allowed)
        self.assertEqual(self.state(),'pending')
    def test_identity_change_rejected(self):
        self.send('help')
        e=self.event('private');e['user']['name']='users/999'
        self.assertIsNone(handle(self.db,'b',e,self.index,self.allowed))
        self.assertEqual(self.state(),'pending')
    def test_prospect_does_not_create_folder(self):
        self.send('prospect New customer')
        self.assertEqual(self.state(),'held-prospect')
    def test_private_cannot_be_reopened_by_stale_card(self):
        self.send('private');self.send('Acme','b');self.assertEqual(self.state(),'private')
    def test_no_nested_automatic_destination(self):
        self.index.append({'path':'Acme/Project','name':'Special','customers':[],'aliases':[]})
        self.send('Special');self.assertEqual(self.state(),'pending')

