from flask_restx import Namespace, Resource, fields, reqparse
from flask import request, abort
from werkzeug.datastructures import FileStorage
import secrets

from utils.db import db
from utils.file import save_file
from utils.check import *
from utils.header import auth_header, check_token
from models import *

api = Namespace('driver', description='APIs for Driver')
    

# use driver_register_parser
register_parser = reqparse.RequestParser()
register_parser.add_argument('email', type=str, required=True, default="driver@email.com")
register_parser.add_argument('password', type=str, required=True, default="securepassword")
register_parser.add_argument('phone', type=str, required=True, default="0412345678")
register_parser.add_argument('first_name', type=str, required=True, default="John")
register_parser.add_argument('last_name', type=str, required=True, default="Doe")
register_parser.add_argument('license_number', type=str, required=True, default="123456789")
register_parser.add_argument('car_plate', type=str, required=True, default="ABC123")

# those will be in 'request.files'
register_parser.add_argument("license_image", type=FileStorage, location="files", required=True, help="Driver License Image")
register_parser.add_argument("car_image", type=FileStorage, location="files", required=True, help="Car Image")
register_parser.add_argument("registration_paper", type=FileStorage, location="files", required=True, help="Registration Paper")

@api.route('/register')
class RegisterDriver(Resource):
    @api.expect(register_parser)
    def post(self):
        """Register driver and upload files"""

        args = register_parser.parse_args()

        is_password_okay, description = is_password_safe(args['password'])
        if not is_password_okay:
            abort(400, description)

        # check phone, postcode, state, and license number
        # no checks for now on the car plate etc
        if not is_valid_phone(args['phone']):
            abort(400, 'Invalid phone number')

        if not is_valid_license_number(args['license_number']):
            abort(400, 'Invalid license number')
        
        # the email must be unique
        is_email_exist = Driver.query.filter_by(email=args["email"]).first()
        if is_email_exist:
            abort(400, 'Email already exist')
        
        # save the files
        url_license_image = save_file(args['license_image'])
        url_car_image = save_file(args['car_image'])
        url_registration_paper = save_file(args['registration_paper'])

        # create the new driver
        new_driver = Driver(
            email=args['email'],
            password=args['password'],
            phone=args['phone'],
            first_name=args['first_name'],
            last_name=args['last_name'],
            license_number=args['license_number'],
            car_plate=args['car_plate'],
            url_license_image=url_license_image,
            url_car_image=url_car_image,
            url_registration_paper=url_registration_paper,
            # create the token now
            token=secrets.token_urlsafe(16)
        )

        db.session.add(new_driver)
        db.session.commit()

        # but the driver application status is still pending
        return new_driver.dict(), 200



###############################################################################################
# for the update profile, we group the attributes into non-approval needed and approval needed
# the non-approval needed attributes can be updated without admin approval,
# and approval needed attributes (only for driver and restaurant) need admin approval.

# all customer attributes can be updated without admin approval

# for driver:
# non approval needed: email, password, phone
# approval needed: first_name, last_name, license_number, car_plate, license_image, car_image, registration_paper
###############################################################################################

# Driver non approval mode: email, password, phone
update_no_approval_model = api.model('DriverUpdateNoApprovalModel', {
    'email': fields.String(required=False, description="Email"),
    'password': fields.String(required=False, description="Password"),
    'phone': fields.String(required=False, description="Phone")
})


@api.route('/update/non-approval')
class DriverNonApprovalUpdate(Resource):
    @api.expect(auth_header, update_no_approval_model)
    def put(self):
        """Driver updates profile (email, password, phone) - No admin approval needed"""

        driver = check_token(auth_header, Driver)
        if not driver:
            abort(401, 'Unauthorized')

        # Get request data
        data = request.json

        if 'password' in data:
            is_password_okay, description = is_password_safe(data['password'])
            if not is_password_okay:
                abort(400, description)

        # Validate phone number
        if 'phone' in data and not is_valid_phone(data['phone']):
            abort(400, 'Invalid phone number')

        # Validate unique email
        if 'email' in data:
            is_email_exist = Driver.query.filter_by(email=data['email']) \
                .filter(Driver.driver_id != driver.driver_id).first()
            if is_email_exist:
                abort(400, 'Email already exists')

        # Update driver attributes
        for key, value in data.items():
            setattr(driver, key, value)

        db.session.commit()
        return driver.dict(), 200
    
# some attributes change require approval from the admin
# driver: first_name, last_name, license_number, car_plate, license_image, car_image, registration_paper
# use reqparse to obtain these attributes, but required = False for all attributes
driver_parser = reqparse.RequestParser()
driver_parser.add_argument('first_name', type=str, required=False, help='First Name')
driver_parser.add_argument('last_name', type=str, required=False, help='Last Name')
driver_parser.add_argument('license_number', type=str, required=False, help='License Number')
driver_parser.add_argument('car_plate', type=str, required=False, help='Car Plate')

# 3 files
driver_parser.add_argument('license_image', type=FileStorage, location='files', required=False, help='License Image')
driver_parser.add_argument('car_image', type=FileStorage, location='files', required=False, help='Car Image')
driver_parser.add_argument('registration_paper', type=FileStorage, location='files', required=False, help='Registration Paper')

@api.route('/update/require-approval')
class DriverUpdateRequireApproval(Resource):
    @api.expect(auth_header, driver_parser)
    def put(self):
        """Driver updates his profile, admin approval needed"""

        driver = check_token(auth_header, Driver)
        if not driver:
            abort(401, 'Unauthorized')

        # data
        args = driver_parser.parse_args()

        if 'frist_name' in args: driver.first_name = args['first_name']
        if 'last_name' in args: driver.last_name = args['last_name']
        if 'car_plate' in args: driver.car_plate = args['car_plate']

        if 'license_number' in args:
            if not is_valid_license_number(args['license_number']):
                abort(400, 'Invalid license number')
            driver.license_number = args['license_number']
        
        # 3 files
        # save the files
        if 'license_image' in args:
            driver.url_license_image = save_file(args['license_image'])
        
        if 'car_image' in args:
            driver.url_car_image = save_file(args['car_image'])
        
        if 'registration_paper' in args:
            driver.url_registration_paper = save_file(args['registration_paper'])
        
        # set to pending
        driver.status = RegistrationStatus.PENDING
        db.session.commit()

        return driver.dict(), 200