#!/usr/bin/env python3
"""Build the CSV import files for the CRM migration (PLAN.md T6).

Reads the reviewed migration CSVs (contacts_af_recruiters.csv,
after_projects.csv, after_opportunities.csv, and later id_map.csv) and writes
NetSuite CSV-import-ready files plus an expected.json for the post-import check.
Nothing here talks to NetSuite.

Run order:
  1. python build_import_files.py contacts
       -> import/01_contacts.csv (13 new contacts)
  2. Mike imports 01_contacts.csv, then writes id_map.csv (externalid,
     internalid) from a SuiteQL query on the new contacts.
  3. python build_import_files.py records
       -> import/02_projects.csv, import/03_opportunities.csv,
          import/expected.json

Options: --dir PATH overrides the migration folder (default: this script's
folder). Outputs go to <dir>/import/. Exit code 1 lists every validation
failure found.
"""
import argparse
import csv
import json
import os
import re
import sys

# keyed (companyname, id as found) -> correct project internal id; the id cell was overwritten while the FILL columns were filled on 2026-10-12, before_projects.csv and git history show 282
ID_FIXES = {('PC Internal Hours', '834'): '282'}
# tranid -> reason; opportunities left out of the migration
EXCLUDED_OPPS = {'OPP0177': 'Closed Lost on 2026-10-12, out of migration scope'}
# NetSuite internal id of the subsidiary assigned to every new contact
SUBSIDIARY_ID = '1'
# class_id -> billing party customer id; active Subcontract rows of customrecord_pc_channel_map, read 2026-10-15; every other class resolves to no billing party
CHANNEL_BILLING_PARTY = {'5': '136', '6': '198', '110': '514'}

EXPECTED_NEW_CONTACTS = 13
EXPECTED_CONTACT_MAP = 14
EXPECTED_OPPS = 36
EXPECTED_PROJECTS = 47
EXPECTED_STATUS_VALUES = 13
KICKOFF_STATUS = {'YES': '23', 'NO': '25'}
UUID4 = re.compile(r'^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$')

CONTACT_HEADER = ['External ID', 'First Name', 'Last Name', 'Email', 'Company',
                  'Subsidiary', 'Job Title', 'Contact Role']
PROJECT_HEADER = ['Internal ID', 'Name', 'Project Type', 'End Client',
                  'Partner Contact', 'Deal UUID']
OPP_HEADER = ['Internal ID', 'Number', 'End Client', 'Deal UUID',
              'Partner Contact', 'Status']


def read_csv(path):
    with open(path, encoding='utf-8-sig', newline='') as fh:
        return list(csv.DictReader(fh))


def write_csv(path, header, rows):
    with open(path, 'w', encoding='utf-8', newline='') as fh:
        w = csv.writer(fh)
        w.writerow(header)
        w.writerows(rows)


def is_digits(v):
    return bool(v) and v.isdigit()


def summarize(label, header, rows):
    print(f'{label}: {len(rows)} rows')
    for i, col in enumerate(header):
        print(f'  {col}: {sum(1 for r in rows if r[i] != "")} non-empty')


def finish(errors):
    if errors:
        print(f'FAILED with {len(errors)} validation error(s):', file=sys.stderr)
        for e in errors:
            print(f'  - {e}', file=sys.stderr)
        sys.exit(1)


def build_contacts(d, out):
    errors = []
    src = [r for r in read_csv(os.path.join(d, 'contacts_af_recruiters.csv'))
           if not r['existing_contact_id'].strip()]
    if len(src) != EXPECTED_NEW_CONTACTS:
        errors.append(f'expected {EXPECTED_NEW_CONTACTS} contacts without existing_contact_id, found {len(src)}')
    seen = set()
    for r in src:
        ext = r['externalid']
        if not ext.startswith('pc_contact_af_'):
            errors.append(f'{ext}: externalid must start with pc_contact_af_')
        if ext in seen:
            errors.append(f'{ext}: duplicate externalid')
        seen.add(ext)
        if '@' not in r['email']:
            errors.append(f'{ext}: email has no @ ({r["email"]!r})')
        if not is_digits(r['contactrole']):
            errors.append(f'{ext}: contactrole not digits ({r["contactrole"]!r})')
        if not is_digits(r['company_id']):
            errors.append(f'{ext}: company_id not digits ({r["company_id"]!r})')
    finish(errors)
    rows = [[r['externalid'], r['firstname'], r['lastname'], r['email'],
             r['company_id'], SUBSIDIARY_ID, r['title'], r['contactrole']] for r in src]
    write_csv(os.path.join(out, '01_contacts.csv'), CONTACT_HEADER, rows)
    summarize('01_contacts.csv', CONTACT_HEADER, rows)


