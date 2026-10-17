"""One bounded Pub/Sub pull and durable Chat outbox flush; systemd invokes it."""
import argparse
import base64
import json
import re
from pathlib import Path
from .paco import connect,handle
from .filing import journal_lock
from .paco_prep import deliverable as prep_deliverable


def monday_destination_allowed(config, space):
    routes = config.get('monday_routes')
    destinations = list(routes.values()) if isinstance(routes, dict) else [config.get('monday_space')]
    return config.get('enable_monday_delivery') is True and space in destinations


def board_delivery_enabled(config):
    """Board rows carry no destination gate here on purpose.

    The audience check that matters runs in paco_board immediately before queueing: every person
    in the space must be verified internal staff. A static allowlist could not see a client being
    added to an approved space afterwards, so it was removed rather than kept as reassurance.
    Paco also has to be a member of the space to post at all, which is the human gate.
    """
    return config.get('enable_board_delivery') is True


def is_board_post(outbox_id):
    return outbox_id.startswith('client-board-') and not outbox_id.startswith('client-board-admin-')


def message_params(message_id, body):
    params={'messageId':message_id}
    if body.get('thread',{}).get('name'):
        params['messageReplyOption']='REPLY_MESSAGE_FALLBACK_TO_NEW_THREAD'
    return params


def delivery_body(body, topic):
    """Add-on Pub/Sub actions name the transport topic, not a code function."""
    result=json.loads(json.dumps(body))
    def visit(value):
        if isinstance(value,dict):
            action=value.get('action')
            if isinstance(action,dict) and action.get('function')=='meeting':
                if not isinstance(topic,str) or not re.fullmatch(r'projects/[^/]+/topics/[^/]+',topic):
                    raise ValueError('Explicit interaction topic required for card delivery')
                action['function']=topic
                # Show native feedback while Google submits the button action.
                # This is submission feedback, not a claim that filing finished.
                action['loadIndicator']='SPINNER'
            for child in value.values():visit(child)
        elif isinstance(value,list):
            for child in value:visit(child)
    visit(result)
    return result


def run(config):
    from google.oauth2 import service_account
    from google.auth.transport.requests import AuthorizedSession
    if config.get('enable_monday_ingress') is True and not config.get('separate_monday_ingress'):
        from .paco_notifications import run as receive_notifications
        receive_notifications(config)
    creds=service_account.Credentials.from_service_account_file(config['chat_key_path'])
    pub=AuthorizedSession(creds.with_scopes(['https://www.googleapis.com/auth/pubsub']))
    chat=AuthorizedSession(creds.with_scopes(['https://www.googleapis.com/auth/chat.bot']))
    index=json.loads(Path(config['index_path']).read_text())
    # Waiting for Google must not hold the filing/card-update lock.
    url='https://pubsub.googleapis.com/v1/'+config['subscription']
    response=pub.post(url+':pull',json={'maxMessages':20},timeout=40)
    response.raise_for_status()
    with journal_lock(config['database']):
        db=connect(config['database'])
        try:
            for item in response.json().get('receivedMessages',[]):
                message=item['message']
                event=json.loads(base64.b64decode(message['data'],validate=True))
                handle(db,message['messageId'],event,index,config['allowed_users'],
                       filing_enabled=config.get('enable_confirmed_filing') is True)
                flush_card_updates(db,chat,config['allowed_users'])
                # State and outbox are committed before acknowledgement.
                ack=pub.post(url+':acknowledge',json={'ackIds':[item['ackId']]},timeout=30)
                ack.raise_for_status()
            def deliver(row):
                body=delivery_body(json.loads(row['body']),config.get('interaction_topic'))
                response=chat.post('https://chat.googleapis.com/v1/'+row['space']+'/messages',
                    params=message_params(row['id'],body),json=body,timeout=30)
                # Custom message ID makes unknown-response retries duplicate safe.
                if response.status_code==409:
                    existing=chat.get('https://chat.googleapis.com/v1/'+row['space']+'/messages/'+row['id'],timeout=30)
                    existing.raise_for_status()
                    if existing.json().get('text')!=body.get('text'):raise ValueError('Chat outbox collision')
                    sent=existing.json()
                else:
                    response.raise_for_status()
                    sent=response.json()
                with db:
                    if row['id'].startswith('client-review-'):
                        thread=sent.get('thread',{}).get('name')
                        if not thread:raise ValueError('Review response has no thread')
                        db.execute('UPDATE paco_meetings SET thread=? WHERE id=?',(thread,row['id'][14:]))
                    db.execute('UPDATE paco_outbox SET sent=1 WHERE id=?',(row['id'],))

            for row in db.execute('SELECT * FROM paco_outbox WHERE sent=0').fetchall():
                if row['id'].startswith('client-monday-'):
                    if not monday_destination_allowed(config, row['space']):
                        raise ValueError('Monday outbox destination is not enabled')
                elif is_board_post(row['id']):
                    if not board_delivery_enabled(config):
                        continue
                    # A board post that cannot be delivered, because Paco was removed from the space
                    # or the space is gone, must never stall meeting filing or the Monday dashboard.
                    # It stays unsent and the next weekly run reports it.
                    try:
                        deliver(row)
                    except Exception:  # noqa: BLE001
                        continue
                    continue
                elif row['id'].startswith('client-prep-'):
                    # Only the producing KB's owner, re-checked now; drift quarantines, never redirects.
                    if config.get('enable_prep_delivery') is not True or not prep_deliverable(db,config,row):
                        continue
                    try:
                        deliver(row)
                    except Exception:  # noqa: BLE001
                        continue
                    continue
                else:
                    user=db.execute('SELECT email FROM paco_users WHERE space=?',(row['space'],)).fetchone()
                    if not user or user['email'] not in config['allowed_users']:
                        raise ValueError('Private outbox destination is not an allowlisted DM')
                deliver(row)
            flush_card_updates(db,chat,config['allowed_users'])
        finally:db.close()


def flush_card_updates(db,chat,allowed_users):
    """Retryable edits make terminal decisions visible on the original card."""
    for row in db.execute('SELECT * FROM paco_card_updates WHERE sent=0').fetchall():
        user=db.execute('SELECT email FROM paco_users WHERE space=?',(row['space'],)).fetchone()
        if not user or user['email'] not in allowed_users:
            raise ValueError('Card update destination is not an allowlisted DM')
        response=chat.patch('https://chat.googleapis.com/v1/'+row['space']+'/messages/'+row['message_id'],
                            params={'updateMask':'text,cardsV2'},json=json.loads(row['body']),timeout=30)
        response.raise_for_status()
        with db:db.execute('UPDATE paco_card_updates SET sent=1 WHERE id=?',(row['id'],))


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--config',required=True,type=Path)
    args=parser.parse_args()
    run(json.loads(args.config.read_text()))


if __name__=='__main__':main()
