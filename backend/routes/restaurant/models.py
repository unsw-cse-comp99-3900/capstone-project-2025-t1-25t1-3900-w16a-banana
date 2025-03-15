from flask_restx import Namespace, Resource, fields, reqparse
from werkzeug.datastructures import FileStorage

api = Namespace('restaurant', description='APIs for Restaurants')


"""Error Response"""
error_res= api.model("Error", {
    "message": fields.String(description="Error message", example="Error Description")
})

"""Response/Request for restaurant register"""
register_req_parser = reqparse.RequestParser()
register_req_parser.add_argument('email', type=str, required=True, default="example@domain.com", help="Email is required")
register_req_parser.add_argument('password', type=str, required=True, default="SecurePassword12!@", help="Password is required")
register_req_parser.add_argument('phone', type=str, required=True, default="0412345678", help="Phone (04xxxxxxxx)")
register_req_parser.add_argument('name', type=str, required=True, default="A Restaurant", help="Restaurant Name")
register_req_parser.add_argument('address', type=str, required=True, default="111 Street", help="Address")
register_req_parser.add_argument('suburb', type=str, required=True, default="State", help="Suburb")
register_req_parser.add_argument('state', type=str, required=True, default="NSW", help="State (ACT, NSW, NT, QLD, SA, TAS, VIC, WA)")
register_req_parser.add_argument('postcode', type=str, required=True, default="2000", help="Postcode (4 digits)")
register_req_parser.add_argument('abn', type=str, required=True, default="12345678901", help="ABN (11 digits)")
register_req_parser.add_argument('description', type=str, required=True, default="A good restaurant", help="Restaurant Description")
register_req_parser.add_argument("image1", type=FileStorage, location="files", required=True, help="First restaurant image")
register_req_parser.add_argument("image2", type=FileStorage, location="files", required=True, help="Second restaurant image")
register_req_parser.add_argument("image3", type=FileStorage, location="files", required=True, help="Third restaurant image")

register_res = api.model("Admin Register Reponse", {
    "message": fields.String(description="Success Message", example="Success")
})


"""
# for the update profile, we group the attributes into non-approval needed and approval needed
# the non-approval needed attributes can be updated without admin approval,
# and approval needed attributes (only for driver and restaurant) need admin approval.

# all customer attributes can be updated without admin approval

# for restaurant:
# non approval needed: email, password, phone, url_img1, url_img2, url_img3, description
# approval needed: name, address, suburb, state, postcode, abn
"""

"""Response/Request for restaurant update non approval"""
update_non_approval_req_parser = reqparse.RequestParser()
update_non_approval_req_parser.add_argument('email', type=str, required=True, help="Email is required")
update_non_approval_req_parser.add_argument('password', type=str, required=True, help="Password is required")
update_non_approval_req_parser.add_argument('phone', type=str, required=True, help="Phone number (04xxxxxxxx)")
update_non_approval_req_parser.add_argument('description', type=str, required=True, help="Restaurant description")
update_non_approval_req_parser.add_argument('image1', type=FileStorage, location='files', required=False, help="First image")
update_non_approval_req_parser.add_argument('image2', type=FileStorage, location='files', required=False, help="Second image")
update_non_approval_req_parser.add_argument('image3', type=FileStorage, location='files', required=False, help="Third image")

"""Response/Request for restaurant update approval"""
update_approval_req = api.model('RestaurantModel', {
    'name': fields.String(required=True, description='Name'),
    'address': fields.String(required=True, description='Address'),
    'suburb': fields.String(required=True, description='Suburb'),
    'state': fields.String(required=True, description='State'),
    'postcode': fields.String(required=True, description='Postcode (4 digits)'),
    'abn': fields.String(required=True, description='ABN (11 digits)')
})