"""Explicit central onboarding for allowlisted users. Sends no Chat messages."""
import argparse,json,uuid
from pathlib import Path
from .paco import connect
from .filing import journal_lock

def verify_dm(space,memberships):
 if space.get('spaceType')!='DIRECT_MESSAGE' or space.get('singleUserBotDm') is not True:
  raise ValueError('Not a private app DM')
 people=[m['member']['name'] for m in memberships if m.get('state')=='JOINED' and m.get('member',{}).get('type')=='HUMAN']
 if len(people)!=1 or not people[0].startswith('users/'):
  raise ValueError('Expected exactly one human member')
 return people[0]

def register(db,email,user_id,space):
 existing=db.execute('SELECT user_id,space FROM paco_users WHERE email=?',(email,)).fetchone()
 if existing and tuple(existing)!=(user_id,space):raise ValueError('Existing private identity differs')
 other=db.execute('SELECT email FROM paco_users WHERE (user_id=? OR space=?) AND email<>?',(user_id,space,email)).fetchone()
 if other:raise ValueError('Private destination is already bound to another user')
 db.execute('INSERT OR IGNORE INTO paco_users VALUES(?,?,?)',(email,user_id,space))

def run(config):
 from google.oauth2 import service_account
 from google.auth.transport.requests import AuthorizedSession
 key=config['chat_key_path'];base=service_account.Credentials.from_service_account_file(key)
 bot=AuthorizedSession(base.with_scopes(['https://www.googleapis.com/auth/chat.bot']))
 results=[]
 for email in config['allowed_users']:
  user=AuthorizedSession(base.with_scopes(['https://www.googleapis.com/auth/chat.spaces.create']).with_subject(email))
  response=user.post('https://chat.googleapis.com/v1/spaces:setup',json={'space':{'spaceType':'DIRECT_MESSAGE','singleUserBotDm':True},'requestId':str(uuid.uuid5(uuid.NAMESPACE_URL,'paco-dm:'+email))},timeout=30)
  response.raise_for_status();space=response.json()
  response=bot.get('https://chat.googleapis.com/v1/'+space['name']+'/members',timeout=30);response.raise_for_status()
  data=response.json()
  if data.get('nextPageToken'):raise ValueError('Unexpected paginated private membership')
  human=verify_dm(space,data.get('memberships',[]))
  # Cross-check the app's view of this exact human's private conversation.
  response=bot.get('https://chat.googleapis.com/v1/spaces:findDirectMessage',params={'name':human},timeout=30);response.raise_for_status()
  if response.json()['name']!=space['name']:raise ValueError('Private chat lookup mismatch')
  results.append((email,human,space['name']))
  print('Verified private chat:',email,flush=True)
 with journal_lock(config['database']):
  db=connect(config['database'])
  try:
   with db:
    for values in results:register(db,*values)
  finally:db.close()
 print('Registered private chats:',len(results))

def main():
 p=argparse.ArgumentParser();p.add_argument('--config',required=True,type=Path)
 run(json.loads(p.parse_args().config.read_text()))
if __name__=='__main__':main()
