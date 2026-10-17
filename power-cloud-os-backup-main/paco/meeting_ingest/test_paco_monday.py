import json
import tempfile
import unittest
from pathlib import Path
from .paco_monday import queue
from .paco import connect


class MondayDeliveryTests(unittest.TestCase):
    def setUp(self):
        self.temp=tempfile.TemporaryDirectory();self.addCleanup(self.temp.cleanup)
        self.config={'database':str(Path(self.temp.name)/'paco.db'),'enable_monday_delivery':True,'monday_space':'spaces/original'}
        self.monday={'google_chat_webhook':'https://chat.googleapis.com/v1/spaces/original/messages?key=secret&token=secret'}
    def test_exact_payload_and_audience_preserved(self):
        message='Monday summary\nStats and https://docs.google.com/spreadsheets/d/example'
        queue(message,self.config,self.monday)
        db=connect(self.config['database'])
        try:
            row=db.execute('SELECT * FROM paco_outbox').fetchone()
            self.assertEqual(row['space'],'spaces/original')
            self.assertEqual(json.loads(row['body']),{'text':message})
            self.assertNotIn('secret',row['body'])
        finally:db.close()
    def test_repeated_queue_is_deduplicated(self):
        self.assertEqual(queue('same',self.config,self.monday),queue('same',self.config,self.monday))
        db=connect(self.config['database'])
        try:self.assertEqual(db.execute('SELECT count(*) FROM paco_outbox').fetchone()[0],1)
        finally:db.close()
    def test_changed_audience_rejected(self):
        self.config['monday_space']='spaces/other'
        with self.assertRaises(ValueError):queue('summary',self.config,self.monday)
        self.assertFalse(Path(self.config['database']).exists())
    def test_disabled_rejected(self):
        self.config['enable_monday_delivery']=False
        with self.assertRaises(ValueError):queue('summary',self.config,self.monday)
    def test_unexpected_endpoint_rejected(self):
        self.monday['google_chat_webhook']='https://example.com/v1/spaces/original/messages'
        with self.assertRaises(ValueError):queue('summary',self.config,self.monday)
