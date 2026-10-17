"""Separate phase-two command. Default is local preview; never enabled by a timer."""
import argparse
import json
from pathlib import Path
from .filing import prepare,save_preview,execute,verify_plan
from .google_read import GoogleReader,delegated_session


def main():
    p=argparse.ArgumentParser(description='Prepare a flat-source preview, or apply an explicitly approved immutable plan')
    mode=p.add_mutually_exclusive_group(required=True)
    mode.add_argument('--preview-request',type=Path,help='JSON with owner, event and existing root client record')
    mode.add_argument('--apply-plan',type=Path)
    p.add_argument('--config',type=Path,required=True)
    p.add_argument('--output-dir',type=Path)
    p.add_argument('--journal',type=Path)
    p.add_argument('--approved-sha256')
    p.add_argument('--enable-drive-writes',action='store_true')
    a=p.parse_args()
    config=json.loads(a.config.read_text(encoding='utf-8-sig'))
    if a.preview_request:
        if not a.output_dir or a.enable_drive_writes:
            p.error('Preview requires local --output-dir and cannot enable Drive writes')
        output=a.output_dir.resolve()
        if output.drive.upper()=='G:' or str(output).startswith('\\\\'):
            p.error('Preview must be local, not on a shared/network drive')
        request=json.loads(a.preview_request.read_text(encoding='utf-8-sig'))
        session=delegated_session(config['key_path'],request['owner'],config['allowed_owners'])
        plan=prepare(GoogleReader(session),request['event'],request['client'],request['owner'])
        save_preview(plan,output)
        print('Preview saved. No Drive writes. Approval digest:',plan['sha256'])
        return
    plan=json.loads(a.apply_plan.read_text(encoding='utf-8-sig'))
    verify_plan(plan,a.approved_sha256)
    if not a.enable_drive_writes or config.get('enable_drive_writes') is not True or not a.journal:
        p.error('Apply requires explicit CLI and config write gates, exact approved digest and a separate journal')
    if plan['owner'] not in config['allowed_owners']:
        p.error('Owner is not explicitly allowlisted')
    from google.oauth2 import service_account
    from google.auth.transport.requests import AuthorizedSession
    from .google_write import GoogleWriter
    credentials=service_account.Credentials.from_service_account_file(config['key_path'],scopes=['https://www.googleapis.com/auth/drive']).with_subject(plan['owner'])
    writer=GoogleWriter(AuthorizedSession(credentials),plan['owner'],enabled=True)
    print(json.dumps(execute(plan,writer,a.journal,a.approved_sha256)))


if __name__=='__main__':
    main()
