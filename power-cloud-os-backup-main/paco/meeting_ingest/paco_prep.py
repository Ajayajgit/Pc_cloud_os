"""Sealed pre-meeting prep DM ingress: a KB may only message its own owner."""
import argparse
import base64
import hashlib
import json
import re
from datetime import datetime, timezone
from pathlib import Path
from .paco import connect
from .filing import journal_lock

TENANT = r'[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}'


def ensure_tables(db):
    db.executescript('''
      CREATE TABLE IF NOT EXISTS paco_prep_rows (id TEXT PRIMARY KEY, tenant TEXT NOT NULL, email TEXT NOT NULL,
        space TEXT NOT NULL, expires TEXT NOT NULL, quarantined INTEGER NOT NULL DEFAULT 0);
      CREATE TABLE IF NOT EXISTS paco_prep_rejections (id TEXT PRIMARY KEY, reason TEXT NOT NULL);
    ''')


def parse_expires(value):
    if not isinstance(value, str) or not re.fullmatch(r'\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ', value):
        raise ValueError('Invalid prep expiry')
    return datetime.strptime(value, '%Y-%m-%dT%H:%M:%SZ').replace(tzinfo=timezone.utc)


def ingest(db, payload, routes, allowed_users, now=None):
    if not isinstance(payload, dict) or set(payload) != {'version', 'id', 'tenant', 'expires', 'text'}:
        raise ValueError('Unexpected prep fields')
    if type(payload['version']) is not int or payload['version'] != 1:
        raise ValueError('Unsupported prep version')
    if not isinstance(payload['id'], str) or not re.fullmatch(r'[A-Za-z0-9_.:-]{1,160}', payload['id']):
        raise ValueError('Invalid prep ID')
    tenant = payload['tenant']
    if not isinstance(tenant, str) or not re.fullmatch(TENANT, tenant):
        raise ValueError('Invalid prep tenant')
    expires = payload['expires']
    if parse_expires(expires) <= (now or datetime.now(timezone.utc)):
        raise ValueError('Expired prep')
    text = payload['text']
    if not isinstance(text, str) or not text.strip() or len(text) > 4000:
        raise ValueError('Invalid prep text')
    # The audience is the tenant's configured owner; the payload never names a recipient.
    email = routes.get(tenant) if isinstance(routes, dict) else None
    if not isinstance(email, str) or email not in allowed_users:
        raise ValueError('Tenant is not routed')
    ensure_tables(db)
    user = db.execute('SELECT space FROM paco_users WHERE email=?', (email,)).fetchone()
    if not user or not re.fullmatch(r'spaces/[A-Za-z0-9_-]+', user['space']):
        raise ValueError('Owner has no verified DM')
    space = user['space']
    oid = 'client-prep-' + hashlib.sha256((tenant + ':' + payload['id']).encode()).hexdigest()[:40]
    body = json.dumps({'text': text})
    with db:
        existing = db.execute('SELECT space,body FROM paco_outbox WHERE id=?', (oid,)).fetchone()
        if existing and (existing['space'] != space or existing['body'] != body):
            raise ValueError('Conflicting prep replay')
        row = db.execute('SELECT email,space,expires FROM paco_prep_rows WHERE id=?', (oid,)).fetchone()
        if row and tuple(row) != (email, space, expires):
            raise ValueError('Conflicting prep replay')
        db.execute('INSERT OR IGNORE INTO paco_outbox(id,space,body) VALUES(?,?,?)', (oid, space, body))
        db.execute('INSERT OR IGNORE INTO paco_prep_rows(id,tenant,email,space,expires) VALUES(?,?,?,?,?)',
                   (oid, tenant, email, space, expires))
    return oid


def deliverable(db, config, row, now=None):
    """Re-check the audience immediately before sending; any drift quarantines, never redirects."""
    try:
        ensure_tables(db)
        prep = db.execute('SELECT * FROM paco_prep_rows WHERE id=?', (row['id'],)).fetchone()
        if not prep:
            return False
        routes = config.get('prep_routes')
        user = db.execute('SELECT space FROM paco_users WHERE email=?', (prep['email'],)).fetchone()
        ok = (not prep['quarantined'] and (now or datetime.now(timezone.utc)) < parse_expires(prep['expires'])
              and isinstance(routes, dict) and routes.get(prep['tenant']) == prep['email']
              and prep['email'] in config.get('allowed_users', []) and prep['space'] == row['space']
              and user is not None and user['space'] == row['space'])
        if not ok:
            with db:
                db.execute('UPDATE paco_prep_rows SET quarantined=1 WHERE id=?', (row['id'],))
        return ok
    except Exception:  # noqa: BLE001
        return False


def run(config):
    from google.oauth2 import service_account
    from google.auth.transport.requests import AuthorizedSession
    if config.get('enable_prep_ingress') is not True:
        raise ValueError('Prep ingress is disabled')
    subscription = config.get('prep_subscription')
    if not isinstance(subscription, str) or not re.fullmatch(r'projects/[^/]+/subscriptions/[^/]+', subscription):
        raise ValueError('Unexpected prep subscription')
    session = AuthorizedSession(service_account.Credentials.from_service_account_file(
        config['chat_key_path'], scopes=['https://www.googleapis.com/auth/pubsub']))
    endpoint = 'https://pubsub.googleapis.com/v1/' + subscription
    response = session.post(endpoint + ':pull', json={'maxMessages': 20}, timeout=30)
    response.raise_for_status()
    with journal_lock(config['database']):
        db = connect(config['database'])
        ensure_tables(db)
        try:
            for item in response.json().get('receivedMessages', []):
                message = item['message']
                try:
                    raw = base64.b64decode(message.get('data', ''), validate=True)
                    if len(raw) > 50000:
                        raise ValueError('Oversize prep message')
                    ingest(db, json.loads(raw), config.get('prep_routes', {}), config.get('allowed_users', []))
                except (ValueError, TypeError, KeyError) as error:
                    with db:
                        db.execute('INSERT OR IGNORE INTO paco_prep_rejections VALUES(?,?)',
                                   (message['messageId'], type(error).__name__))
                ack = session.post(endpoint + ':acknowledge', json={'ackIds': [item['ackId']]}, timeout=30)
                ack.raise_for_status()
        finally:
            db.close()


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--config', type=Path, required=True)
    run(json.loads(parser.parse_args().config.read_text()))
