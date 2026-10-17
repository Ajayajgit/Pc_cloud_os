import unittest
from .paco import connect,handle
from .paco_onboard import verify_dm,register
class OnboardTests(unittest.TestCase):
 def test_dm_requires_one_human_and_private_app_space(self):
  space={'spaceType':'DIRECT_MESSAGE','singleUserBotDm':True};members=[{'state':'JOINED','member':{'type':'HUMAN','name':'users/1'}}]
  self.assertEqual(verify_dm(space,members),'users/1')
  for bad in ([],members*2):
   with self.assertRaises(ValueError):verify_dm(space,bad)
  with self.assertRaises(ValueError):verify_dm({'spaceType':'SPACE'},members)
 def test_registration_cannot_cross_users_or_replace_identity(self):
  db=connect(':memory:');self.addCleanup(db.close)
  register(db,'a@example.com','users/1','spaces/one');register(db,'a@example.com','users/1','spaces/one')
  with self.assertRaises(ValueError):register(db,'b@example.com','users/1','spaces/one')
  with self.assertRaises(ValueError):register(db,'a@example.com','users/2','spaces/two')
  self.assertEqual(db.execute('SELECT count(*) FROM paco_users').fetchone()[0],1)
 def test_install_registers_silently_and_replays_silently(self):
  db=connect(':memory:');self.addCleanup(db.close)
  event={'type':'ADDED_TO_SPACE','user':{'email':'a@example.com','name':'users/1'},'space':{'name':'spaces/one','type':'DM'}}
  for _ in range(2):self.assertIsNone(handle(db,'event',event,[],['a@example.com']))
  self.assertEqual(db.execute('SELECT count(*) FROM paco_users').fetchone()[0],1)
  self.assertEqual(db.execute('SELECT count(*) FROM paco_outbox').fetchone()[0],0)
