"""Builds the T6 proposed-after files from the before snapshots and the seeded channel map.

Read-only on the account: every input is a CSV already exported to migration/. Run from the CRM project root:
    python migration/build_after_files.py
Writes: contacts_af_recruiters.csv, after_opportunities.csv, after_projects.csv. Deal UUIDs are generated here once;
re-running regenerates them, so run it once and keep the output (or pass --keep to reuse uuids from an existing
after_opportunities.csv).
"""
import csv
import re
import sys
import uuid
import unicodedata

ROOT = 'migration/'
CM = {1: ('Direct', None), 2: ('Referral', None), 3: ('Subcontract', 6), 4: ('Direct', None), 5: ('Subcontract', 136),
      6: ('Subcontract', 198), 7: ('Direct', None), 108: ('Referral', None), 109: ('Referral', None),
      110: ('Subcontract', 514)}
BP = {136: 'Anderson Frank', 198: 'Sererra', 6: 'Playa Technologies', 514: 'SystemsAccountants'}
OPEN = {6, 7, 8, 9, 10, 11, 12, 18, 19, 21}
LADDER = {24, 25, 23}
# engagement type id (customlist_pc_proj_types) -> project jobtype; 1 and 9 create no project
TYPE2JOB = {'2': 1, '3': 3, '4': 2, '5': 3, '7': 6, '8': 9, '10': 2, '11': 5}
ALIAS = {'erin maher pryce': 'erin maher', 'erin pryce': 'erin maher', 'josh thomas brown': 'josh brown',
         'adam vandelinde': 'adam vandelinder', 'matt fasul': 'matthew fasul', 'maria': 'CONFIRM'}
EXISTING = {'erin maher': 235}
EXISTING_EMAIL = {'erin maher': 'emaher@andersonfrank.com'}


def n(v):
    return '' if v in (None, 'None', '') else v


def slug(s):
    s = unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode().lower()
    return re.sub(r'[^a-z0-9]+', '_', s).strip('_')


