"""Flask-Restx models for Admin APIs"""
from flask_restx import Namespace, fields, reqparse
from werkzeug.datastructures import FileStorage

api = Namespace('admin', description='APIs for Adminstrators')

"""Message Response"""
message_res= api.model("Error", {
    "message": fields.String(description="Some Message", example="Some Message")
})

"""Request for admin register"""
register_req = api.model("Admin Register Request", {
    'email': fields.String(required=True, description='Email', default="admin@gmail.com"),
    'password': fields.String(required=True, description='Password', default="StrongPass12!@"),
    'first_name': fields.String(required=True, description='First Name', default="John"),
    'last_name': fields.String(required=True, description="Last Name", default="Doe")
})

"""Response for admin register"""
register_res = api.model("Admin Register Reponse", {
    "message": fields.String(description="Success Message", example="Success")
})

"""Admin update profile, can update first_name, last_name, email, password, profile image"""
update_req_parser = reqparse.RequestParser()
update_req_parser.add_argument('email', type=str, required=False, help="Email is required")
update_req_parser.add_argument('password', type=str, required=False, help="Password is required")
update_req_parser.add_argument('first_name', type=str, required=False, help="First Name")
update_req_parser.add_argument('last_name', type=str, required=False, help="Last Name")
update_req_parser.add_argument(
    'profile_image', type=FileStorage, location='files', 
    required=False, help="Profile Image"
)
