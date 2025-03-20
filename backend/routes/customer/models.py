from flask_restx import Namespace, fields, reqparse
from werkzeug.datastructures import FileStorage

api = Namespace('customer', description='APIs for Customer')

"""Error Response"""
error_res= api.model("Error", {
    "message": fields.String(description="Error message", example="Error Description")
})

"""Response/Request for customer register"""
register_req = api.model('CustomerRegister', {
    'username': fields.String(required=True, description="Username", default="customer1"),
    'email': fields.String(required=True, description="Email", default="customer@gmail.com"),
    'password': fields.String(required=True, description="Password", default="SafePass12!@"),
    'phone': fields.String(required=True, description="Phone (04xxxxxxxx)", default="0444444444"),
    'address': fields.String(required=True, description="Address", default="11 Street"),
    'suburb': fields.String(required=True, description="Suburb", default="Kensington"),
    'state': fields.String(required=True, description="State (ACT, NSW, NT, QLD, SA, TAS, VIC, WA)", default="NSW"),
    'postcode': fields.String(required=True, description="Postcode (4 digits)", default="2000")
})

register_res = api.model("Admin Register Reponse", {
    "message": fields.String(description="Success Message", example="Success")
})

"""Response/Request parser for customer update profile"""
update_profile_req_parser = reqparse.RequestParser()
update_profile_req_parser.add_argument('username', type=str, required=False)
update_profile_req_parser.add_argument('email', type=str, required=False)
update_profile_req_parser.add_argument('password', type=str, required=False)
update_profile_req_parser.add_argument('phone', type=str, required=False)
update_profile_req_parser.add_argument('address', type=str, required=False)
update_profile_req_parser.add_argument('suburb', type=str, required=False)
update_profile_req_parser.add_argument('state', type=str, required=False)
update_profile_req_parser.add_argument('postcode', type=str, required=False)
update_profile_req_parser.add_argument("profile_image", type=FileStorage, location="files", required=False, help="Profile Image")