"""Flask-restx model for Driver APIs"""
from flask_restx import Namespace, reqparse
from werkzeug.datastructures import FileStorage

api = Namespace('driver', description='APIs for Driver')

# for the update profile, we group the attributes into non-approval needed and approval needed
# the non-approval needed attributes can be updated without admin approval,
# and approval needed attributes (only for driver and restaurant) need admin approval.

# for driver:
# non approval needed: email, password, phone
# approval needed: first_name, last_name, license_number,
# car_plate, license_image, car_image, registration_paper

# The frotnend will send all attributesss together, and the backend will update the fields,
# and set the registration status to pending when needed.

"""Request for driver register"""
register_req_parser = reqparse.RequestParser()
register_req_parser.add_argument('email', type=str, required=True, default="driver@email.com")
register_req_parser.add_argument('password', type=str, required=True, default="securepassword")
register_req_parser.add_argument('phone', type=str, required=True, default="0412345678")
register_req_parser.add_argument('first_name', type=str, required=True, default="John")
register_req_parser.add_argument('last_name', type=str, required=True, default="Doe")
register_req_parser.add_argument('license_number', type=str, required=True, default="123456789")
register_req_parser.add_argument('car_plate', type=str, required=True, default="ABC123")
register_req_parser.add_argument(
    "license_image", type=FileStorage, location="files", required=True, help="Driver License Image"
)
register_req_parser.add_argument(
    "registration_paper", type=FileStorage, location="files",
    required=True, help="Registration Paper Image"
)

update_req_parser = reqparse.RequestParser()
update_req_parser.add_argument('email', type=str, required=False, help='Email')
update_req_parser.add_argument('password', type=str, required=False, help='Password')
update_req_parser.add_argument('phone', type=str, required=False, help='Phone')
update_req_parser.add_argument('first_name', type=str, required=False, help='First Name')
update_req_parser.add_argument('last_name', type=str, required=False, help='Last Name')
update_req_parser.add_argument('license_number', type=str, required=False, help='License Number')
update_req_parser.add_argument('car_plate', type=str, required=False, help='Car Plate')
update_req_parser.add_argument(
    'license_image', type=FileStorage, location='files', required=False, help='License Image'
)
update_req_parser.add_argument(
    'registration_paper', type=FileStorage, location='files',
    required=False, help='Registration Paper'
)
