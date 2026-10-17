"""Untrusted Monday notification ingress, separate from trusted Chat interactions."""
import argparse
import base64
import hashlib
import json
import re
from pathlib import Path
from .paco import connect
from .filing import journal_lock


def ingest(db, payload, routes):
    if not isinstance(payload, dict) or set(payload) != {'version', 'id', 'channel', 'text'}:
        raise ValueError('Unexpected notification fields')
    if type(payload['version']) is not int or payload['version'] != 1:
        raise ValueError('Unsupported notification version')
    if not isinstance(payload['id'], str) or not re.fullmatch(r'[A-Za-z0-9_.:-]{1,160}', payload['id']):
        raise ValueError('Invalid notification ID')
    channel = payload['channel']
    if channel not in ('test', 'live'):
        raise ValueError('Invalid channel')
    text = payload['text']
    if not isinstance(text, str) or not text.strip() or len(text.encode('utf-8')) > 30000:
        raise ValueError('Invalid notification text')
    destination = routes.get(channel)
    if not isinstance(destination, str) or not re.fullmatch(r'spaces/[A-Za-z0-9_-]+', destination):
        raise ValueError('Channel is not enabled')
    # Producer IDs identify a logical run; changed content for that run is a conflict.
    oid = 'client-monday-' + hashlib.sha256((channel + ':' + payload['id']).encode()).hexdigest()[:40]
    body = json.dumps({'text': text})
    with db:
        existing = db.execute('SELECT space,body FROM paco_outbox WHERE id=?', (oid,)).fetchone()
        if existing and (existing['space'] != destination or existing['body'] != body):
            raise ValueError('Conflicting notification replay')
        db.execute('INSERT OR IGNORE INTO paco_outbox(id,space,body) VALUES(?,?,?)', (oid, destination, body))
    return oid


def run(config):
    from google.oauth2 import service_account
    from google.auth.transport.requests import AuthorizedSession
    subscription = config['monday_subscription']
    if subscription != 'projects/powerprojects/subscriptions/paco-monday-notifications-sub':
        raise ValueError('Unexpected notification subscription')
    if config.get('enable_monday_ingress') is not True:
        raise ValueError('Monday ingress is disabled')
    session = AuthorizedSession(service_account.Credentials.from_service_account_file(
        config['chat_key_path'], scopes=['https://www.googleapis.com/auth/pubsub']))
    endpoint = 'https://pubsub.googleapis.com/v1/' + subscription
    response = session.post(endpoint + ':pull', json={'maxMessages': 20}, timeout=30)
    response.raise_for_status()
    with journal_lock(config['database']):
        db = connect(config['database'])
        db.execute('CREATE TABLE IF NOT EXISTS paco_notification_rejections (id TEXT PRIMARY KEY, reason TEXT NOT NULL)')
        try:
            for item in response.json().get('receivedMessages', []):
                message = item['message']
                try:
                    raw = base64.b64decode(message.get('data', ''), validate=True)
                    if len(raw) > 50000:
                        raise ValueError('Oversize notification')
                    ingest(db, json.loads(raw), config.get('monday_routes', {}))
                except (ValueError, TypeError, KeyError) as error:
                    # Preserve a non-sensitive rejection record before acknowledging poison data.
                    with db:
                        db.execute('INSERT OR IGNORE INTO paco_notification_rejections VALUES(?,?)',
                                   (message['messageId'], type(error).__name__))
                ack = session.post(endpoint + ':acknowledge', json={'ackIds': [item['ackId']]}, timeout=30)
                ack.raise_for_status()
        finally:
            db.close()


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--config', type=Path, required=True)
    run(json.loads(parser.parse_args().config.read_text()))
