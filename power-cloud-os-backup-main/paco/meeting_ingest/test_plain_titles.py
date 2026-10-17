import unittest
from .core import client_record,route
from .paco_scan import review_card

class PlainTitleTests(unittest.TestCase):
 def setUp(self):
  self.index=[client_record(n,'') for n in ['44 Pro','Preferred Plastics','GW','44 Pro - AI Summit Test']]
 def decide(self,title):
  return route({'summary':title,'artifacts':[{'id':'sample'}]},self.index,[])
 def test_exact_folder_in_plain_title(self):
  self.assertEqual(self.decide('44 Pro Internal Test')['targets'],['44 Pro'])
 def test_punctuation_and_case(self):
  self.assertEqual(self.decide('Review: PREFERRED PLASTICS')['targets'],['Preferred Plastics'])
 def test_abbreviation_not_inferred(self):
  self.assertEqual(self.decide('PP Meeting')['targets'],[])
 def test_no_partial_word_match(self):
  self.assertEqual(self.decide('44 Professional review')['targets'],[])
 def test_multiple_names_need_review(self):
  d=self.decide('44 Pro and Preferred Plastics review')
  self.assertEqual(d['state'],'unfiled');self.assertEqual(len(d['targets']),2)
 def test_overlapping_names_not_silently_selected(self):
  self.assertEqual(self.decide('44 Pro - AI Summit Test review')['state'],'unfiled')
 def test_private_still_wins(self):
  self.assertEqual(self.decide('[private] 44 Pro review')['state'],'skipped-private')
 def test_card_without_suggestion(self):
  card=review_card({'id':'test','title':'PP Meeting'},[])
  widgets=card['cardsV2'][0]['card']['sections'][0]['widgets']
  self.assertIn('could not confidently match',widgets[0]['textParagraph']['text'])
  self.assertEqual(widgets[1]['buttonList']['buttons'][0]['text'],'Choose a client')
 def test_card_with_suggestion(self):
  card=review_card({'id':'test','title':'44 Pro review'},['44 Pro'])
  widgets=card['cardsV2'][0]['card']['sections'][0]['widgets']
  self.assertIn('Suggested destination: 44 Pro',widgets[0]['textParagraph']['text'])
  self.assertEqual(widgets[1]['buttonList']['buttons'][1]['text'],'Somewhere else')
