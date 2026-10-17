import copy
import hashlib
import tempfile
import unittest
from unittest.mock import Mock
from pathlib import Path
from .filing import digest, execute, basename
from .google_write import GoogleWriter


class FakeWriter:
    enabled=True
    subject='ron@example.com'
    def __init__(self):
        self.files={'source':{'id':'source','name':'source','parents':['client'],'driveId':'drive'},
                    'working':{'id':'working','name':'working','parents':['client'],'driveId':'drive'},
                    'original':{'id':'original','name':'Notes','parents':['personal'],'version':'1','owners':[{'emailAddress':self.subject}]}}
        self.calls=[]
        self.fail=None
    def meta(self,id): return copy.deepcopy(self.files.get(id))
    def children(self,parent): return [copy.deepcopy(f) for f in self.files.values() if f.get('parents')==[parent]]
    def reserve_id(self): return 'created-'+str(len(self.files))
    def move(self,original,parent):
        self.calls.append('move')
        self.files[original['id']].update(parents=[parent],driveId='drive')
        if self.fail=='move':
            self.fail=None
            raise TimeoutError('response lost after successful move')
    def create(self,id,parent,name,content,props):
        self.calls.append('create')
        self.files[id]={'id':id,'name':name,'parents':[parent],'appProperties':props,'md5Checksum':hashlib.md5(content.encode()).hexdigest()}
        if self.fail=='create':
            self.fail=None
            raise TimeoutError('response lost after successful create')


def plan():
    p={'schema':1,'owner':'ron@example.com','organizer':'justin@example.com','source_id':'source','working_id':'working','client_folder_id':'client','drive_id':'drive','client':'Acme','event_id':'event','title':'Review','start':{'date':'2026-09-11'},'moves':[{'id':'original','name':'Notes','parents':['personal'],'version':'1','kind':'notes'}],'generated':[{'role':'notes:original','name':'notes.md','content':'Meeting notes'}]}
    p['sha256']=digest(p)
    return p


class FilingTests(unittest.TestCase):
    def setUp(self):
        self.temp=tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.journal=Path(self.temp.name)/'filing.db'
        self.p=plan(); self.w=FakeWriter()
    def run_plan(self): return execute(self.p,self.w,self.journal,self.p['sha256'])
    def test_completed_retry_does_not_duplicate(self):
        self.run_plan(); calls=list(self.w.calls)
        self.run_plan(); self.assertEqual(calls,self.w.calls)
    def test_unknown_move_outcome_resumes(self):
        self.w.fail='move'
        with self.assertRaises(TimeoutError): self.run_plan()
        self.run_plan(); self.assertEqual(self.w.calls.count('move'),1)
    def test_unknown_create_outcome_resumes_reserved_id(self):
        self.w.fail='create'
        with self.assertRaises(TimeoutError): self.run_plan()
        self.run_plan(); self.assertEqual(self.w.calls.count('create'),2)
    def test_changed_original_stops_before_writes(self):
        self.w.files['original']['version']='2'
        with self.assertRaises(ValueError): self.run_plan()
        self.assertEqual(self.w.calls,[])
    def test_collision_stops_before_moves(self):
        self.w.files['manual']={'id':'manual','name':'meetings_log.md','parents':['working']}
        with self.assertRaises(ValueError): self.run_plan()
        self.assertEqual(self.w.calls,[])
    def test_working_folder_changed_stops_before_moves(self):
        self.w.files['working']['parents']=['elsewhere']
        with self.assertRaises(ValueError): self.run_plan()
        self.assertEqual(self.w.calls,[])
    def test_tampered_plan_rejected(self):
        self.p['generated'][0]['content']='changed'
        with self.assertRaises(ValueError): self.run_plan()
        self.assertEqual(self.w.calls,[])
    def test_wrong_owner_and_disabled_rejected(self):
        self.w.subject='justin@example.com'
        with self.assertRaises(ValueError): self.run_plan()
        self.w.subject=self.p['owner']; self.w.enabled=False
        with self.assertRaises(ValueError): self.run_plan()
        self.assertFalse(self.journal.exists())
    def test_modified_generated_content_not_overwritten(self):
        self.run_plan(); calls=list(self.w.calls)
        self.w.files['created-3']['md5Checksum']='edited'
        with self.assertRaises(ValueError): self.run_plan()
        self.assertEqual(calls,self.w.calls)
    def test_transport_disabled_without_network(self):
        w=GoogleWriter(None,'ron@example.com')
        with self.assertRaises(ValueError): w.move({},'source')
        with self.assertRaises(ValueError): w.create('id','source','file','text',{})
    def test_missing_conditional_token_refuses_mutation(self):
        session=Mock()
        w=GoogleWriter(session,'ron@example.com',enabled=True)
        w.move_meta=Mock(return_value=self.w.meta('original'))
        with self.assertRaisesRegex(ValueError,'ETag'): w.move(self.p['moves'][0],'source')
        session.patch.assert_not_called()
    def test_conditional_move_uses_same_api_and_token(self):
        session=Mock()
        session.patch.return_value.status_code=200
        w=GoogleWriter(session,'ron@example.com',enabled=True)
        w.move_meta=Mock(return_value={**self.w.meta('original'),'_etag':'"version-token"'})
        w.move(self.p['moves'][0],'source')
        args,kwargs=session.patch.call_args
        self.assertIn('/drive/v2/files/original',args[0])
        self.assertEqual(kwargs['headers'],{'If-Match':'"version-token"'})
        self.assertEqual(kwargs['params']['removeParents'],'personal')
    def test_conditional_conflict_is_not_retried(self):
        session=Mock();session.patch.return_value.status_code=412
        w=GoogleWriter(session,'ron@example.com',enabled=True)
        w.move_meta=Mock(return_value={**self.w.meta('original'),'_etag':'"old"'})
        with self.assertRaisesRegex(RuntimeError,'412'): w.move(self.p['moves'][0],'source')
        session.patch.assert_called_once()
    def test_flat_name_disambiguates_same_title(self):
        e={'id':'one','summary':'A | Review','organizer':{'email':'a@example.com'},'start':{'date':'2026-09-11'}}
        first=basename(e); e['id']='two'
        self.assertNotEqual(first,basename(e)); self.assertNotIn('/',first)
