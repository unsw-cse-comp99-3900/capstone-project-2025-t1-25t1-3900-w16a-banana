from flask_restx import Namespace, fields, reqparse
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

# for restaurant:
# non approval needed: email, password, phone, url_img1, url_img2, url_img3, description
# approval needed: name, address, suburb, state, postcode, abn

# The request parse for the non-approval and approval needed attributes are grouped together. 
# The backend route will determine whether to turn the registration status to PENDING or not. 
"""

update_req_parser = reqparse.RequestParser()
update_req_parser.add_argument('name', type=str, required=False, help="Name is required")
update_req_parser.add_argument('email', type=str, required=False, help="Email is required")
update_req_parser.add_argument('password', type=str, required=False, help="Password is required")
update_req_parser.add_argument('phone', type=str, required=False, help="Phone number (04xxxxxxxx)")
update_req_parser.add_argument('address', type=str, required=False, help="Address")
update_req_parser.add_argument('suburb', type=str, required=False, help="Suburb")
update_req_parser.add_argument('state', type=str, required=False, help="State (ACT, NSW, NT, QLD, SA, TAS, VIC, WA)")
update_req_parser.add_argument('postcode', type=str, required=False, help="Postcode (4 digits)")
update_req_parser.add_argument('abn', type=str, required=False, help="ABN (11 digits)")
update_req_parser.add_argument('description', type=str, required=False, help="Restaurant description")
update_req_parser.add_argument('image1', type=FileStorage, location='files', required=False, help="First image")
update_req_parser.add_argument('image2', type=FileStorage, location='files', required=False, help="Second image")
update_req_parser.add_argument('image3', type=FileStorage, location='files', required=False, help="Third image")
