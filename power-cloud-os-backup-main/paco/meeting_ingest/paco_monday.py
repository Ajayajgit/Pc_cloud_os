"""Queue Monday's existing message through Paco without changing its audience."""
import argparse
import hashlib
import json
import sys
from pathlib import Path
from urllib.parse import urlsplit
from .paco import connect
from .filing import journal_lock


def queue(message,config,monday_config):
    endpoint=urlsplit(monday_config['google_chat_webhook'])
    if endpoint.scheme!='https' or endpoint.hostname!='chat.googleapis.com':
        raise ValueError('Unexpected Monday delivery endpoint')
    destination=endpoint.path.removeprefix('/v1/').split('/messages')[0]
    if not destination.startswith('spaces/') or '/' in destination[7:]:
        raise ValueError('Unexpected Monday space path')
    if not config.get('enable_monday_delivery') or config.get('monday_space')!=destination:
        raise ValueError('Paco Monday delivery is not enabled for the existing audience')
    if not isinstance(message,str) or not message.strip():raise ValueError('Empty Monday message')
    oid='client-monday-'+hashlib.sha256((destination+'\n'+message).encode()).hexdigest()[:40]
    with journal_lock(config['database']):
        db=connect(config['database'])
        try:
            with db:db.execute('INSERT OR IGNORE INTO paco_outbox(id,space,body) VALUES(?,?,?)',
                (oid,destination,json.dumps({'text':message})))
        finally:db.close()
    return oid


def main():
    p=argparse.ArgumentParser();p.add_argument('--config',required=True,type=Path)
    p.add_argument('--monday-config',required=True,type=Path)
    args=p.parse_args()
    message=json.load(sys.stdin)['text']
    queue(message,json.loads(args.config.read_text()),json.loads(args.monday_config.read_text()))
    print('Monday message durably queued for Paco')


if __name__=='__main__':main()
