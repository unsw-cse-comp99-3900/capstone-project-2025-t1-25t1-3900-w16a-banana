"""APIs for Chat system"""
from flask_restx import Resource
from flask import request

from utils.db import db
from utils.header import auth_header, tokenize
from utils.response import res_error
from db_model import Chat
from db_model.db_query import (
    get_user_by_token,
    get_user_by_type_and_id,
    get_chats_between_users,
    get_chats_by_user
)
from routes.chat.models import (
    api,
    message_res,
    send_message_req,
    chat_model, get_all_chat_res
)
from routes.chat.services import can_this_user_chat

@api.route('/get/all')
class GetAllChat(Resource):
    """Route: /get/all"""
    @api.expect(auth_header)
    @api.response(200, 'Success', get_all_chat_res)
    def get(self):
        """Get all user's chat log"""
        # Get Myself from Token
        me = get_user_by_token(tokenize(request.headers))
        if not me:
            return res_error(401)
        my_type = can_this_user_chat(me)

        # Check that the chat is supported for my type
        if not my_type:
            return res_error(400, 'Does not support chat')

        # Find all chats for me
        chat_groups = get_chats_by_user(
            user_type = my_type,
            user_id = me.id
        )

        chat_logs = {}
        for (other_type, other_id), chats in chat_groups.items():
            chat_logs[f'{other_type.name}_{other_id}'] = [chat.dict() for chat in chats]
        return chat_logs, 200

@api.route('/get/<string:user_type>/<int:user_id>')
@api.doc(params={
    'user_type': {
        'description': 'Type of the user to get chat logs with',
        'enum': ['customer', 'restaurant', 'driver'],
        'type': 'string'
    },
    'user_id': {'type': 'int' }
})
class GetChatWith(Resource):
    """Route: /get/<string:user_type>/<int:user_id>"""
    @api.expect(auth_header)
    @api.marshal_list_with(chat_model)
    def get(self, user_type: str, user_id: int):
        """Get the chat of myself with the given user"""
        # Get Myself from Token
        me = get_user_by_token(tokenize(request.headers))
        if not me:
            return res_error(401)
        my_type = can_this_user_chat(me)

        # Check that the chat is supported for my type
        if not my_type:
            return res_error(400, 'Does not support chat')

        # Get the other user
        other_user = get_user_by_type_and_id(user_type, user_id)
        if not other_user:
            return res_error(400, 'Given User Not Found')

        other_user_type = can_this_user_chat(other_user)
        if not other_user_type:
            return res_error(400, 'Does not support chat')

        # Get all chat messages between two
        chats = get_chats_between_users(
            user1_type = other_user_type,
            user1_id = other_user.id,
            user2_type = my_type,
            user2_id = me.id
        )

        return [chat.dict() for chat in chats], 200


@api.route('/send/<string:user_type>/<int:user_id>')
@api.doc(params={
    'user_type': {
        'description': 'Receiver of the message',
        'enum': ['customer', 'restaurant', 'driver'],
        'type': 'string'
    },
    'user_id': {'type': 'int' }
})
class SendChatFromCustomer(Resource):
    """Route: /send/<string:user_type>/<int:user_id>"""
    @api.expect(auth_header, send_message_req)
    @api.response(200, "Success")
    @api.response(400, "Bad Request", message_res)
    @api.response(401, "Unauthorised", message_res)
    def post(self, user_type: str, user_id: int):
        """
        Send Chat from customer to driver or restaurant.
        Sender type doesn't need to be specified.
        Supported message
        Driver <-> Restaurant
        Customer <-> Driver
        Customer <-> Restaurant
        """
        # Authenticate the sender
        me = get_user_by_token(tokenize(request.headers))
        if not me:
            return res_error(401)
        my_type = can_this_user_chat(me)

        # Check that the chat is supported for my type
        if not my_type:
            return res_error(400, 'Does not support chat')

        other_user = get_user_by_type_and_id(user_type, user_id)
        if not other_user:
            return res_error(400, 'Given User Not Found')

        other_user_type = can_this_user_chat(other_user)
        if not other_user_type:
            return res_error(400, 'Does not support chat')

        # Cannot send to same user type
        if my_type == other_user_type:
            return res_error(400, f'Cannot Send From {my_type.value} to {other_user_type.value}')

        # Make a chat
        new_chat = Chat(
            message = request.get_json()['message']
        )

        # Set sender and receiver
        # Set from_user info
        new_chat.from_id = me.id
        new_chat.from_type = my_type
        new_chat.to_id = other_user.id
        new_chat.to_type = other_user_type

        db.session.add(new_chat)
        db.session.commit()

        # return the new customer object
        return { 'message': 'Message Sent' }, 200
