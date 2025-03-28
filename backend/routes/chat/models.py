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
