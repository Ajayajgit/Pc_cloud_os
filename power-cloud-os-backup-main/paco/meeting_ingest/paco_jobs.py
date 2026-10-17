"""Meeting capability behind Paco. Only an exact, DM-confirmed plan can execute."""
import argparse
import html
import json
from pathlib import Path
from .paco import connect,attach_plan,queue_card_status
from .filing import prepare,save_preview,execute,journal_lock
from .google_read import GoogleReader,delegated_session
from .google_write import GoogleWriter


def preview_message(row,plan,token):
    details=('Move originals:\n'+
          '\n'.join('- '+m['name'] for m in plan['moves'])+'\nCreate:\n'+
          '\n'.join('- '+m['name'] for m in plan['generated'])+
          ('\nAppend to working/meetings_log.md, preserving existing entries. ' if plan.get('log_update') else '\nAlso create working/meetings_log.md. ')+'Shared-drive members will gain access.\n'+
          '\nTo confirm by text, reply confirm '+token+'.')
    text=('File '+row['title']+' in '+row['target']+'/source/?\n'+
          'https://drive.google.com/drive/folders/'+plan['source_id']+'\nShared-drive members will have access.')
    buttons=[]
    for label,command in [('Confirm','confirm '+token),('Cancel','cancel')]:
        buttons.append({'text':label,'onClick':{'action':{'function':'meeting','parameters':[
            {'key':'paco_action','value':'meeting'},{'key':'meeting_id','value':row['id']},
            {'key':'command','value':command}]}}})
    return {'text':text,'cardsV2':[{'cardId':'preview-'+token,'card':{'sections':[
        {'widgets':[{'buttonList':{'buttons':buttons}}]},
        {'header':'File details','collapsible':True,'uncollapsibleWidgetsCount':0,
         'widgets':[{'textParagraph':{'text':html.escape(details).replace('\n','<br>')}}]}]}}]}


def tell(db,row,stage,text):
    user=db.execute('SELECT space FROM paco_users WHERE email=?',(row['organizer'],)).fetchone()
    if not user or not row['thread']:raise ValueError('No verified private reply destination')
    body=dict(text) if isinstance(text,dict) else {'text':text}
    body['thread']={'name':row['thread']}
    with db:db.execute('INSERT OR IGNORE INTO paco_outbox(id,space,body) VALUES(?,?,?)',
        ('client-'+stage+'-'+row['id'],user['space'],json.dumps(body)))


def run(config, *, meeting_ids=None):
    index=json.loads(Path(config['index_path']).read_text())
    source=json.loads(Path(config['survey_config']).read_text())
    root=Path(config['plans_path']);root.mkdir(parents=True,exist_ok=True)
    with journal_lock(config['database']):
        db=connect(config['database'])
        try:
            for row in db.execute("SELECT * FROM paco_meetings WHERE state IN ('preparing','approved','filing')").fetchall():
                if meeting_ids is not None and row['id'] not in meeting_ids:continue
                if row['organizer'] not in config['allowed_users']:continue
                directory=root/row['id'];directory.mkdir(exist_ok=True)
                try:
                    if row['state']=='preparing':
                        reader=GoogleReader(delegated_session(source['key_path'],row['organizer'],config['allowed_users']))
                        event=reader.artifacts(json.loads(row['payload']))
                        client=next(c for c in index if c['path']==row['target'])
                        plan=prepare(reader,event,client,row['organizer'])
                        save_preview(plan,directory)
                        if config.get('file_on_selection') is True and config.get('enable_confirmed_filing') is True:
                            if row['confirmed_by']!=row['organizer'] or not row['confirmed_at']:
                                raise ValueError('Client selection has no organizer approval')
                            with db:db.execute("UPDATE paco_meetings SET state='approved',plan_hash=?,nonce=NULL WHERE id=?",
                                               (plan['sha256'],row['id']))
                            continue
                        token=attach_plan(db,row['id'],plan['sha256'],commit=False)
                        tell(db,row,'preview-'+token,preview_message(row,plan,token))
                    elif config.get('enable_confirmed_filing') is True:
                        from google.oauth2 import service_account
                        from google.auth.transport.requests import AuthorizedSession
                        plan=json.loads((directory/'filing-plan.json').read_text())
                        if plan['owner']!=row['organizer'] or not row['confirmed_by'] or row['confirmed_by']!=row['organizer']:
                            raise ValueError('Organizer/owner approval mismatch')
                        creds=service_account.Credentials.from_service_account_file(source['key_path'],scopes=['https://www.googleapis.com/auth/drive']).with_subject(row['organizer'])
                        writer=GoogleWriter(AuthorizedSession(creds),row['organizer'],enabled=True)
                        with db:db.execute("UPDATE paco_meetings SET state='filing' WHERE id=?",(row['id'],))
                        execute(plan,writer,directory/'journal.db',row['plan_hash'])
                        # Completion and its notification commit together. A crash
                        # after the Drive writes resumes through the filing journal.
                        db.execute("UPDATE paco_meetings SET state='filed' WHERE id=?",(row['id'],))
                        queue_card_status(db,row,'Filed '+row['title']+' in '+row['target']+'/source/.\nhttps://drive.google.com/drive/folders/'+plan['source_id'])
                        tell(db,row,'filed','Filed '+row['title']+' in '+row['target']+'/source/.\nhttps://drive.google.com/drive/folders/'+plan['source_id'])
                except (ValueError,StopIteration) as error:
                    db.execute("UPDATE paco_meetings SET state='needs-review',nonce=NULL WHERE id=?",(row['id'],))
                    queue_card_status(db,row,'Needs review: '+row['title']+'\nFiling paused. See the reply in this thread.')
                    tell(db,row,'held','I held '+row['title']+' for review. '+str(error)+'. No further filing will run automatically for this meeting.')
        finally:db.close()


def main():
    parser=argparse.ArgumentParser();parser.add_argument('--config',required=True,type=Path)
    parser.add_argument('--preview-only',action='store_true')
    args=parser.parse_args()
    config=json.loads(args.config.read_text())
    if args.preview_only:config['enable_confirmed_filing']=False
    run(config)


if __name__=='__main__':main()
