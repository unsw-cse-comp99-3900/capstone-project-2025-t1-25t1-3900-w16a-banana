from flask_restx import Resource
from flask import request
import secrets

from utils.db import db
from utils.file import save_file
from utils.check import *
from utils.header import auth_header, check_token
from utils.response import res_error
from db_model import *
from routes.driver.models import *

@api.route('/register')
class RegisterDriver(Resource):
    @api.expect(register_req_parser)
    def post(self):
        """Register driver and upload files"""

        args = register_req_parser.parse_args()

        is_password_okay, description = is_password_safe(args['password'])
        if not is_password_okay:
            return res_error(400, description)

        # check phone, postcode, state, and license number
        # no checks for now on the car plate etc
        if not is_valid_phone(args['phone']):
            return res_error(400, 'Invalid phone number')

        if not is_valid_license_number(args['license_number']):
            return res_error(400, 'Invalid license number')
        
        # the email must be unique
        is_email_exist = Driver.query.filter_by(email=args["email"]).first()
        if is_email_exist:
            return res_error(400, 'Email already exist')
        
        # save the files
        url_license_image = save_file(args['license_image'])
        url_profile_image = save_file(args['profile_image'])
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
            url_profile_image=url_profile_image,
            url_registration_paper=url_registration_paper,
            # create the token now
            token=secrets.token_urlsafe(16)
        )

        db.session.add(new_driver)
        db.session.commit()

        # but the driver application status is still pending
        return new_driver.dict(), 200


@api.route('/update/non-approval')
class DriverNonApprovalUpdate(Resource):
    @api.expect(auth_header, update_no_approval_req)
    def put(self):
        """Driver updates profile (email, password, phone) - No admin approval needed"""

        driver = check_token(auth_header, Driver)
        if not driver:
            return res_error(401)

        # Get request data
        data = request.json

        if 'password' in data:
            is_password_okay, description = is_password_safe(data['password'])
            if not is_password_okay:
                return res_error(400, description)

        # Validate phone number
        if 'phone' in data and not is_valid_phone(data['phone']):
            return res_error(400, 'Invalid phone number')

        # Validate unique email
        if 'email' in data:
            is_email_exist = Driver.query.filter_by(email=data['email']) \
                .filter(Driver.driver_id != driver.driver_id).first()
            if is_email_exist:
                return res_error(400, 'Email already exists')

        # Update driver attributes
        for key, value in data.items():
            setattr(driver, key, value)

        db.session.commit()
        return driver.dict(), 200

@api.route('/update/require-approval')
class DriverUpdateRequireApproval(Resource):
    @api.expect(auth_header, update_approval_req_parser)
    def put(self):
        """Driver updates his profile, admin approval needed"""

        driver = check_token(auth_header, Driver)
        if not driver:
            return res_error(401)

        # data
        args = update_approval_req_parser.parse_args()

        if args['frist_name']: driver.first_name = args['first_name']
        if args['last_name']: driver.last_name = args['last_name']
        if args['car_plate']: driver.car_plate = args['car_plate']
        if args['license_number']:
            if not is_valid_license_number(args['license_number']):
                return res_error(400, 'Invalid license number')
            driver.license_number = args['license_number']
        if args['license_image']:
            url = save_file(args['license_image'])
            if not url:
                return res_error(400, 'Unsupported Image File')
            driver.url_license_image = url
        
        if args['profile_image']:
            url = save_file(args['profile_image'])
            if not url:
                return res_error(400, 'Unsupported Image File')
            driver.url_profile_image = url
        
        # set to pending
        driver.status = RegistrationStatus.PENDING
        db.session.commit()

        return driver.dict(), 200