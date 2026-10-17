"""Normalize Google's Chat and Workspace add-on events from our private queue.

Schema: https://developers.google.com/workspace/add-ons/concepts/event-objects
Identity always comes from the event actor, never card parameters or its sender.
"""


def normalize(event):
    if not isinstance(event, dict):
        return {}
    if 'chat' not in event:
        return event
    chat = event['chat']
    if not isinstance(chat, dict):
        return {}
    kinds = {'messagePayload': 'MESSAGE', 'addedToSpacePayload': 'ADDED_TO_SPACE',
             'buttonClickedPayload': 'CARD_CLICKED'}
    payloads = [key for key in chat if key.endswith('Payload')]
    if len(payloads) != 1 or payloads[0] not in kinds:
        return {}
    key = payloads[0]
    payload = chat[key]
    if not isinstance(payload, dict) or payload.get('isDialogEvent'):
        return {}
    actor = chat.get('user', {})
    space = payload.get('space') or chat.get('space', {})
    message = payload.get('message', {})
    if not all(isinstance(value, dict) for value in (actor, space, message)):
        return {}
    if chat.get('space') and chat['space'].get('name') != space.get('name'):
        return {}
    # spaceType supersedes the deprecated type field. Groups never become DMs.
    space = dict(space)
    if 'spaceType' in space:
        space['type'] = 'DM' if space['spaceType'] == 'DIRECT_MESSAGE' else 'ROOM'
    result = {'type': kinds[key], 'user': actor, 'space': space, 'message': message}
    if key == 'buttonClickedPayload':
        common = event.get('commonEventObject', {})
        if not isinstance(common, dict):
            return {}
        params = common.get('parameters', {})
        if not isinstance(params, dict) or params.get('paco_action') != 'meeting':
            return {}
        if not all(isinstance(params.get(k), str) and params[k] for k in ('meeting_id', 'command')):
            return {}
        result['action'] = {'actionMethodName': 'meeting', 'parameters': [
            {'key': k, 'value': params[k]} for k in ('meeting_id', 'command')]}
    return result
