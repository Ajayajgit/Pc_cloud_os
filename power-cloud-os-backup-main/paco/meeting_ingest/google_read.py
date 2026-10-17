"""GET-only Google adapter. Credentials remain on the VPS; no filing API exists."""
import re
from urllib.parse import quote

from .core import NON_CLIENT, RECORD_DIRS, client_record, private

SCOPES = ['https://www.googleapis.com/auth/calendar.readonly',
          'https://www.googleapis.com/auth/drive.readonly']
FOLDER = 'application/vnd.google-apps.folder'


def delegated_session(key_path, subject, allowed_organizers):
    if subject.lower() not in {s.lower() for s in allowed_organizers}:
        raise ValueError('Organizer is not explicitly allowlisted')
    from google.oauth2 import service_account
    from google.auth.transport.requests import AuthorizedSession
    credentials = service_account.Credentials.from_service_account_file(key_path, scopes=SCOPES)
    return AuthorizedSession(credentials.with_subject(subject))


class GoogleReader:
    def __init__(self, session):
        self.session = session

    def get(self, api, path, params=None, raw=False):
        roots = {'calendar': 'https://www.googleapis.com/calendar/v3/',
                 'drive': 'https://www.googleapis.com/drive/v3/'}
        response = self.session.get(roots[api] + path, params=params or {}, timeout=60)
        if response.status_code != 200:
            # Do not print HTTP bodies: they can contain sensitive metadata.
            raise RuntimeError(f'{api} read failed (HTTP {response.status_code}); survey incomplete')
        # Drive text media/exports are UTF-8. A missing charset makes Requests
        # default text/* to Latin-1, corrupting punctuation and log checksums.
        # Decode strictly so invalid content cannot enter a filing plan.
        return response.content.decode('utf-8') if raw else response.json()

    def pages(self, api, path, params, key):
        params = dict(params)
        seen = set()
        while True:
            data = self.get(api, path, params)
            if data.get('incompleteSearch'):
                raise RuntimeError('Drive reported incompleteSearch; refusing partial survey')
            yield from data.get(key, [])
            token = data.get('nextPageToken')
            if not token:
                break
            if token in seen:
                raise RuntimeError('Repeated pagination token')
            seen.add(token)
            params['pageToken'] = token

    def children(self, parent):
        escaped = parent.replace('\\', '\\\\').replace("'", "\\'")
        return list(self.pages('drive', 'files', {
            'q': f"'{escaped}' in parents and trashed = false", 'pageSize': 1000,
            'supportsAllDrives': 'true', 'includeItemsFromAllDrives': 'true',
            'fields': 'nextPageToken,incompleteSearch,files(id,name,mimeType,parents,webViewLink,driveId,owners(emailAddress))'}, 'files'))

    def client_index(self, root_id):
        index = []
        for top in self.children(root_id):
            if top['mimeType'] != FOLDER or top['name'].startswith('.') or top['name'].lower() in NON_CLIENT:
                continue
            children = self.children(top['id'])
            folders = [(top['name'], top, children)]
            for sub in children:
                if sub['mimeType'] == FOLDER and not sub['name'].startswith('.') and sub['name'].lower() not in RECORD_DIRS:
                    folders.append((top['name'] + '/' + sub['name'], sub, self.children(sub['id'])))
            for path, folder, entries in folders:
                contexts = [f for f in entries if f['name'] == 'CONTEXT.md']
                if len(contexts) > 1:
                    raise ValueError('Duplicate CONTEXT.md in ' + path)
                if contexts:
                    text = self.get('drive', 'files/' + quote(contexts[0]['id'], safe=''),
                                    {'alt': 'media', 'supportsAllDrives': 'true'}, raw=True)
                    index.append(client_record(path, text, folder['id']))
        return index

    def organized_events(self, subject, time_min, time_max):
        events = self.pages('calendar', 'calendars/primary/events', {
            'timeMin': time_min, 'timeMax': time_max, 'singleEvents': 'true',
            'showDeleted': 'false', 'maxResults': 2500}, 'items')
        for event in events:
            if event.get('organizer', {}).get('email', '').lower() != subject.lower():
                continue
            if event.get('status') == 'cancelled' or private(event):
                continue
            if event.get('attendeesOmitted'):
                raise RuntimeError('Calendar attendee list incomplete')
            yield event

    def artifacts(self, event):
        """Attachment-first, then siblings in a verified new Meet meeting folder.

        No filename-only association: an unanchored or legacy folder remains unresolved.
        This prevents recurring calls with identical titles sharing the wrong recording.
        """
        artifacts = {}
        folders = set()
        for attachment in event.get('attachments', []):
            file_id = attachment.get('fileId')
            if not file_id:
                continue
            f = self.get('drive', 'files/' + quote(file_id, safe=''), {
                'supportsAllDrives': 'true',
                'fields': 'id,name,mimeType,parents,trashed,webViewLink,driveId,owners(emailAddress)'})
            if f.get('trashed'):
                continue
            kind = artifact_kind(f)
            if kind:
                artifacts[f['id']] = dict(f, kind=kind, evidence='calendar-attachment')
                folders.update(f.get('parents', []))
        verified = False
        # Calendar-linked artifact names supply the occurrence timestamp. Never
        # collect all files from a recurring series or legacy recording folder.
        stems = {artifact_stem(f) for f in artifacts.values()} - {None}
        for folder_id in sorted(folders):
            folder = self.get('drive', 'files/' + quote(folder_id, safe=''),
                              {'fields': 'id,name,mimeType,parents', 'supportsAllDrives': 'true'})
            if folder['name'] in {'Legacy Meet Recordings', 'Meet Recordings'}:
                if stems:
                    for sibling in self.children(folder_id):
                        kind = artifact_kind(sibling)
                        if kind and artifact_stem(sibling) in stems and sibling['id'] not in artifacts:
                            artifacts[sibling['id']] = dict(sibling, kind=kind, evidence='calendar-anchored-legacy-occurrence')
                    verified = True
                continue
            if folder['name'] == 'Google Meet':
                continue
            for parent in folder.get('parents', []):
                root = self.get('drive', 'files/' + quote(parent, safe=''),
                                {'fields': 'id,name,parents', 'supportsAllDrives': 'true'})
                if root['name'] != 'Google Meet':
                    continue
                verified = bool(stems)
                for sibling in self.children(folder_id):
                    kind = artifact_kind(sibling)
                    if kind and stems and artifact_stem(sibling) in stems and sibling['id'] not in artifacts:
                        artifacts[sibling['id']] = dict(sibling, kind=kind, evidence='anchored-meet-folder')
        event = dict(event, artifacts=list(artifacts.values()), discovery_complete=verified, storage_checked=True)
        if not verified:
            event['discovery_warning'] = 'No Calendar-anchored per-meeting folder; manual attachment/fallback validation required'
        return event


def artifact_stem(file):
    name = file.get('name', '').strip()
    # Verified live naming: title - YYYY/MM/DD HH:MM TZ - artifact type.
    match = re.fullmatch(r'(.+ - \d{4}/\d{2}/\d{2} \d{2}:\d{2} [A-Z0-9+:-]+) - (?:Recording|Transcript|Notes by Gemini)(?:\.mp4)?', name, re.I)
    return match.group(1).casefold() if match else None


def artifact_kind(file):
    mime = file.get('mimeType', '')
    name = file.get('name', '').lower()
    if mime.startswith('video/'):
        return 'recording'
    if mime == 'application/vnd.google-apps.document':
        if re.search(r'\btranscript\b', name):
            return 'transcript'
        if 'notes by gemini' in name:
            return 'notes'
    return None
