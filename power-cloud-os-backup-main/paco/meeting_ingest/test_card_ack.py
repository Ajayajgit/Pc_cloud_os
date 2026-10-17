import json,unittest
from unittest.mock import Mock
from .paco import connect,enqueue,handle
from .paco_worker import flush_card_updates
class CardAcknowledgmentTests(unittest.TestCase):
 def test_internal_updates_original_card_and_deduplicates(self):
  db=connect(':memory:');self.addCleanup(db.close)
  key=enqueue(db,{'id':'event','summary':'Internal call','organizer':{'email':'a@example.com'}})
  with db:
   db.execute("INSERT INTO paco_users VALUES('a@example.com','users/a','spaces/dm')")
   db.execute('INSERT INTO paco_outbox VALUES(?,?,?,1)',('client-review-'+key,'spaces/dm','{}',))
  event={'type':'CARD_CLICKED','user':{'email':'a@example.com','name':'users/a'},'space':{'type':'DM','name':'spaces/dm'},'message':{'thread':{'name':'spaces/dm/threads/t'}},'action':{'actionMethodName':'meeting','parameters':[{'key':'meeting_id','value':key},{'key':'command','value':'internal'}]}}
  for _ in range(2):handle(db,'click',event,[],['a@example.com'])
  rows=db.execute('SELECT * FROM paco_card_updates').fetchall()
  self.assertEqual(len(rows),1)
  body=json.loads(rows[0]['body']);self.assertIn('Marked internal',body['text']);self.assertEqual(body['cardsV2'],[])
  chat=Mock();flush_card_updates(db,chat,['a@example.com'])
  self.assertEqual(chat.patch.call_args.kwargs['params']['updateMask'],'text,cardsV2')
 def test_patch_failure_remains_retryable(self):
  db=connect(':memory:');self.addCleanup(db.close)
  with db:
   db.execute("INSERT INTO paco_users VALUES('a@example.com','users/a','spaces/dm')")
   db.execute('INSERT INTO paco_card_updates VALUES(?,?,?,?,0)',('edit','spaces/dm','client-review-test',json.dumps({'text':'Marked internal','cardsV2':[]})))
  chat=Mock();chat.patch.return_value.raise_for_status.side_effect=RuntimeError('network')
  with self.assertRaises(RuntimeError):flush_card_updates(db,chat,['a@example.com'])
  self.assertEqual(db.execute('SELECT sent FROM paco_card_updates').fetchone()[0],0)
  chat.patch.return_value.raise_for_status.side_effect=None
  flush_card_updates(db,chat,['a@example.com']);flush_card_updates(db,chat,['a@example.com'])
  self.assertEqual(chat.patch.call_count,2)

 def test_selection_is_consumed_and_latest_status_wins(self):
  from .paco import queue_card_status
  db=connect(':memory:');self.addCleanup(db.close)
  key=enqueue(db,{'id':'event','summary':'Client call','organizer':{'email':'a@example.com'}})
  with db:
   db.execute("INSERT INTO paco_users VALUES('a@example.com','users/a','spaces/dm')")
   db.execute('INSERT INTO paco_outbox VALUES(?,?,?,1)',('client-review-'+key,'spaces/dm','{}'))
  event={'type':'CARD_CLICKED','user':{'email':'a@example.com','name':'users/a'},'space':{'type':'DM','name':'spaces/dm'},'action':{'actionMethodName':'meeting','parameters':[{'key':'meeting_id','value':key},{'key':'command','value':'Acme'}]}}
  handle(db,'click',event,[{'path':'Acme','names':['Acme']}],['a@example.com'])
  body=json.loads(db.execute('SELECT body FROM paco_card_updates').fetchone()[0]);self.assertIn('Selection received',body['text']);self.assertEqual(body['cardsV2'],[])
  row=db.execute('SELECT * FROM paco_meetings WHERE id=?',(key,)).fetchone()
  with db:queue_card_status(db,row,'Filed Client call in Acme/source/.\nhttps://drive.google.com/drive/folders/folder')
  self.assertEqual(db.execute('SELECT count(*) FROM paco_card_updates').fetchone()[0],1)
  chat=Mock();flush_card_updates(db,chat,['a@example.com'])
  self.assertTrue(chat.patch.call_args.kwargs['json']['text'].startswith('Filed'))
  self.assertEqual(chat.patch.call_count,1)
 def test_submission_spinner_preserves_callback_and_source(self):
  from .paco_worker import delivery_body
  original={'cardsV2':[{'card':{'sections':[{'widgets':[{'buttonList':{'buttons':[{'onClick':{'action':{'function':'meeting','parameters':[{'key':'command','value':'internal'}]}}}]}}]}]}}]}
  delivered=delivery_body(original,'projects/p/topics/interactions')
  def action(body):return body['cardsV2'][0]['card']['sections'][0]['widgets'][0]['buttonList']['buttons'][0]['onClick']['action']
  self.assertEqual(action(delivered)['loadIndicator'],'SPINNER')
  self.assertEqual(action(delivered)['function'],'projects/p/topics/interactions')
  self.assertEqual(action(delivered)['parameters'],action(original)['parameters'])
  self.assertNotIn('loadIndicator',action(original))
