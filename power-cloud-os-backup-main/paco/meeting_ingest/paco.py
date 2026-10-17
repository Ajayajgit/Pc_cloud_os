"""Paco's private conversation layer. No Google credentials or Drive writes here."""
import hashlib
import json
import secrets
import sqlite3
from datetime import datetime, timezone
from .core import match_clients
from .paco_events import normalize

HELP = ('I’m Paco, your Power Cloud OS assistant. My first capability is meeting filing. '
        'Use status to see your pending meetings, list to see client names, or reply to a meeting card with a client name. '
        'Choosing a client authorizes filing into its source folder. Internal and private/skip keep the meeting out of client folders.')


def connect(path):
    db=sqlite3.connect(path)
    db.row_factory=sqlite3.Row
    db.execute('PRAGMA foreign_keys=ON')
    db.executescript('''
      CREATE TABLE IF NOT EXISTS paco_users (email TEXT PRIMARY KEY, user_id TEXT NOT NULL, space TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS paco_meetings (
        id TEXT PRIMARY KEY, organizer TEXT NOT NULL, title TEXT NOT NULL, payload TEXT NOT NULL,
        state TEXT NOT NULL DEFAULT 'pending', thread TEXT, target TEXT, nonce TEXT,
        plan_hash TEXT, confirmed_by TEXT, confirmed_at TEXT, created_at TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS paco_events (id TEXT PRIMARY KEY, response TEXT);
      CREATE TABLE IF NOT EXISTS paco_outbox (id TEXT PRIMARY KEY, space TEXT NOT NULL, body TEXT NOT NULL, sent INTEGER NOT NULL DEFAULT 0);
      CREATE TABLE IF NOT EXISTS paco_card_updates (id TEXT PRIMARY KEY, space TEXT NOT NULL, message_id TEXT NOT NULL, body TEXT NOT NULL, sent INTEGER NOT NULL DEFAULT 0);
    ''')
    return db


def enqueue(db,event):
    organizer=event['organizer']['email'].lower()
    key=hashlib.sha256((organizer+':'+event['id']).encode()).hexdigest()[:24]
    with db:
        db.execute('INSERT OR IGNORE INTO paco_meetings(id,organizer,title,payload,created_at) VALUES(?,?,?,?,?)',
                   (key,organizer,event['summary'],json.dumps(event),datetime.now(timezone.utc).isoformat()))
    return key


def handle(db,event_id,event,index,allowed_users,filing_enabled=True):
    """Called only for events delivered by the authenticated private subscription.

    Duplicate deliveries replay the durable result. Actor and DM are checked before
    any meeting lookup. Confirmation creates work for a separate guarded executor.
    """
    event=normalize(event)
    email=event.get('user',{}).get('email','').lower()
    user_id=event.get('user',{}).get('name','')
    space=event.get('space',{})
    if email not in allowed_users or not user_id or space.get('type')!='DM':
        return None
    if event.get('type') not in {'MESSAGE','ADDED_TO_SPACE','CARD_CLICKED'}:
        return None
    with db:
        prior=db.execute('SELECT response FROM paco_events WHERE id=?',(event_id,)).fetchone()
        if prior:return json.loads(prior['response'])
        known=db.execute('SELECT * FROM paco_users WHERE email=?',(email,)).fetchone()
        if known and (known['user_id']!=user_id or known['space']!=space['name']):
            return None
        db.execute('INSERT OR IGNORE INTO paco_users VALUES(?,?,?)',(email,user_id,space['name']))
        if event.get('type')=='ADDED_TO_SPACE':
            db.execute('INSERT INTO paco_events VALUES(?,?)',(event_id,'null'))
            return None
        text=(event.get('message',{}).get('argumentText') or event.get('message',{}).get('text','')).strip()
        action=event.get('action',{})
        params={p['key']:p['value'] for p in action.get('parameters',[])}
        if action.get('actionMethodName')=='meeting':text=params.get('command','')
        thread=event.get('message',{}).get('thread',{}).get('name')
        response=_reply(db,email,text,thread,params,index,event.get('type'))
        if response is None:
            # The preview job supplies the single useful response. Persist the
            # silent result so redelivery cannot reset a prepared/approved plan.
            db.execute('INSERT INTO paco_events VALUES(?,?)',(event_id,'null'))
            return None
        if not filing_enabled:
            if response.startswith('Confirmed for '):
                response='Approval recorded for this preview. Automatic filing is disabled during the pilot; nothing has moved.'
            elif response==HELP:
                response+=' Pilot status: automatic filing is disabled.'
        body={'text':response}
        if thread:body['thread']={'name':thread}
        oid='client-'+hashlib.sha256(event_id.encode()).hexdigest()[:40]
        db.execute('INSERT INTO paco_events VALUES(?,?)',(event_id,json.dumps(body)))
        db.execute('INSERT INTO paco_outbox(id,space,body) VALUES(?,?,?)',(oid,space['name'],json.dumps(body)))
        return body


