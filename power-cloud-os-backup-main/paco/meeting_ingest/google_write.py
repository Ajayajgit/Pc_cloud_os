"""Explicitly gated Drive transport; never imported by the read-only survey CLI."""
import json
import uuid
from urllib.parse import quote

from .google_read import GoogleReader


class GoogleWriter:
    def __init__(self, session, subject, *, enabled=False):
        self.session=session
        self.subject=subject.lower()
        self.enabled=enabled
        self.reader=GoogleReader(session)

    def meta(self,id):
        r=self.session.get('https://www.googleapis.com/drive/v3/files/'+quote(id,safe=''),params={
            'supportsAllDrives':'true','fields':'id,name,parents,driveId,owners(emailAddress),version,trashed,appProperties,md5Checksum'},timeout=60)
        if r.status_code==404:
            return None
        if r.status_code!=200:
            raise RuntimeError(f'Drive metadata failed: HTTP {r.status_code}')
        result=r.json();result['_etag']=r.headers.get('ETag')
        return result

    def children(self,parent):
        return self.reader.children(parent)

    def move_meta(self,id):
        # Keep the ETag and mutation on v2; v3 does not expose this token.
        r=self.session.get('https://www.googleapis.com/drive/v2/files/'+quote(id,safe=''),params={
            'supportsAllDrives':'true','fields':'id,title,etag,version,parents(id),owners(emailAddress),labels(trashed),driveId'},timeout=60)
        if r.status_code!=200:
            raise RuntimeError(f'Conditional metadata failed: HTTP {r.status_code}')
        f=r.json()
        return {**f,'name':f.get('title'),'parents':[p['id'] for p in f.get('parents',[])],
                'trashed':f.get('labels',{}).get('trashed',False),'_etag':f.get('etag')}

    def reserve_id(self):
        return self.reader.get('drive','files/generateIds',{'count':1,'space':'drive','type':'files'})['ids'][0]

    def move(self,original,parent):
        if not self.enabled:
            raise ValueError('Drive writes disabled')
        current=self.move_meta(original['id'])
        if not current or current.get('trashed') or current.get('name')!=original['name'] or current.get('driveId') or current.get('version')!=original['version'] or current.get('parents')!=original['parents'] or self.subject not in {o.get('emailAddress','').lower() for o in current.get('owners',[])}:
            raise ValueError('Original changed immediately before move')
        if not current.get('_etag'):
            raise ValueError('No ETag available for conditional move; refusing unguarded mutation')
        r=self.session.patch('https://www.googleapis.com/drive/v2/files/'+quote(original['id'],safe=''),
                             params={'supportsAllDrives':'true','addParents':parent,'removeParents':','.join(original['parents']),'fields':'id,parents,driveId'},
                             json={},headers={'If-Match':current['_etag']},timeout=60)
        if r.status_code!=200:
            raise RuntimeError(f'Drive move failed: HTTP {r.status_code}; resume to reconcile')

    def create(self,id,parent,name,content,props):
        if not self.enabled:
            raise ValueError('Drive writes disabled')
        boundary='pc_'+uuid.uuid4().hex
        metadata={'id':id,'name':name,'mimeType':'text/markdown','parents':[parent],'appProperties':props}
        body=(f'--{boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n'+json.dumps(metadata)+
              f'\r\n--{boundary}\r\nContent-Type: text/markdown; charset=UTF-8\r\n\r\n'+content+f'\r\n--{boundary}--\r\n').encode()
        r=self.session.post('https://www.googleapis.com/upload/drive/v3/files',
                            params={'uploadType':'multipart','supportsAllDrives':'true','fields':'id'},
                            data=body,headers={'Content-Type':'multipart/related; boundary='+boundary},timeout=60)
        if r.status_code not in {200,201}:
            raise RuntimeError(f'Drive creation failed: HTTP {r.status_code}; resume to reconcile reserved ID')

    def update_log(self, original):
        """Update only the approved log content, using the same v2 ETag as the write."""
        if not self.enabled:
            raise ValueError('Drive writes disabled')
        current = self.move_meta(original['id'])
        if (current.get('trashed') or current.get('name') != original['name']
                or current.get('parents') != original['parents']
                or current.get('driveId') != original['driveId']
                or current.get('version') != original['version']):
            raise ValueError('Meeting log changed immediately before update')
        if not current.get('_etag'):
            raise ValueError('No ETag available for conditional log update')
        response = self.session.put(
            'https://www.googleapis.com/upload/drive/v2/files/' + quote(original['id'], safe=''),
            params={'uploadType':'media', 'supportsAllDrives':'true', 'fields':'id'},
            data=original['content'].encode(),
            headers={'Content-Type':'text/markdown; charset=UTF-8','If-Match':current['_etag']}, timeout=60)
        if response.status_code != 200:
            raise RuntimeError(f'Drive log update failed: HTTP {response.status_code}; resume to reconcile')
