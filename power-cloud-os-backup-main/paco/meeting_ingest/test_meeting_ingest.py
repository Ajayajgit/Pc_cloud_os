import contextlib
import io
import json
import sqlite3
import tempfile
import unittest
from pathlib import Path
from unittest.mock import Mock

from . import core
from .__main__ import main
from .google_read import GoogleReader, delegated_session, SCOPES


def event(title='Acme | Review', domains=('acme.example',), id='event-1', artifacts=True):
    return {'id': id, 'summary': title, 'organizer': {'email': 'mike@firm.example'},
            'start': {'dateTime': '2026-09-10T10:00:00-04:00'},
            'attendees': [{'email': 'person@' + d} for d in domains],
            'artifacts': [{'id': 'transcript-1', 'kind': 'transcript'}] if artifacts else []}


class RoutingTests(unittest.TestCase):
    def setUp(self):
        self.index = [core.client_record('Acme', '- Email domains: acme.example\n- Meeting aliases: AC\n'),
                      core.client_record('Bravo', '- Email domains: bravo.example'),
                      core.client_record('GW', '- NetSuite customer: Great Western'),
                      core.client_record('Shinesty RA', ''), core.client_record('Shinesty Redo', '')]

    def route(self, e, **kwargs):
        return core.route(e, self.index, ['firm.example'], **kwargs)

    def test_private_wins_over_domain_and_alias(self):
        for title in ['Acme | private', 'Acme | PRIVATE | Review', '[private] Acme']:
            self.assertEqual(self.route(event(title))['state'], 'skipped-private')
        self.assertEqual(self.route(event('Acme | private equity'))['state'], 'would-file')

    def test_domains_precede_title(self):
        d = self.route(event('Bravo | review'))
        self.assertEqual((d['rung'], d['targets']), (1, ['Acme']))

    def test_multi_client_is_explicit(self):
        d = self.route(event(domains=('acme.example', 'bravo.example')))
        self.assertEqual(d['targets'], ['Acme', 'Bravo'])
        self.assertEqual(d['state'], 'needs-multi-client-review')

    def test_vendor_never_routes_by_itself(self):
        self.index.append(core.client_record('Vendor accident', '- Email domains: netsuite.com'))
        self.assertEqual(self.route(event('Unknown', ('netsuite.com',)))['state'], 'unfiled')
        d = self.route(event('Acme | SPS work', ('spscommerce.com',)))
        self.assertEqual((d['rung'], d['kind']), (2, 'third-party:SPS Commerce'))

    def test_alias_and_short_names(self):
        self.assertEqual(core.match_clients('AC', self.index), ['Acme'])
        self.assertEqual(core.match_clients('GW', self.index), ['GW'])
        self.assertEqual(core.match_clients('G', self.index), [])
        self.assertEqual(core.match_clients('AmazingWorld', self.index), [])

    def test_ambiguous_title(self):
        d = self.route(event('Shinesty | Review', ('firm.example',)))
        self.assertEqual(d['state'], 'unfiled')
        self.assertEqual(len(d['targets']), 2)

    def test_internal_silence_and_explicit_route(self):
        self.assertEqual(self.route(event('1:1', ('firm.example',)))['state'], 'skipped-internal')
        self.assertEqual(self.route(event('Internal | Planning', ('firm.example',)))['targets'], ['Internal'])
        self.assertEqual(self.route(event('Acme | Planning', ('firm.example',)))['targets'], ['Acme'])

    def test_empty_attendees_do_not_imply_internal(self):
        self.assertEqual(self.route(event('Unknown', ()))['state'], 'unfiled')

    def test_prospect_held_and_ambiguity_not_a_prospect(self):
        d = self.route(event('Newco | Sales | Discovery', ('netsuite.com',)))
        self.assertEqual((d['state'], d['prospect'], d['targets']), ('held-prospect', 'Newco', []))
        self.assertEqual(self.route(event('Shinesty | Sales | call', ('netsuite.com',)))['state'], 'unfiled')

    def test_no_artifacts_completeness_and_unknown_discovery(self):
        e = event(artifacts=False)
        self.assertEqual(self.route(e)['state'], 'completeness-gap')
        e['discovery_complete'] = False
        self.assertEqual(self.route(e)['state'], 'skipped-undiscovered')
        self.assertEqual(self.route(event('Internal | Planning', ('firm.example',), artifacts=False))['state'], 'skipped-empty')

    def test_confirmed_series_alias_and_stale_target(self):
        e = event('Weekly', ('netsuite.com',))
        e['recurringEventId'] = 'series1'
        a = {'series': {'series1': {'client': 'Acme', 'confirmed_by': 'Mike', 'confirmed_at': '2026-09-10'}}}
        self.assertEqual(self.route(e, aliases=a)['targets'], ['Acme'])
        a['series']['series1']['client'] = 'Gone'
        self.assertEqual(self.route(e, aliases=a)['state'], 'unfiled')

    def test_ledger_repeat_late_artifacts_and_separate_instances(self):
        with core.open_ledger() as db:
            e = event(artifacts=False)
            core.survey([e], self.index, ['firm.example'], db)
            e['artifacts'] = [{'id': 'late', 'kind': 'transcript'}]
            core.survey([e, e], self.index, ['firm.example'], db)
            self.assertEqual(db.execute('SELECT count(*) FROM events').fetchone()[0], 1)
            self.assertEqual(db.execute('SELECT state FROM events').fetchone()[0], 'would-file')
            e2 = event(id='instance-2')
            core.survey([e2], self.index, ['firm.example'], db)
            self.assertEqual(db.execute('SELECT count(*) FROM events').fetchone()[0], 2)
            self.assertEqual(db.execute('SELECT artifacts_after,exports,card_message_id FROM events LIMIT 1').fetchone()[:], ('[]', '[]', None))

    def test_incomplete_artifacts_cannot_propose_ready_filing(self):
        e = event()
        e['discovery_complete'] = False
        with core.open_ledger() as db:
            d = core.survey([e], self.index, ['firm.example'], db)[0]
            self.assertEqual((d['state'], d['targets']), ('unfiled', ['Acme']))

    def test_silent_meetings_not_retained(self):
        with core.open_ledger() as db:
            core.survey([event('1:1', ('firm.example',)), event('Acme | private')], self.index, ['firm.example'], db)
            self.assertEqual(db.execute('SELECT count(*) FROM events').fetchone()[0], 0)

    def test_confirmed_exclusion_removes_queue_row_and_is_occurrence_specific(self):
        e = event('Unknown', ('external.example',))
        exclusions = {'mike@firm.example:event-1': {'state':'skipped-private', 'confirmed_by':'Mike', 'confirmed_at':'2026-09-11'}}
        with core.open_ledger() as db:
            core.survey([e], self.index, ['firm.example'], db)
            self.assertEqual(db.execute('SELECT count(*) FROM events').fetchone()[0], 1)
            result = core.survey([e, dict(e, id='event-2')], self.index, ['firm.example'], db, exclusions=exclusions)
            self.assertEqual([d['event_id'] for d in result], ['event-2'])
            self.assertEqual(db.execute('SELECT event_id FROM events').fetchone()[0], 'event-2')

    def test_unconfirmed_exclusion_rejected(self):
        with core.open_ledger() as db, self.assertRaises(ValueError):
            core.survey([], self.index, ['firm.example'], db, exclusions={'x':{'state':'skipped-private'}})

    def test_shared_originals_preserved_without_claiming_correct_destination(self):
        e=event();e['storage_checked']=True;e['artifacts']=[{'id':'a','driveId':'existing-drive'}]
        with core.open_ledger() as db:
            d=core.survey([e],self.index,['firm.example'],db)[0]
            self.assertEqual(d['state'],'already-shared')
            self.assertNotIn('Acme &#124;',core.render_queue(db))

    def test_owner_mismatch_and_missing_owner_require_review(self):
        for owners in [[],[{'emailAddress':'ron@firm.example'}]]:
            e=event();e['storage_checked']=True;e['artifacts']=[{'id':'a','owners':owners}]
            with core.open_ledger() as db:
                d=core.survey([e],self.index,['firm.example'],db)[0]
                self.assertEqual(d['state'],'owner-review')
                self.assertIn('owner-review',core.render_queue(db))

    def test_mixed_storage_requires_review(self):
        e=event();e['storage_checked']=True;e['artifacts']=[{'id':'a','driveId':'existing-drive'},{'id':'b','owners':[{'emailAddress':'mike@firm.example'}]}]
        with core.open_ledger() as db:
            self.assertEqual(core.survey([e],self.index,['firm.example'],db)[0]['state'],'owner-review')

    def test_owner_checked_does_not_bypass_privacy(self):
        e=event('Acme | private');e['storage_checked']=True;e['artifacts']=[{'id':'a','driveId':'existing-drive'}]
        with core.open_ledger() as db:
            self.assertEqual(core.survey([e],self.index,['firm.example'],db),[])

    def test_queue_escapes_title_and_has_no_false_chat_state(self):
        with core.open_ledger() as db:
            core.survey([event('New | Sales | <tag>\nMore', ('netsuite.com',))], self.index, ['firm.example'], db)
            q = core.render_queue(db)
            self.assertIn('held-prospect', q)
            self.assertIn('&lt;tag&gt;', q)
            self.assertIn('&#124;', q)
            self.assertNotIn('| asked |', q)

    def test_destination_collision_and_path_characters(self):
        e = event('Acme | ../../same:*')
        d = self.route(e)
        p1 = core.destinations(e, d)
        e['id'] = 'different'
        self.assertEqual(p1, ['Acme/source/'])
        self.assertEqual(p1, core.destinations(e, d))

    def test_nested_projects_not_automatic_destinations(self):
        self.index.append(core.client_record('Acme/Project','- Email domains: acme.example\n- Meeting aliases: AC'))
        self.assertEqual(self.route(event('AC | Review',('firm.example',)))['targets'],['Acme'])


