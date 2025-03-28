"""APIs for Driver"""
from flask_restx import Resource
from flask import request

from utils.db import db
from utils.file import save_file, save_image
from utils.check import (
    is_password_safe,
    is_valid_phone,
    is_valid_license_number
)
from utils.header import auth_header, tokenize
from utils.response import res_error
from db_model import Driver
from db_model.db_enum import RegistrationStatus
from db_model.db_query import get_driver_by_token, filter_drivers
from routes.driver.models import (
    api,
    register_req_parser,
    update_req_parser
)

@api.route('/register')
class RegisterDriver(Resource):
    """Route: /register"""
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
        if filter_drivers(email=args["email"]):
            return res_error(400, 'Email already exist')

        # save the files
        url_license_image = save_file(args['license_image'])
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
            url_registration_paper=url_registration_paper,
        )

        db.session.add(new_driver)
        db.session.commit()

        # but the driver application status is still pending
        return new_driver.dict(), 200


UPDATE_ROUTER_DOC = """
The driver sends a token and update some fields. 

The driver can update some fields without admin approval:
* email
* password
* phone

But the following updates will turn the registration status to pending,
and require admin approval again:
* first_name
* last_name
* license_number
* car_plate
* license_image
* registration_paper

During the request, the frontend sends all attributes together,
and the backend will update the fields, and set the registration status to pending
when needed.
"""

@api.route("/update")
class UpdateProfile(Resource):
    """Route: /update"""
    @api.expect(auth_header, update_req_parser)
    @api.doc(description=UPDATE_ROUTER_DOC)
    def put(self):
        """Driver updates profile, may turn the registration status to pending for admin review"""

        driver = get_driver_by_token(tokenize(request.headers))
        if not driver:
            return res_error(401)

        # get the request
        args = update_req_parser.parse_args()

        # monitor if some require-approval fields are updated
        require_approval = False

        # some fields may not be updated, but the parse_args will always have that key,
        # so here use args["email"] or args.get("email") to check if the field is updated,
        # not "if email in args"
        if args.get("email") and args.get('email') != driver.email:
            if filter_drivers(email=args['email']):
                return res_error(400, 'Email already exists')
            driver.email = args["email"]

        if args.get("password"):
            is_password_okay, description = is_password_safe(args['password'])
            if not is_password_okay:
                return res_error(400, description)
            driver.password = args["password"]

        if args.get("phone") and args.get('phone') != driver.phone:
            if not is_valid_phone(args['phone']):
                return res_error(400, 'Invalid phone number')
            driver.phone = args["phone"]

        if args.get("first_name") and args.get('first_name') != driver.first_name:
            driver.first_name = args["first_name"]
            require_approval = True

        if args.get("last_name") and args.get('last_name') != driver.last_name:
            driver.last_name = args["last_name"]
            require_approval = True

        if args.get("license_number") and args.get('license_number') != driver.license_number:
            if not is_valid_license_number(args['license_number']):
                return res_error(400, 'Invalid license number')
            driver.license_number = args["license_number"]
            require_approval = True

        if args.get("car_plate") and args.get('car_plate') != driver.car_plate:
            driver.car_plate = args["car_plate"]
            require_approval = True

        if args.get("license_image"):
            url = save_image(args['license_image'])
            if not url:
                return res_error(400, 'Unsupported Image File')
            driver.url_license_image = url
            require_approval = True

        if args.get("registration_paper"):
            url = save_file(args['registration_paper'])
            if not url:
                return res_error(400, 'Unsupported Image File')
            driver.url_registration_paper = url
            require_approval = True

        if require_approval:
            driver.registration_status = RegistrationStatus.PENDING

        db.session.commit()
        return driver.dict(), 200
