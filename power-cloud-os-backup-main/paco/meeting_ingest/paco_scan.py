"""Scheduled read-only collector. It queues private reviews, never files originals."""
import argparse
import html
import json
from pathlib import Path
from datetime import datetime,timedelta,timezone
from .google_read import GoogleReader,delegated_session
from .core import survey,open_ledger
from .paco import connect,enqueue
from .filing import journal_lock


def review_card(row,targets):
    choices=[(t,t) for t in targets if '/' not in t]
    has_suggestions = bool(choices)
    choices += [('Somewhere else' if has_suggestions else 'Choose a client','somewhere else'),('Internal, no client','internal'),('Private, skip','private')]
    return {'text':'Where does this meeting belong? '+row['title'],
        'cardsV2':[{'cardId':'meeting-'+row['id'],'card':{
            'header':{'title':'Where does this meeting belong?','subtitle':row['title']},
            'sections':[{'widgets':[{'textParagraph':{'text':('Suggested destination: ' + html.escape(', '.join(t for t, _ in choices[:-3])) + '. ' if has_suggestions else 'I could not confidently match a client. ') + 'Choose a client or reply with its name in this thread to file the meeting there. Shared-drive members will have access.'}},
                {'buttonList':{'buttons':[{'text':label,'onClick':{'action':{'function':'meeting','parameters':[
                    {'key':'paco_action','value':'meeting'},
                    {'key':'meeting_id','value':row['id']},{'key':'command','value':command}]}}} for label,command in choices]}}]}]}}]}


def run(config):
    source=json.loads(Path(config['survey_config']).read_text())
    if source['subject'].lower() not in config['allowed_users']:raise ValueError('Survey subject not in pilot')
    organizers=sorted(set(source.get('allowed_organizers',[source['subject']])))
    if not organizers or any(o not in config['allowed_users'] for o in organizers):
        raise ValueError('Every scanned organizer must be explicitly allowed in Paco')
    reader=GoogleReader(delegated_session(source['key_path'],source['subject'],[source['subject']]))
    now=datetime.now(timezone.utc)
    index=reader.client_index(source['os_root_id'])
    if not index:raise ValueError('Empty client index')
    events=[]
    failures=[]
    for organizer in organizers:
        try:
            owner_reader=GoogleReader(delegated_session(source['key_path'],organizer,organizers))
            since=now-timedelta(days=30)
            if source.get('scan_since',{}).get(organizer):
                enabled_at=datetime.fromisoformat(source['scan_since'][organizer])
                if enabled_at.tzinfo is None:raise ValueError('Rollout time must include a timezone')
                since=max(since,enabled_at)
            # Collect each account independently; one access failure must not
            # stop other consultants from receiving their own private reviews.
            collected=[owner_reader.artifacts(e) for e in owner_reader.organized_events(
                organizer,since.isoformat(),now.isoformat())]
            if any(e.get('organizer',{}).get('email','').lower()!=organizer for e in collected):
                raise ValueError('Calendar returned another organizer')
            events.extend(collected)
        except Exception as error:
            failures.append(organizer+': '+type(error).__name__)
    exclusions=json.loads(Path(source['exclusions_path']).read_text()) if source.get('exclusions_path') else {}
    ledger=open_ledger()
    try:decisions=survey(events,index,source['internal_domains'],ledger,exclusions=exclusions)
    finally:ledger.close()
    by_id={(e['organizer']['email'].lower(),e['id']):e for e in events}
    with journal_lock(config['database']):
        db=connect(config['database'])
        try:
            # Only actionable reviews are retained; no internal/private titles enter Paco.
            for d in decisions:
                if d['state'] not in {'would-file','unfiled','needs-multi-client-review','held-prospect'}:continue
                event=by_id[(d['organizer'],d['event_id'])]
                if not event.get('artifacts'):continue
                key=enqueue(db,event)
                row=db.execute('SELECT * FROM paco_meetings WHERE id=?',(key,)).fetchone()
                user=db.execute('SELECT * FROM paco_users WHERE email=?',(row['organizer'],)).fetchone()
                if user and row['state']=='pending':
                    with db:db.execute('INSERT OR IGNORE INTO paco_outbox(id,space,body) VALUES(?,?,?)',
                        ('client-review-'+key,user['space'],json.dumps(review_card(row,d['targets']))))
            destination=Path(config['index_path'])
            temporary=destination.with_suffix('.tmp');temporary.write_text(json.dumps(index));temporary.replace(destination)
        finally:db.close()
    print('Paco scan completed; no Drive writes. Organized events:',len(events))
    if failures:raise RuntimeError('Organizer scans failed: '+'; '.join(failures))


def main():
    p=argparse.ArgumentParser();p.add_argument('--config',required=True,type=Path)
    run(json.loads(p.parse_args().config.read_text()))


if __name__=='__main__':main()
