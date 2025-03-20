from flask_restx import Resource
from flask import request
import secrets

from utils.db import db
from utils.file import save_file
from utils.check import *
from utils.header import auth_header, get_token_from_header
from utils.response import res_error
from db_model import *
from db_model.db_query import *
from routes.customer.models import *
from routes.customer.services import *

@api.route('/register')
class RegisterCustomer(Resource):
    @api.expect(register_req)
    @api.response(200, "Success", register_res)
    @api.response(400, "Bad Request", error_res)
    @api.response(401, "Unauthorised", error_res)
    def post(self):
        """Register a new customer account"""
        data = request.json

        # Check password strength
        is_password_okay, description = is_password_safe(data['password'])
        if not is_password_okay:
            return res_error(400, description)

        # check the phone, postcode, and state
        if not is_valid_phone(data['phone']):
            return res_error(400, 'Invalid phone number')
        
        if not is_valid_postcode(data['postcode']):
            return res_error(400, 'Invalid postcode')
        
        if not is_valid_state(data['state']):
            return res_error(400, 'Invalid state')
        
        # the username and email must be unique
        is_username_exist = get_customer_by_username(data['username'])
        is_email_exist = get_customer_by_email(data['email'])
        if is_username_exist or is_email_exist:
            return res_error(400, 'Username or email already exist')
        
        # create the new customer
        new_customer = Customer(
            username=data['username'],
            email=data['email'],
            password=data['password'],
            phone=data['phone'],
            address=data['address'],
            suburb=data['suburb'],
            state=State(data['state']),
            postcode=data['postcode'],
            # create the token now
            token=secrets.token_urlsafe(16)
        )

        db.session.add(new_customer)
        db.session.commit()

        # return the new customer object
        return new_customer.dict(), 200


@api.route('/update')
class CustomerUpdate(Resource):
    @api.expect(auth_header, update_profile_req_parser)
    @api.response(200, "Success")
    @api.response(400, "Bad Request", error_res)
    @api.response(401, "Unauthorised", error_res)
    def put(self):
        """Customer updates his profile, no admin approval needed"""

        customer = get_customer_by_token(get_token_from_header(auth_header))
        if not customer:
            return res_error(401)

        # data, needs to check
        args = update_profile_req_parser.parse_args()

        if args['password']:
            is_password_okay, description = is_password_safe(args['password'])
            if not is_password_okay:
                return res_error(400, description)
            customer.password = args['password']

        if args['username']:
            # the username must be unique
            user = get_customer_by_username(args['username'])
            if user and user.customer_id == customer.customer_id:
                return res_error(400, 'Username already exist')
            customer.username = args['username']
        
        if args['email']:
            # the email must be unique
            user = get_customer_by_email(args['email'])
            if user and user.customer_id == customer.customer_id:
                return res_error(400, 'Email already exist')
            customer.email = args['email']
        
        # check the phone, etc
        if args['phone']:
            if not is_valid_phone(args['phone']):
                return res_error(400, 'Invalid phone number')
            customer.phone = args['phone']
        
        # address, suburb, state, postcode
        if args['address']:
            if not args["address"]:
                return res_error(400, 'Invalid address')
            customer.address = args['address']
        
        if args['suburb']:
            if not args["suburb"]:
                return res_error(400, 'Invalid suburb')
            customer.suburb = args['suburb']

        if args['postcode']:
            if not is_valid_postcode(args['postcode']):
                return res_error(400, 'Invalid postcode')
            customer.postcode = args['postcode']
        
        if args['state']:
            if not is_valid_state(args['state']):
                return res_error(400, 'Invalid state')
            customer.state = args['state']

        if args['profile_image']:
            url = save_file(args['profile_image'])
            if not url:
                return res_error(400, "Invalid Image File")
            
            customer.url_profile_image = url
        
        db.session.commit()
        return customer.dict(), 200