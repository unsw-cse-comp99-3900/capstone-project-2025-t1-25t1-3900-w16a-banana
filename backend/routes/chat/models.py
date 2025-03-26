from flask_restx import Namespace, fields, reqparse
from werkzeug.datastructures import FileStorage

api = Namespace('chat', description='APIs for Chat Messages')

"""Error Response"""
message_res= api.model('Description', {
    "message": fields.String(description="Descriptive message", example="Some Description")
})

"""Send Message Request"""
send_message_req = api.model('Send Message Request', {
    "message": fields.String(required=True, description="Message To Send", example="Hi")
})



