from flask_restx import Resource
from flask import request
import secrets

from utils.db import db
from utils.check import *
from utils.header import auth_header, tokenize
from utils.response import res_error
from db_model import *
from db_model.db_query import *
from routes.chat.models import *
from routes.chat.services import *

@api.route('/get/all')
class GetAllChat(Resource):
    @api.expect(auth_header)
    def get(self):
        me = get_user_by_token(tokenize(request.headers))
        if not me:
            return res_error(401)
        me_type = type(me).__name__.upper()

        chat_groups = get_chats_by_user(
            user_type = ChatSupportUserType(me_type),
            user_id = extract_id(me_type, me)
        )

        chat_logs = {}
        for (other_type, other_id), chats in chat_groups.items():
            chat_logs[f'{other_type.name}_{other_id}'] = [chat.dict() for chat in chats]
        
        return chat_logs, 200
    
@api.route('/get/<string:other_type>/<int:other_id>')
@api.doc(params={
    'other_type': {
        'description': 'Type of the user to get chat logs with',
        'enum': ['customer', 'restaurant', 'driver'],
        'type': 'string'
    },
    'other_id': {'type': 'int' }
})
class GetChatWith(Resource):
    @api.expect(auth_header)
    def get(self, other_type: str, other_id: int):
        """Get the chat of myself with the given user"""
        # Get myself
        me = get_user_by_token(tokenize(request.headers))
        if not me:
            return res_error(401)
        me_type = type(me).__name__.upper()

        # Get the other user
        other_type = other_type.upper()
        other_user = get_user_by_id(other_type, other_id)
        if not other_user:
            return res_error(400, 'Sender Not Found')
        
        # Get all chat messages between two
        chats = get_chats_between_users(
            user1_type = ChatSupportUserType(other_type),
            user1_id = extract_id(other_type, other_user),
            user2_type = ChatSupportUserType(me_type),
            user2_id = extract_id(me_type, me)
        )
        
        return {
            'chats': [chat.dict() for chat in chats]
        }, 200


@api.route('/send/<string:to_user_type>/<int:to_user_id>')
@api.doc(params={
    'to_user_type': {
        'description': 'Receiver of the message',
        'enum': ['customer', 'restaurant', 'driver'],
        'type': 'string'
    },
    'to_user_id': {'type': 'int' }
})
class SendChatFromCustomer(Resource):
    @api.expect(auth_header, send_message_req)
    @api.response(200, "Success")
    @api.response(400, "Bad Request", message_res)
    @api.response(401, "Unauthorised", message_res)
    def post(self, to_user_type: str, to_user_id: int):
        """
        Send Chat from customer to driver or restaurant.
        Sender type doesn't need to be specified.
        Supported message
        Driver <-> Restaurant
        Customer <-> Driver
        Customer <-> Restaurant
        """
        # Authenticate the sender
        from_user = get_user_by_token(tokenize(request.headers))
        if not from_user:
            return res_error(401)
        from_user_type = type(from_user).__name__.upper()
        
        
        # Check the receiver type.
        to_user_type = to_user_type.upper()
        if not is_valid_chat_user_type(to_user_type):
            return res_error(400, 'Invalid User Type')
        
        # Cannot send to same user type
        if from_user_type == to_user_type:
            return res_error(400, f'Cannot Send From {from_user_type} to {to_user_type}')

        # Find the to_user
        to_user = get_user_by_id(to_user_type, to_user_id)
        if not to_user:
            return res_error(404, 'Receiver Not Found')

        # Make a chat
        new_chat = Chat(
            message = request.get_json()['message']
        )

        # Set sender and receiver
        # Set from_user info
        if from_user_type == 'CUSTOMER':
            new_chat.from_id = from_user.customer_id
        elif from_user_type == 'DRIVER':
            new_chat.from_id = from_user.driver_id
        elif from_user_type == 'RESTAURANT':
            new_chat.from_id = from_user.restaurant_id

        # Set to_user info (only if not already set)
        if to_user_type == 'CUSTOMER':
            new_chat.to_id = to_user.customer_id
        elif to_user_type == 'DRIVER':
            new_chat.to_id = to_user.driver_id
        elif to_user_type == 'RESTAURANT':
            new_chat.to_id = to_user.restaurant_id
        
        new_chat.from_type = ChatSupportUserType(from_user_type)
        new_chat.to_type = ChatSupportUserType(to_user_type)

        db.session.add(new_chat)
        db.session.commit()

        # return the new customer object
        return { 'message': 'Message Sent' }, 200