def main():
    keep = '--keep' in sys.argv
    opps = list(csv.DictReader(open(ROOT + 'before_opportunities.csv', encoding='utf-8')))
    projs = list(csv.DictReader(open(ROOT + 'before_projects.csv', encoding='utf-8')))
    act = [p for p in projs if p['entitystatus'] in ('2', '5', '17') and p['isinactive'] == 'F']

    uuids = {}
    if keep:
        try:
            for r in csv.DictReader(open(ROOT + 'after_opportunities.csv', encoding='utf-8')):
                if r.get('proposed_deal_uuid'):
                    uuids['opp' + r['id']] = r['proposed_deal_uuid']
        except FileNotFoundError:
            pass

    def du(key):
        if key not in uuids:
            uuids[key] = str(uuid.uuid4())
        return uuids[key]

    # ---------- recruiters named on active projects ----------
    people = {}
    rows_pc = []
    sel_opps = [o for o in opps if int(o['entitystatus']) in OPEN | LADDER]
    # Sources: the active projects, then the open and won-ladder opportunities (keyed 'opp:OPPnnnn').
    sources = [(p, p['id'], p['parent'], p['parent_name']) for p in act]
    sources += [(o, 'opp:' + o['tranid'], '136' if n(o['class']) == '5' else '', o['class_name']) for o in sel_opps]
    for p, source_id, parent, parent_name in sources:
        name = n(p['af_contact']).strip()
        email = n(p['af_contact_email']).strip().lower()
        phone = n(p['af_contact_phone']).strip()
        if not (name or email):
            if not source_id.startswith('opp:'):
                rows_pc.append((p, None, ''))
            continue
        key = name.lower()
        note = ''
        if key in ALIAS:
            if ALIAS[key] == 'CONFIRM':
                note = 'name ambiguous in source, confirm'
                key = 'confirm:' + key
            else:
                note = 'alias of ' + ALIAS[key] + ' in source'
                key = ALIAS[key]
        if ' / ' in name:
            note = 'two names in source, confirm which'
            key = 'confirm:' + key
        if 'andresonfrank' in email:
            email = email.replace('andresonfrank', 'andersonfrank')
            note = (note + '; ' if note else '') + 'email typo corrected'
        if parent != '136':
            note = (note + '; ' if note else '') + 'source parent or class is ' + str(parent_name) + ', not AF'
        e = people.setdefault(key, {'name': name, 'emails': set(), 'phones': set(), 'projects': [], 'notes': set(),
                                    'parent': parent or '136'})
        if email and email != 'none':
            e['emails'].add(email)
        if phone:
            e['phones'].add(phone)
        e['projects'].append(source_id)
        if note:
            e['notes'].add(note)
        if not source_id.startswith('opp:'):
            rows_pc.append((p, key, note))

    with open(ROOT + 'contacts_af_recruiters.csv', 'w', newline='', encoding='utf-8') as f:
        w = csv.writer(f)
        w.writerow(['externalid', 'firstname', 'lastname', 'email', 'phone', 'company_id', 'company', 'title',
                    'contactrole', 'existing_contact_id', 'source_projects', 'note', 'mike_decision'])
        for key, e in sorted(people.items()):
            confirm = key.startswith('confirm:')
            base = key[8:] if confirm else key
            parts = base.split(' ', 1)
            first = parts[0].title()
            last = (parts[1] if len(parts) > 1 else '').title().replace("O'donnell", "O'Donnell")
            # Prefer the andersonfrank.com address when a person carries more than one.
            em = sorted(e['emails'], key=lambda a: (0 if a.endswith('@andersonfrank.com') else 1, a))
            notes = '; '.join(sorted(e['notes']))
            if base in EXISTING_EMAIL:
                # The contact already exists: keep its email, report the source emails for Mike to update or not.
                others = [a for a in em if a != EXISTING_EMAIL[base]]
                em = [EXISTING_EMAIL[base]]
                if others:
                    notes += ('; ' if notes else '') + 'source emails ' + ', '.join(others) + ' (update the existing contact or not, your call)'
            elif len(em) > 1:
                notes += ('; ' if notes else '') + 'extra emails ' + ', '.join(em[1:])
            w.writerow(['pc_contact_af_' + slug(base), first, last, em[0] if em else '',
                        sorted(e['phones'])[0] if e['phones'] else '', e['parent'],
                        BP.get(int(e['parent']), '') if e['parent'] else '', 'Recruiter',
                        'Recruiter (UI: create the contact role if absent; fill its id)',
                        EXISTING.get(base, ''), ' '.join(e['projects']), notes,
                        'FILL: confirm identity' if confirm else ''])
    print('recruiter rows', len(people), 'active projects with AF text', sum(1 for r in rows_pc if r[1]))

    # ---------- opportunities ----------
    opp_by_link = {}
    for o in opps:
        for lk in (n(o['custom_link']), n(o['native_link'])):
            if lk:
                opp_by_link.setdefault(lk, []).append(o)
    sel = [o for o in opps if int(o['entitystatus']) in OPEN | LADDER]
    cols = ['id', 'tranid', 'title', 'entity', 'entity_name', 'status_id', 'status_name', 'class_id', 'class_name',
            'relationship', 'current_end_client', 'proposed_end_client', 'end_client_rule', 'current_billing_party',
            'proposed_billing_party', 'current_deal_uuid', 'proposed_deal_uuid', 'custom_link', 'native_link',
            'current_partner_contact', 'proposed_partner_contact_externalid', 'af_contact_text', 'af_email_text',
            'kickoff', 'proposed_status_id', 'mike_kicked_off_yes_no', 'mike_end_client_id', 'note']
    with open(ROOT + 'after_opportunities.csv', 'w', newline='', encoding='utf-8') as f:
        w = csv.DictWriter(f, fieldnames=cols)
        w.writeheader()
        for o in sorted(sel, key=lambda o: int(o['id'])):
            cls = int(o['class']) if n(o['class']) else None
            rel, bp = CM.get(cls, ('UNMAPPED', None)) if cls else ('NO CLASS', None)
            ent = int(o['entity']) if n(o['entity']) else None
            if rel == 'Subcontract':
                if ent in BP:
                    pe, rule = '', 'FILL: entity is the billing party; name the end client from the title'
                else:
                    pe, rule = ent, 'subcontract: entity is already the end client (practice a); confirm'
            elif rel in ('Direct', 'Referral'):
                pe, rule = ent, rel.lower() + ': end client = entity'
            else:
                pe, rule = '', 'FILL: class unmapped or missing'
            st = int(o['entitystatus'])
            ps, note = '', ''
            if st == 24:
                ps = '23 or 25'
                note = 'Jason states kicked off or not; 23 when kicked off, else 25'
            pc = ''
            if n(o['af_contact']) or n(o['af_contact_email']):
                key = n(o['af_contact']).strip().lower()
                key = ALIAS.get(key, key)
                pc = 'pc_contact_af_' + slug(key) if key in people else 'FILL: not among active-project recruiters'
            w.writerow({'id': o['id'], 'tranid': o['tranid'], 'title': o['title'], 'entity': ent,
                        'entity_name': o['entity_name'], 'status_id': st, 'status_name': o['status_name'],
                        'class_id': cls, 'class_name': o['class_name'], 'relationship': rel,
                        'current_end_client': n(o['end_client']), 'proposed_end_client': pe, 'end_client_rule': rule,
                        'current_billing_party': n(o['billing_party']), 'proposed_billing_party': bp or '',
                        'current_deal_uuid': n(o['deal_uuid']), 'proposed_deal_uuid': du('opp' + o['id']),
                        'custom_link': n(o['custom_link']), 'native_link': n(o['native_link']),
                        'current_partner_contact': n(o['partner_contact']),
                        'proposed_partner_contact_externalid': pc, 'af_contact_text': n(o['af_contact']),
                        'af_email_text': n(o['af_contact_email']), 'kickoff': n(o['kickoff']),
                        'proposed_status_id': ps, 'mike_kicked_off_yes_no': 'FILL' if st == 24 else '',
                        'mike_end_client_id': 'FILL' if pe == '' else '', 'note': note})
    print('after_opportunities rows', len(sel), 'open', sum(1 for o in sel if int(o['entitystatus']) in OPEN),
          'ladder', sum(1 for o in sel if int(o['entitystatus']) in LADDER))

    # ---------- projects ----------
    pcmap = {p['id']: (k, note) for p, k, note in rows_pc}
    cols = ['id', 'entityid', 'companyname', 'status_id', 'status_name', 'parent', 'parent_name', 'class_id',
            'class_name', 'relationship', 'current_jobtype', 'proposed_jobtype', 'jobtype_source',
            'current_end_client', 'proposed_end_client', 'end_client_rule', 'current_partner_contact',
            'proposed_partner_contact_externalid', 'af_contact_text', 'af_email_text', 'current_deal_uuid',
            'proposed_deal_uuid', 'linked_opportunity', 'mike_end_client_id', 'note']
    with open(ROOT + 'after_projects.csv', 'w', newline='', encoding='utf-8') as f:
        w = csv.DictWriter(f, fieldnames=cols)
        w.writeheader()
        for p in sorted(act, key=lambda p: int(p['id'])):
            cls = int(p['class']) if n(p['class']) else None
            rel, bp = CM.get(cls, ('UNMAPPED', None)) if cls else ('NO CLASS', None)
            par = int(p['parent']) if n(p['parent']) else None
            if par in BP:
                pe, rule = '', 'FILL: parent is the billing party; name the end client from the title'
            elif rel == 'Subcontract':
                pe, rule = par, 'subcontract class but parent is not a billing party; confirm parent as end client'
            elif rel in ('Direct', 'Referral'):
                pe, rule = (par if par else ''), ('FILL: no parent' if not par else rel.lower() + ': end client = parent')
            else:
                pe, rule = '', 'FILL: class unmapped or missing'
            links = opp_by_link.get(p['id'], [])
            lo = links[0] if links else None
            pj = p['jobtype']
            if not n(pj):
                if lo and lo['engagement_type_id'] in TYPE2JOB:
                    pj = TYPE2JOB[lo['engagement_type_id']]
                    src = 'from linked opportunity ' + lo['tranid'] + ' engagement type ' + str(lo['engagement_type'])
                else:
                    pj, src = 'FILL', 'no linked opportunity with a mapped engagement type'
            else:
                src = 'already set'
            key, note = pcmap.get(p['id'], (None, ''))
            pc = ''
            if key:
                pc = 'FILL: confirm identity' if key.startswith('confirm:') else 'pc_contact_af_' + slug(key)
            duid = du('opp' + lo['id']) if lo and int(lo['entitystatus']) in OPEN | LADDER else ''
            w.writerow({'id': p['id'], 'entityid': p['entityid'], 'companyname': p['companyname'],
                        'status_id': p['entitystatus'], 'status_name': p['status_name'], 'parent': par,
                        'parent_name': p['parent_name'], 'class_id': cls, 'class_name': p['class_name'],
                        'relationship': rel, 'current_jobtype': n(p['jobtype']), 'proposed_jobtype': pj,
                        'jobtype_source': src, 'current_end_client': n(p['end_client']), 'proposed_end_client': pe,
                        'end_client_rule': rule, 'current_partner_contact': n(p['partner_contact']),
                        'proposed_partner_contact_externalid': pc, 'af_contact_text': n(p['af_contact']),
                        'af_email_text': n(p['af_contact_email']), 'current_deal_uuid': n(p['deal_uuid']),
                        'proposed_deal_uuid': duid, 'linked_opportunity': lo['tranid'] if lo else '',
                        'mike_end_client_id': 'FILL' if pe == '' else '', 'note': note})
    print('after_projects rows', len(act), 'needing Mike end client',
          sum(1 for p in act if (int(p['parent']) if n(p['parent']) else None) in BP))
    print('untyped resolved:', [(p['id'], p['companyname'],
                                 (opp_by_link.get(p['id']) or [{'engagement_type': None}])[0]['engagement_type'])
                                for p in act if not n(p['jobtype'])])
    print('ladder opps with a custom link:', sum(1 for o in sel if int(o['entitystatus']) in LADDER and n(o['custom_link'])))


if __name__ == '__main__':
    main()
