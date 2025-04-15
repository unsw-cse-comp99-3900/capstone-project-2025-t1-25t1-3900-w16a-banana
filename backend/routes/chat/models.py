"""Flask-Restx Models for Chat APIs"""
from flask_restx import Namespace, fields

api = Namespace('chat', description='APIs for Chat Messages')

"""General Message Response"""
message_res= api.model('Message', {
    'message': fields.String(description='Descriptive message', example='Some Description')
})

"""Send Message Request"""
send_message_req = api.model('Send Message Request', {
    'message': fields.String(required=True, description='Message To Send', example='Hi')
})

chat_model = api.model('Chat Log Model', {
    'message_type': fields.String(
        description='sent/received', example='sent OR received'
    ),
    'message': fields.String(),
    'time': fields.String(example='YYYY-MM-DD HH:mm:SS')
})

chat_user_model = api.model('Chat Opposite User Model', {
    "role": fields.String(description='User Type', example='customer OR restaurant OR driver OR admin'),
    "id": fields.Integer(description='User ID', example=1),
    "url_profile_image": fields.String(description='Profile Image URL', example='https://example.com/image.jpg'),
})

get_all_chat_res = api.model('Get All Chat Log Model', {
    "user": fields.Nested(chat_user_model),
    "chats": fields.List(fields.Nested(chat_model)),
})

get_all_chats_from_all_users_res = fields.List(fields.Nested(get_all_chat_res))