def build_contact_map(d, errors):
    """externalid -> contact internal id: id_map.csv plus pre-existing contacts."""
    cmap = {}
    for r in read_csv(os.path.join(d, 'id_map.csv')):
        cmap[r['externalid'].strip()] = r['internalid'].strip()
    for r in read_csv(os.path.join(d, 'contacts_af_recruiters.csv')):
        if r['existing_contact_id'].strip():
            cmap[r['externalid'].strip()] = r['existing_contact_id'].strip()
    all_ext = [r['externalid'].strip() for r in read_csv(os.path.join(d, 'contacts_af_recruiters.csv'))]
    if len(all_ext) != EXPECTED_CONTACT_MAP:
        errors.append(f'expected {EXPECTED_CONTACT_MAP} contact externalids, found {len(all_ext)}')
    for ext in all_ext:
        if ext not in cmap:
            errors.append(f'contact map is missing {ext}')
        elif not cmap[ext].isdigit():
            errors.append(f'contact map has non-digit id for {ext}: {cmap[ext]!r}')
    return cmap


def lookup_contact(cmap, ext, where, errors):
    ext = ext.strip()
    if not ext:
        return ''
    if ext not in cmap:
        errors.append(f'{where}: partner contact {ext} not in contact map')
        return ''
    return cmap[ext]


def apply_id_fixes(projects, errors):
    for (name, found), fixed in ID_FIXES.items():
        hits = [p for p in projects if p['companyname'] == name and p['id'] == found]
        if len(hits) != 1:
            errors.append(f'ID_FIXES key ({name!r}, {found!r}) matched {len(hits)} rows, expected 1')
            continue
        hits[0]['id'] = fixed


