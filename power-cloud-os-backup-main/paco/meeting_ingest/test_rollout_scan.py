import json,tempfile,unittest
from pathlib import Path
from unittest.mock import Mock,patch
from .paco import connect
from .paco_scan import run

class RolloutScanTests(unittest.TestCase):
 def setUp(self):
  self.tmp=tempfile.TemporaryDirectory();self.addCleanup(self.tmp.cleanup);root=Path(self.tmp.name)
  self.users=['a@example.com','b@example.com']
  self.source={'subject':self.users[0],'key_path':'unused','allowed_organizers':self.users,'os_root_id':'root','internal_domains':['example.com']}
  self.config={'survey_config':str(root/'survey.json'),'allowed_users':self.users,'database':str(root/'paco.db'),'index_path':str(root/'index.json')}
  self.db=connect(self.config['database']);self.addCleanup(self.db.close)
  with self.db:
   for i,email in enumerate(self.users):self.db.execute('INSERT INTO paco_users VALUES(?,?,?)',(email,'users/'+str(i),'spaces/'+str(i)))
 def event(self,email,artifacts=True):
  return {'id':'same-event-id','summary':'Client Name Review','organizer':{'email':email},'artifacts':[{'id':email}] if artifacts else []}
 def scan(self,events,fail=None):
  Path(self.config['survey_config']).write_text(json.dumps(self.source))
  def reader(session):
   mock=Mock();mock.client_index.return_value=[{'path':'Client Name','names':['Client Name'],'domains':[],'folder_id':'folder'}]
   mock.artifacts.side_effect=lambda e:e
   if session==fail:mock.organized_events.side_effect=PermissionError('test')
   else:mock.organized_events.return_value=events.get(session,[])
   return mock
  with patch('meeting_ingest.paco_scan.delegated_session',side_effect=lambda key,owner,allowed:owner),patch('meeting_ingest.paco_scan.GoogleReader',side_effect=reader):run(self.config)
 def test_each_organizer_gets_only_own_dm_even_with_same_event_id(self):
  self.scan({u:[self.event(u)] for u in self.users})
  rows=self.db.execute('SELECT m.organizer,o.space FROM paco_meetings m JOIN paco_outbox o ON o.id=\'client-review-\'||m.id ORDER BY m.organizer').fetchall()
  self.assertEqual([tuple(r) for r in rows],[(self.users[0],'spaces/0'),(self.users[1],'spaces/1')])
 def test_empty_meetings_never_prompt(self):
  self.scan({u:[self.event(u,False)] for u in self.users})
  self.assertEqual(self.db.execute('SELECT count(*) FROM paco_outbox').fetchone()[0],0)
 def test_missing_dm_does_not_send_to_another_user(self):
  with self.db:self.db.execute('DELETE FROM paco_users WHERE email=?',(self.users[1],))
  self.scan({self.users[1]:[self.event(self.users[1])]})
  self.assertEqual(self.db.execute('SELECT count(*) FROM paco_outbox').fetchone()[0],0)
 def test_one_account_failure_preserves_other_account_and_reports_error(self):
  with self.assertRaisesRegex(RuntimeError,'Organizer scans failed'):
   self.scan({self.users[0]:[self.event(self.users[0])]},fail=self.users[1])
  self.assertEqual(self.db.execute('SELECT count(*) FROM paco_outbox').fetchone()[0],1)
 def test_scanning_requires_both_allowlists(self):
  self.config['allowed_users']=[self.users[0]]
  with self.assertRaisesRegex(ValueError,'explicitly allowed'):self.scan({})
