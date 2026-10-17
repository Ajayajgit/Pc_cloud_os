import hashlib
import unittest
from unittest.mock import Mock

from .google_read import GoogleReader


class DriveTextEncodingTests(unittest.TestCase):
    def response(self, content):
        response = Mock()
        response.status_code = 200
        response.headers = {'Content-Type': 'text/markdown'}
        response.encoding = 'ISO-8859-1'
        response.content = content
        response.text = content.decode('ISO-8859-1')
        session = Mock()
        session.get.return_value = response
        return GoogleReader(session), response

    def test_missing_charset_preserves_unicode_and_drive_checksum(self):
        content = '# Meetings log\n- Grinds — café, résumé, 日本語\n'
        reader, response = self.response(content.encode('utf-8'))
        self.assertNotEqual(response.text, content)
        text = reader.get('drive', 'files/log', {'alt': 'media'}, raw=True)
        self.assertEqual(text, content)
        self.assertEqual(hashlib.md5(text.encode('utf-8')).hexdigest(),
                         hashlib.md5(response.content).hexdigest())

    def test_invalid_utf8_fails_without_replacement_characters(self):
        reader, _ = self.response(b'log\xff')
        with self.assertRaises(UnicodeDecodeError):
            reader.get('drive', 'files/log', raw=True)

    def test_json_reads_unchanged(self):
        reader, response = self.response(b'{"version": "2"}')
        response.json.return_value = {'version': '2'}
        self.assertEqual(reader.get('drive', 'files/log'), {'version': '2'})