def build_records(d, out):
    errors = []
    cmap = build_contact_map(d, errors)

    opps = [o for o in read_csv(os.path.join(d, 'after_opportunities.csv'))
            if o['tranid'] not in EXCLUDED_OPPS]
    if len(opps) != EXPECTED_OPPS:
        errors.append(f'expected {EXPECTED_OPPS} in-scope opportunities, found {len(opps)}')
    opp_by_tran = {o['tranid']: o for o in opps}

    projects = read_csv(os.path.join(d, 'after_projects.csv'))
    apply_id_fixes(projects, errors)
    if len(projects) != EXPECTED_PROJECTS:
        errors.append(f'expected {EXPECTED_PROJECTS} projects, found {len(projects)}')

    # projects
    proj_rows, proj_ids = [], set()
    for p in projects:
        pid, name = p['id'], p['companyname']
        if pid in proj_ids:
            errors.append(f'project {pid} ({name}): duplicate Internal ID')
        proj_ids.add(pid)
        if not is_digits(p['proposed_jobtype']):
            errors.append(f'project {pid} ({name}): Project Type not digits ({p["proposed_jobtype"]!r})')
        if not is_digits(p['mike_end_client_id']):
            errors.append(f'project {pid} ({name}): End Client not digits ({p["mike_end_client_id"]!r})')
        lo = p['linked_opportunity'].strip()
        if lo in opp_by_tran:
            if p['proposed_deal_uuid'] != opp_by_tran[lo]['proposed_deal_uuid']:
                errors.append(f'project {pid} ({name}): deal uuid differs from {lo}')
        elif lo and p['proposed_deal_uuid']:
            errors.append(f'project {pid} ({name}): linked to out-of-scope {lo} but has a Deal UUID')
        proj_rows.append([pid, name, p['proposed_jobtype'], p['mike_end_client_id'],
                          lookup_contact(cmap, p['proposed_partner_contact_externalid'], f'project {pid}', errors),
                          p['proposed_deal_uuid']])
    main_count = len(proj_rows)
    uuid_only = []
    for o in opps:
        link = o['custom_link'].strip()
        if link and link not in proj_ids:
            proj_ids.add(link)
            uuid_only.append(link)
            proj_rows.append([link, 'UUID only, linked to ' + o['tranid'], '', '', '',
                              o['proposed_deal_uuid']])

    # opportunities
    opp_rows, seen_uuid = [], set()
    for o in opps:
        oid, tran = o['id'], o['tranid']
        ec = o['mike_end_client_id'].strip() or o['proposed_end_client'].strip()
        if not is_digits(ec):
            errors.append(f'opportunity {tran}: End Client not digits ({ec!r})')
        uuid = o['proposed_deal_uuid']
        if not UUID4.match(uuid):
            errors.append(f'opportunity {tran}: Deal UUID not canonical lowercase uuid4 ({uuid!r})')
        if uuid in seen_uuid:
            errors.append(f'opportunity {tran}: duplicate Deal UUID {uuid}')
        seen_uuid.add(uuid)
        kick = o['mike_kicked_off_yes_no'].strip().upper()
        if kick == '':
            status = ''
        elif kick in KICKOFF_STATUS:
            status = KICKOFF_STATUS[kick]
        else:
            errors.append(f'opportunity {tran}: unexpected kicked off value {o["mike_kicked_off_yes_no"]!r}')
            status = ''
        if status and o['status_id'] != '24':
            errors.append(f'opportunity {tran}: has Status but status_id is {o["status_id"]!r}, expected 24')
        opp_rows.append([oid, tran, ec, uuid,
                         lookup_contact(cmap, o['proposed_partner_contact_externalid'], f'opportunity {tran}', errors),
                         status])
    n_status = sum(1 for r in opp_rows if r[5])
    if n_status != EXPECTED_STATUS_VALUES:
        errors.append(f'expected {EXPECTED_STATUS_VALUES} Status values, found {n_status}')

    finish(errors)

    write_csv(os.path.join(out, '02_projects.csv'), PROJECT_HEADER, proj_rows)
    write_csv(os.path.join(out, '03_opportunities.csv'), OPP_HEADER, opp_rows)

    expected = {
        'contacts_created': EXPECTED_NEW_CONTACTS,
        'projects_rows': len(proj_rows),
        'projects_main': main_count,
        'projects_uuid_only': uuid_only,
        'projects_with_partner_contact': sum(1 for r in proj_rows if r[4]),
        'projects_with_deal_uuid': sum(1 for r in proj_rows if r[5]),
        'projects_jobtype': {r[0]: r[2] for r in proj_rows if r[2]},
        'projects_end_client': {r[0]: r[3] for r in proj_rows if r[3]},
        'projects_partner_contact': {r[0]: r[4] for r in proj_rows if r[4]},
        'projects_deal_uuid': {r[0]: r[5] for r in proj_rows if r[5]},
        'opps_rows': len(opp_rows),
        'opps_end_client': {r[0]: r[2] for r in opp_rows},
        'opps_deal_uuid': {r[0]: r[3] for r in opp_rows},
        'opps_partner_contact': {r[0]: r[4] for r in opp_rows if r[4]},
        'opps_status': {r[0]: r[5] for r in opp_rows if r[5]},
        'opps_billing_party': {o['id']: CHANNEL_BILLING_PARTY.get(o['class_id']) or None for o in opps},
        'excluded_opps': EXCLUDED_OPPS,
        'id_fixes': [{'companyname': k[0], 'found': k[1], 'fixed': v} for k, v in ID_FIXES.items()],
    }
    with open(os.path.join(out, 'expected.json'), 'w', encoding='utf-8', newline='') as fh:
        json.dump(expected, fh, indent=2)
        fh.write('\n')

    summarize('02_projects.csv', PROJECT_HEADER, proj_rows)
    summarize('03_opportunities.csv', OPP_HEADER, opp_rows)
    print(f'expected.json: {len(expected)} keys, {len(uuid_only)} uuid-only project rows')


def main():
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    ap.add_argument('stage', choices=['contacts', 'records'])
    ap.add_argument('--dir', default=os.path.dirname(os.path.abspath(__file__)),
                    help='migration folder (default: this script\'s folder)')
    args = ap.parse_args()
    out = os.path.join(args.dir, 'import')
    os.makedirs(out, exist_ok=True)
    if args.stage == 'contacts':
        build_contacts(args.dir, out)
    else:
        build_records(args.dir, out)


if __name__ == '__main__':
    main()
