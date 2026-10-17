"""Check whether a client is wired up for Paco's Monday board update.

Reads the client's CONTEXT.md only. No credentials, no network, no Drive access, so any
consultant can run it. The parsing here mirrors Paco's own index builder exactly; if the two
ever disagree, Paco's copy (core.py, client_record) is the source of truth.

    python "../.claude/scripts/check_board_mapping.py"
    python ".claude/scripts/check_board_mapping.py" --client "Brixton"
    python ".claude/scripts/check_board_mapping.py" --all
"""
import argparse
import re
import sys
from pathlib import Path

PLACEHOLDERS = {'none', 'n/a', 'tbd', 'unknown'}
NON_CLIENT = {'templates', 'internal', 'archive', 'feedback', 'fonts', 'logos', 'tasks', '.claude'}
RECORD_DIRS = {'source', 'working', 'deliverables', 'execution'}


def field(text, name):
    """Every declared value for a '- Name:' line, ignoring braced placeholders."""
    values = []
    for value in re.findall(r'^\s*[-*]\s*' + re.escape(name) + r':\s*([^\r\n]*)', text, re.I | re.M):
        if '{' in value:
            continue
        for part in value.split(','):
            part = part.strip().strip('`').strip()
            if part and part.lower() not in PLACEHOLDERS:
                values.append(part)
    return values


def asana_project_gid(value):
    match = re.search(r'app\.asana\.com/(?:\d+/\d+/project|0)/(\d+)', value or '')
    return match.group(1) if match else None


def chat_space_name(value):
    match = re.search(r'(?:chat\.google\.com/room/|#chat/space/|^\s*spaces/)([A-Za-z0-9_-]+)', value or '')
    return 'spaces/' + match.group(1) if match else None


def inspect(folder):
    context = folder / 'CONTEXT.md'
    if not context.is_file():
        return {'path': folder.name, 'error': 'no CONTEXT.md'}
    text = context.read_text(encoding='utf-8-sig')
    raw_projects, raw_spaces = field(text, 'Asana project'), field(text, 'Project chat')
    projects = sorted({g for g in map(asana_project_gid, raw_projects) if g})
    spaces = sorted({s for s in map(chat_space_name, raw_spaces) if s})
    notes = []
    if not raw_projects:
        notes.append('no Asana project declared (the line is missing, `none`, or still in {braces})')
    elif not projects:
        notes.append('the Asana project line carries no usable project URL: ' + '; '.join(raw_projects))
    elif len(projects) > 1:
        notes.append('two different Asana projects are declared, so Paco holds rather than guessing')
    if not raw_spaces:
        notes.append('no Project chat declared')
    elif not spaces:
        notes.append('the Project chat line carries no usable space: ' + '; '.join(raw_spaces))
    elif len(spaces) > 1:
        notes.append('two different chat spaces are declared, so Paco holds rather than guessing')
    return {'path': folder.name,
            'project': projects[0] if len(projects) == 1 else None,
            'space': spaces[0] if len(spaces) == 1 else None,
            'notes': notes}


def client_folders(root):
    for client in sorted(p for p in root.iterdir() if p.is_dir()):
        if client.name.startswith('.') or client.name.lower() in NON_CLIENT:
            continue
        yield client
        for sub in sorted(p for p in client.iterdir() if p.is_dir()):
            if not sub.name.startswith('.') and sub.name.lower() not in RECORD_DIRS and (sub / 'CONTEXT.md').is_file():
                yield sub


def report(result, verbose=True):
    name = result['path']
    if result.get('error'):
        print('  ?  %-42s %s' % (name, result['error']))
        return False
    ready = bool(result['project'] and result['space'])
    print('  %s  %-42s asana=%-8s chat=%s' % ('OK' if ready else '..', name,
                                              result['project'] or 'missing', result['space'] or 'missing'))
    if verbose:
        for note in result['notes']:
            print('       - ' + note)
        if ready:
            print('       Both lines are set. Remaining, and only Mike can do it: add Paco to the space in')
            print('       Google Chat (open the space, click its name, apps and integrations, add apps,')
            print('       search Paco). Paco checks every member is Power Cloud staff before it posts, and')
            print('       refuses if anyone else is in there. Nothing else is needed; there is no allowlist.')
    return ready


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('--client', help='Client folder name, relative to the workspace root')
    parser.add_argument('--all', action='store_true', help='Every client record in the workspace')
    args = parser.parse_args(argv)
    here = Path.cwd()
    root = here
    while root != root.parent and not (root / 'CLAUDE.md').is_file():
        root = root.parent
    if args.all:
        print('Board update readiness (Asana project + Project chat, both required):')
        results = [inspect(f) for f in client_folders(root)]
        for result in sorted(results, key=lambda r: (not (r.get('project') and r.get('space')), r['path'])):
            report(result, verbose=False)
        ready = sum(1 for r in results if r.get('project') and r.get('space'))
        print('\n%d of %d records are mapped. A record needs both lines before Paco posts anything.' % (ready, len(results)))
        return 0
    folder = (root / args.client) if args.client else here
    if not folder.is_dir():
        print('No such folder: ' + str(folder), file=sys.stderr)
        return 2
    print('Board update readiness for ' + folder.name + ':')
    return 0 if report(inspect(folder)) else 1


if __name__ == '__main__':
    raise SystemExit(main())
