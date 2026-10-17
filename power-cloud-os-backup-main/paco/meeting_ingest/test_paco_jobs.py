import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch
from .paco import connect, enqueue, handle
from .paco_jobs import run, preview_message


class PreviewJobsTests(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory();self.addCleanup(self.tmp.cleanup)
        root=Path(self.tmp.name)
        self.config={'database':str(root/'paco.db'),'plans_path':str(root/'plans'),
                     'index_path':str(root/'index.json'),'survey_config':str(root/'source.json'),
                     'allowed_users':['mike@example.com'],'enable_confirmed_filing':False}
        self.index=[{'path':'Acme','name':'Acme','names':['Acme'],'folder_id':'folder'}]
        (root/'index.json').write_text(json.dumps(self.index))
        (root/'source.json').write_text(json.dumps({'key_path':'unused'}))
        db=connect(self.config['database'])
        self.key=enqueue(db,{'id':'e1','summary':'Test call','organizer':{'email':'mike@example.com'}})
        with db:
            db.execute('INSERT INTO paco_users VALUES(?,?,?)',('mike@example.com','users/1','spaces/dm'))
            db.execute("UPDATE paco_meetings SET state='preparing',target='Acme',thread='spaces/dm/threads/t'")
        db.close()

    def test_preview_button_approves_only_current_plan_without_writes(self):
        plan={'sha256':'digest','source_id':'source','moves':[{'name':'Original'}],
              'generated':[{'name':'meeting.md'}]}
        with patch('meeting_ingest.paco_jobs.delegated_session'), patch('meeting_ingest.paco_jobs.GoogleReader'), \
             patch('meeting_ingest.paco_jobs.prepare',return_value=plan), \
             patch('meeting_ingest.paco_jobs.save_preview'), patch('meeting_ingest.paco_jobs.execute') as execute:
            run(self.config)
            db=connect(self.config['database']);self.addCleanup(db.close)
            row=db.execute('SELECT * FROM paco_meetings').fetchone()
            self.assertEqual(row['state'],'awaiting-confirmation')
            body=json.loads(db.execute('SELECT body FROM paco_outbox').fetchone()[0])
            action=body['cardsV2'][0]['card']['sections'][0]['widgets'][0]['buttonList']['buttons'][0]['onClick']['action']
            event={'chat':{'user':{'email':'mike@example.com','name':'users/1'},'buttonClickedPayload':{
                'space':{'name':'spaces/dm','spaceType':'DIRECT_MESSAGE'},
                'message':{'thread':{'name':row['thread']}}}},
                'commonEventObject':{'parameters':{p['key']:p['value'] for p in action['parameters']}}}
            response=handle(db,'click',event,self.index,self.config['allowed_users'],filing_enabled=False)
            self.assertIn('nothing has moved',response['text'])
            self.assertEqual(db.execute('SELECT state FROM paco_meetings').fetchone()[0],'approved')
            db.close()
            run(self.config)
            execute.assert_not_called()

    def test_preview_failure_never_claims_filing(self):
        with patch('meeting_ingest.paco_jobs.delegated_session'), patch('meeting_ingest.paco_jobs.GoogleReader'), \
             patch('meeting_ingest.paco_jobs.prepare',side_effect=ValueError('Existing log requires review')):
            run(self.config)
        db=connect(self.config['database']);self.addCleanup(db.close)
        self.assertEqual(db.execute('SELECT state FROM paco_meetings').fetchone()[0],'needs-review')
        text=json.loads(db.execute('SELECT body FROM paco_outbox').fetchone()[0])['text']
        self.assertIn('held',text)
        self.assertNotIn('Filed and verified',text)

    def test_preview_shows_exact_folder_and_cancel_action(self):
        body=preview_message({'id':'meeting','title':'Call','target':'Acme'},
                             {'source_id':'exact-folder','moves':[],'generated':[]},'token')
        self.assertIn('https://drive.google.com/drive/folders/exact-folder',body['text'])
        self.assertNotIn('confirm token',body['text'])
        details=body['cardsV2'][0]['card']['sections'][1]
        self.assertTrue(details['collapsible'])
        self.assertEqual(details['uncollapsibleWidgetsCount'],0)
        self.assertIn('confirm token',details['widgets'][0]['textParagraph']['text'])
        buttons=body['cardsV2'][0]['card']['sections'][0]['widgets'][0]['buttonList']['buttons']
        self.assertEqual(buttons[1]['onClick']['action']['parameters'][-1]['value'],'cancel')

    def test_scoped_runner_ignores_other_meetings(self):
        with patch('meeting_ingest.paco_jobs.GoogleReader') as reader, patch('meeting_ingest.paco_jobs.execute') as execute:
            run(self.config, meeting_ids={'another-meeting'})
            reader.assert_not_called()
            execute.assert_not_called()
        db=connect(self.config['database']);self.addCleanup(db.close)
        self.assertEqual(db.execute('SELECT state FROM paco_meetings').fetchone()[0],'preparing')

    def test_selection_approves_prepared_plan_without_preview(self):
        self.config.update(file_on_selection=True,enable_confirmed_filing=True)
        db=connect(self.config['database'])
        with db:db.execute("UPDATE paco_meetings SET confirmed_by=organizer,confirmed_at='now'")
        db.close()
        with patch('meeting_ingest.paco_jobs.delegated_session'), patch('meeting_ingest.paco_jobs.GoogleReader'), \
             patch('meeting_ingest.paco_jobs.prepare',return_value={'sha256':'exact'}), \
             patch('meeting_ingest.paco_jobs.save_preview'), patch('meeting_ingest.paco_jobs.execute') as execute:
            run(self.config)
            execute.assert_not_called()
        db=connect(self.config['database']);self.addCleanup(db.close)
        row=db.execute('SELECT * FROM paco_meetings').fetchone()
        self.assertEqual((row['state'],row['plan_hash']),('approved','exact'))
        self.assertEqual(db.execute('SELECT count(*) FROM paco_outbox').fetchone()[0],0)

    def test_selection_mode_requires_recorded_actor(self):
        self.config.update(file_on_selection=True,enable_confirmed_filing=True)
        with patch('meeting_ingest.paco_jobs.delegated_session'), patch('meeting_ingest.paco_jobs.GoogleReader'), \
             patch('meeting_ingest.paco_jobs.prepare',return_value={'sha256':'exact'}), \
             patch('meeting_ingest.paco_jobs.save_preview'):
            run(self.config)
        db=connect(self.config['database']);self.addCleanup(db.close)
        self.assertEqual(db.execute('SELECT state FROM paco_meetings').fetchone()[0],'needs-review')
