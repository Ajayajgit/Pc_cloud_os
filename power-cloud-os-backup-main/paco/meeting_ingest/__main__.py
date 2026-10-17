"""Run from the dashboard development directory: python -m meeting_ingest --help."""
import argparse
import json
from pathlib import Path

from .core import build_client_index, open_ledger, survey, render_queue, load_vendors


def main(argv=None):
    parser = argparse.ArgumentParser(description='Read-only Meet survey. No live-write mode exists.')
    parser.add_argument('--dry-run', action='store_true', required=True)
    source = parser.add_mutually_exclusive_group(required=True)
    source.add_argument('--events', type=Path, help='Offline JSON array of Calendar events with artifacts')
    source.add_argument('--google-config', type=Path, help='VPS-only read credential configuration')
    parser.add_argument('--os-root', type=Path, help='Read-only local/mounted OS for offline indexing')
    parser.add_argument('--internal-domain', action='append', default=[])
    parser.add_argument('--aliases', type=Path)
    parser.add_argument('--exclusions', type=Path, help='Confirmed event-specific internal/private exclusions')
    parser.add_argument('--vendors', type=Path, help='Domain and label per line; extends seed list')
    parser.add_argument('--output-dir', type=Path, help='Explicit local report directory; omit for memory/stdout only')
    args = parser.parse_args(argv)
    if args.output_dir:
        output = args.output_dir.resolve()
        # Known production mount and network shares are never report targets.
        if str(output).startswith('\\\\') or output.drive.upper() == 'G:':
            parser.error('Reports must be local, not on a shared/network drive')
        if args.os_root and (output == args.os_root.resolve() or args.os_root.resolve() in output.parents):
            parser.error('Reports cannot be written inside the OS source tree')
        protected = [args.events, args.aliases, args.google_config, args.vendors, args.exclusions]
        if any(p and p.resolve() in [output / n for n in ('survey.sqlite3', 'decisions.json', 'QUEUE.md', 'client-index.json')] for p in protected):
            parser.error('Report target collides with an input file')
    aliases = json.loads(args.aliases.read_text(encoding='utf-8-sig')) if args.aliases else {}
    vendors = load_vendors(args.vendors) if args.vendors else None
    exclusions = json.loads(args.exclusions.read_text(encoding='utf-8-sig')) if args.exclusions else {}
    if args.events:
        if not args.os_root or not args.internal_domain:
            parser.error('Offline runs require --os-root and --internal-domain')
        index = build_client_index(args.os_root)
        events = json.loads(args.events.read_text(encoding='utf-8-sig'))
        internal_domains = args.internal_domain
    else:
        from .google_read import GoogleReader, delegated_session
        config = json.loads(args.google_config.read_text(encoding='utf-8-sig'))
        if not args.exclusions and config.get('exclusions_path'):
            exclusions = json.loads(Path(config['exclusions_path']).read_text(encoding='utf-8-sig'))
        if len(config['allowed_organizers']) != 1 or config['subject'].lower() != config['allowed_organizers'][0].lower():
            parser.error('Phase one is restricted to one explicitly configured organizer (Mike)')
        session = delegated_session(config['key_path'], config['subject'], config['allowed_organizers'])
        reader = GoogleReader(session)
        index = reader.client_index(config['os_root_id'])
        events = [reader.artifacts(e) for e in reader.organized_events(config['subject'], config['time_min'], config['time_max'])]
        internal_domains = config['internal_domains']
    if not index:
        parser.error('Client index is empty; refusing an ungrounded survey')
    if args.output_dir:
        output.mkdir(parents=True, exist_ok=True)
    db = open_ledger(str(output / 'survey.sqlite3') if args.output_dir else ':memory:')
    try:
        decisions = survey(events, index, [d.lower() for d in internal_domains], db, aliases, vendors, exclusions)
        report = json.dumps({'mode': 'dry-run', 'decisions': decisions,
                             'survey_counts': {'organized_events': len(events),
                                               'events_with_artifacts': sum(bool(e.get('artifacts')) for e in events),
                                               'incomplete_discovery': sum(not e.get('discovery_complete', True) for e in events)},
                             'discovery_warnings': [{'event_id': e['id'], 'warning': e['discovery_warning']}
                                                    for e in events if e.get('discovery_warning') and e['id'] in {d['event_id'] for d in decisions}]}, indent=2)
        queue = render_queue(db)
        if args.output_dir:
            for name, content in [('decisions.json', report), ('QUEUE.md', queue),
                                  ('client-index.json', json.dumps(index, indent=2))]:
                target = output / name
                temporary = output / (name + '.tmp')
                temporary.write_text(content, encoding='utf-8')
                temporary.replace(target)
        print(report)
        print(queue)
    finally:
        db.close()


if __name__ == '__main__':
    main()