class IndexAndCliTests(unittest.TestCase):
    def test_existing_unmarked_database_rejected_without_schema_changes(self):
        with tempfile.TemporaryDirectory() as tmp:
            p = Path(tmp) / 'production.db'
            with sqlite3.connect(p) as db:
                db.execute('CREATE TABLE unrelated (id INTEGER)')
            db.close()
            before = p.read_bytes()
            with self.assertRaises(ValueError):
                core.open_ledger(p)
            self.assertEqual(before, p.read_bytes())

    def test_vendor_file_extends_seed(self):
        with tempfile.TemporaryDirectory() as tmp:
            p = Path(tmp) / 'vendors.md'
            p.write_text('# Vendors\nlogistics.example Partner 3PL\n')
            vendors = core.load_vendors(p)
            self.assertEqual(vendors['logistics.example'], 'Partner 3PL')
            self.assertIn('netsuite.com', vendors)

    def test_nested_index_and_scope(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            for name in ['Acme', 'Acme/Custom', 'Acme/source', 'Archive/Old', 'templates/client-record']:
                p = root / name
                p.mkdir(parents=True)
                (p / 'CONTEXT.md').write_text('- NetSuite customer: none\n- Meeting aliases: `Ace`, none\n- Email domains: {placeholder}', encoding='utf-8')
            index = core.build_client_index(root)
            self.assertEqual([c['path'] for c in index], ['Acme', 'Acme/Custom'])
            self.assertEqual(index[0]['domains'], [])
            self.assertNotIn('none', index[0]['names'])

    def test_cli_dry_run_and_no_source_changes(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp) / 'os'
            client = root / 'Acme'
            client.mkdir(parents=True)
            context = client / 'CONTEXT.md'
            context.write_text('- Email domains: acme.example')
            before = context.read_bytes()
            events = Path(tmp) / 'events.json'
            events.write_text(json.dumps([event()]))
            output = Path(tmp) / 'reports'
            args = ['--dry-run', '--events', str(events), '--os-root', str(root),
                    '--internal-domain', 'firm.example', '--output-dir', str(output)]
            with contextlib.redirect_stdout(io.StringIO()):
                main(args)
                main(args)
            self.assertEqual(context.read_bytes(), before)
            self.assertEqual(list(client.iterdir()), [context])
            self.assertTrue((output / 'QUEUE.md').is_file())
            with contextlib.redirect_stderr(io.StringIO()), self.assertRaises(SystemExit):
                main(args[1:])

    def test_refuse_reports_under_source(self):
        with contextlib.redirect_stderr(io.StringIO()), self.assertRaises(SystemExit):
            main(['--dry-run', '--events', 'absent.json', '--os-root', '.', '--output-dir', './reports'])


class ReaderTests(unittest.TestCase):
    def test_only_read_scopes_and_allowlist_before_credentials(self):
        self.assertTrue(all(s.endswith('.readonly') for s in SCOPES))
        with self.assertRaises(ValueError):
            delegated_session('missing-key', 'outsider@example.com', ['mike@example.com'])

    def test_calendar_pages_filter_organizer_private_and_cancelled(self):
        reader = GoogleReader(None)
        other = event()
        other['organizer']['email'] = 'elsewhere@example.com'
        reader.get = Mock(side_effect=[{'items': [other, event('Acme | private')], 'nextPageToken': 'p2'},
                                       {'items': [event()]}])
        self.assertEqual(len(list(reader.organized_events('mike@firm.example', 'start', 'end'))), 1)
        self.assertEqual(reader.get.call_count, 2)

    def test_get_only_transport(self):
        session = Mock()
        session.get.return_value.status_code = 200
        session.get.return_value.json.return_value = {'items': []}
        GoogleReader(session).get('calendar', 'calendars/primary/events')
        self.assertEqual([c[0] for c in session.method_calls], ['get'])

    def test_incomplete_search_fails(self):
        reader = GoogleReader(None)
        reader.get = Mock(return_value={'incompleteSearch': True})
        with self.assertRaises(RuntimeError):
            reader.children('root')

    def test_anchored_folder_discovers_recording_and_deduplicates(self):
        reader = GoogleReader(None)
        doc = {'id': 't', 'name': 'Call - 2026/09/10 10:00 EDT - Transcript', 'mimeType': 'application/vnd.google-apps.document', 'parents': ['folder']}
        reader.get = Mock(side_effect=[doc, {'id': 'folder', 'name': 'Call', 'parents': ['meet']}, {'id': 'meet', 'name': 'Google Meet'}])
        reader.children = Mock(return_value=[doc, {'id': 'v', 'name': 'Call - 2026/09/10 10:00 EDT - Recording', 'mimeType': 'video/mp4'}, {'id':'wrong','name':'Call - 2026/09/09 10:00 EDT - Recording','mimeType':'video/mp4'}])
        e = event()
        e['attachments'] = [{'fileId': 't'}]
        found = reader.artifacts(e)
        self.assertEqual({a['id'] for a in found['artifacts']}, {'t', 'v'})
        self.assertTrue(found['discovery_complete'])

    def test_legacy_folder_links_only_same_anchored_occurrence(self):
        reader = GoogleReader(None)
        doc = {'id':'t','name':'Call - 2026/09/10 10:00 EDT - Transcript','mimeType':'application/vnd.google-apps.document','parents':['legacy']}
        reader.get = Mock(side_effect=[doc, {'id':'legacy','name':'Meet Recordings'}])
        reader.children = Mock(return_value=[doc, {'id':'v','name':'Call - 2026/09/10 10:00 EDT - Recording','mimeType':'video/mp4'}, {'id':'other','name':'Call - 2026/09/03 10:00 EDT - Recording','mimeType':'video/mp4'}])
        e=event();e['attachments']=[{'fileId':'t'}]
        found=reader.artifacts(e)
        self.assertEqual({a['id'] for a in found['artifacts']},{'t','v'})
        self.assertTrue(found['discovery_complete'])

    def test_unrecognized_names_do_not_expand_entire_recurring_folder(self):
        reader=GoogleReader(None)
        doc={'id':'t','name':'Call Transcript','mimeType':'application/vnd.google-apps.document','parents':['folder']}
        reader.get=Mock(side_effect=[doc,{'name':'Call recurring','parents':['root']},{'name':'Google Meet'}])
        reader.children=Mock(return_value=[{'id':'wrong','name':'Other Recording','mimeType':'video/mp4'}])
        e=event();e['attachments']=[{'fileId':'t'}]
        found=reader.artifacts(e)
        self.assertEqual([a['id'] for a in found['artifacts']],['t'])
        self.assertFalse(found['discovery_complete'])

    def test_missing_attachments_not_false_empty(self):
        found = GoogleReader(None).artifacts(event())
        self.assertFalse(found['discovery_complete'])
        self.assertEqual(found['artifacts'], [])


if __name__ == '__main__':
    unittest.main()