def queue_card_status(db,row,text):
    review_id='client-review-'+row['id']
    review=db.execute('SELECT space FROM paco_outbox WHERE id=? AND sent=1',(review_id,)).fetchone()
    if not review:return
    # Only the newest status may be delivered, including after uncertain retries.
    db.execute('DELETE FROM paco_card_updates WHERE message_id=?',(review_id,))
    db.execute('INSERT INTO paco_card_updates(id,space,message_id,body) VALUES(?,?,?,?)',
               (row['id']+'-status',review['space'],review_id,json.dumps({'text':text,'cardsV2':[]})))


def _reply(db,email,text,thread,params,index,event_type):
    roots=[c for c in index if '/' not in c['path']]
    command=text.lower()
    if event_type=='ADDED_TO_SPACE' or command in {'help','hello','hi',''}:return HELP
    if command=='list':return 'Client folders:\n'+'\n'.join(c['path'] for c in roots)
    if command=='status':
        rows=db.execute("SELECT title,state FROM paco_meetings WHERE organizer=? AND state NOT IN ('filed','private','internal') ORDER BY created_at",(email,)).fetchall()
        return '\n'.join(r['title']+' — '+r['state'] for r in rows) or 'You have no pending meetings.'
    key=params.get('meeting_id')
    if key:
        row=db.execute('SELECT * FROM paco_meetings WHERE id=? AND organizer=?',(key,email)).fetchone()
    elif thread:
        row=db.execute('SELECT * FROM paco_meetings WHERE thread=? AND organizer=?',(thread,email)).fetchone()
    else:
        row=None
    if not row:return 'Please reply in the meeting’s thread so I know which meeting you mean. Use status to see what is pending.'
    if row['state'] in {'filed','private','internal','approved','filing'}:return 'That meeting is already '+row['state']+'. Use status for pending work.'
    if command in {'private','skip','internal'}:
        state='internal' if command=='internal' else 'private'
        db.execute('UPDATE paco_meetings SET state=?,target=NULL,nonce=NULL,plan_hash=NULL,confirmed_by=?,confirmed_at=? WHERE id=?',
                   (state,email,datetime.now(timezone.utc).isoformat(),row['id']))
        queue_card_status(db,row,'Marked '+state+': '+row['title']+'\nNo files will be placed in client folders.')
        return 'Marked '+state+'. No files will be placed in client folders.'
    if command=='cancel':
        db.execute("UPDATE paco_meetings SET state='pending',target=NULL,nonce=NULL,plan_hash=NULL WHERE id=?",(row['id'],))
        return 'Cancelled the proposed destination. The meeting remains pending.'
    if command.startswith('confirm '):
        token=text.split(' ',1)[1].strip()
        if row['state']!='awaiting-confirmation' or not row['plan_hash'] or not secrets.compare_digest(token,row['nonce'] or ''):
            return 'That confirmation is stale or not ready. Choose the client again to get a current preview.'
        db.execute("UPDATE paco_meetings SET state='approved',confirmed_by=?,confirmed_at=?,nonce=NULL WHERE id=?",
                   (email,datetime.now(timezone.utc).isoformat(),row['id']))
        return 'Confirmed for '+row['target']+'/source/. I will file the approved plan and report the result here.'
    if command in {'yes','confirm'}:return 'Use the confirmation code on the current preview. A plain yes cannot approve an older or ambiguous preview.'
    if command.startswith('prospect '):
        name=text[9:].strip()
        if not name:return 'Please include the prospect name.'
        db.execute("UPDATE paco_meetings SET state='held-prospect',target=?,nonce=NULL,plan_hash=NULL WHERE id=?",(name,row['id']))
        return 'Held for prospect '+name+'. Originals stay where they are; I will not create a client folder.'
    if command=='somewhere else':return 'Reply in this thread with the client name to file the meeting in its source folder.'
    hits=match_clients(text,roots)
    if len(hits)!=1:return ('Several clients match: '+', '.join(hits)+'. Please use the full name.') if hits else 'No matching client folder. Use list or prospect followed by a name.'
    db.execute("UPDATE paco_meetings SET state='preparing',target=?,nonce=NULL,plan_hash=NULL,confirmed_by=?,confirmed_at=? WHERE id=?",
               (hits[0],email,datetime.now(timezone.utc).isoformat(),row['id']))
    queue_card_status(db,row,'Selection received: '+row['title']+'\nPreparing filing in '+hits[0]+'/source/.')
    return None


def attach_plan(db,key,plan_hash,commit=True):
    token=secrets.token_hex(4)
    row=db.execute("SELECT * FROM paco_meetings WHERE id=? AND state='preparing'",(key,)).fetchone()
    if not row:raise ValueError('Meeting is not awaiting a plan')
    db.execute("UPDATE paco_meetings SET state='awaiting-confirmation',plan_hash=?,nonce=? WHERE id=?",(plan_hash,token,key))
    if commit:db.commit()
    return token
