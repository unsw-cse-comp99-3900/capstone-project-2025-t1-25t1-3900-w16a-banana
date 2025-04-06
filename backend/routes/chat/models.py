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
    'id': fields.Integer(),
    'from_type': fields.String(),
    'to_type': fields.String(),
    'from_id': fields.Integer(),
    'to_id': fields.Integer(),
    'message': fields.String(),
    'time': fields.String(example='YYYY-MM-DD HH:mm:SS')
})

get_all_chat_res = api.model('Get All Chat Log Model', {
    'UserType_UserID': fields.List(fields.Nested(chat_model))
})
