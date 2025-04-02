"""Customer API Routes"""
import secrets
from flask_restx import Resource
from flask import request

from utils.db import db
from utils.file import save_file
from utils.check import (
    is_password_safe,
    is_valid_phone,
    is_valid_postcode,
    is_valid_state,
)
from utils.header import auth_header, tokenize
from utils.response import res_error
from db_model import Customer, Favourites
from db_model.db_query import (
    filter_customers,
    get_customer_by_token,
    filter_favourites,
    filter_restaurants
)
from db_model.db_enum import State
from routes.customer.models import (
    api,
    register_req,
    register_res,
    message_res,
    update_profile_req_parser,
    update_favourites_req,
    favourite_model
)

@api.route('/register')
class RegisterCustomer(Resource):
    """Route: /register"""
    @api.expect(register_req)
    @api.response(200, "Success", register_res)
    @api.response(400, "Bad Request", message_res)
    @api.response(401, "Unauthorised", message_res)
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
        if filter_customers(username = data['username']):
            return res_error(400, 'Duplicate Username')
        if filter_customers(email = data['email']):
            return res_error(400, 'Duplicate Email')

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
    """Route: /update"""
    @api.expect(auth_header, update_profile_req_parser)
    @api.response(200, "Success")
    @api.response(400, "Bad Request", message_res)
    @api.response(401, "Unauthorised", message_res)
    def put(self):
        """Customer updates his profile, no admin approval needed"""

        customer = get_customer_by_token(tokenize(request.headers))
        if not customer:
            return res_error(401)

        # data, needs to check
        args = update_profile_req_parser.parse_args()

        if args['password']:
            is_password_okay, description = is_password_safe(args['password'])
            if not is_password_okay:
                return res_error(400, description)
            customer.password = args['password']

        if args['username'] and args['username'] != customer.username:
            # the username must be unique
            if filter_customers(username = args['username']):
                return res_error(400, 'Username already exist')
            customer.username = args['username']

        if args['email'] and args['email'] != customer.email:
            # the email must be unique
            if filter_customers(email = args['email']):
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


@api.route('/favourites')
class GetFavourites(Resource):
    """Route: /favourites"""
    @api.expect(auth_header)
    @api.marshal_list_with(favourite_model)
    @api.response(200, "Success")
    @api.response(400, "Bad Request", message_res)
    @api.response(401, "Unauthorised", message_res)
    def get(self):
        """Get full list of Favourite restaurant"""
        customer = get_customer_by_token(tokenize(request.headers))
        if not customer:
            return res_error(401)

        favourites = filter_favourites(customer_id = customer.id)
        print(favourites)
        return [favourite for favourite in favourites], 200
    
@api.route('/favourite')
class AddFavourite(Resource):
    """Route: /favourite"""
    @api.expect(auth_header, update_favourites_req)
    @api.response(200, "Success", message_res)
    @api.response(400, "Bad Request", message_res)
    @api.response(401, "Unauthorised", message_res)
    def post(self):
        """Add a given restaurant to the favourite"""
        customer = get_customer_by_token(tokenize(request.headers))
        if not customer:
            return res_error(401)

        # Check if the restaurant exist
        restaurant_id = request.get_json()['restaurant_id']
        if not filter_restaurants(id = restaurant_id):
            return res_error(400, 'Invalid Restaurant ID')

        # Check if the favourite exist
        if filter_favourites(
            customer_id = customer.id,
            restaurant_id = restaurant_id
        ):
            return res_error(400, 'Restaurant Already In Favourites')

        new_favourites = Favourites(
            customer_id = customer.id,
            restaurant_id = restaurant_id
        )

        db.session.add(new_favourites)
        db.session.commit()
        return new_favourites.dict(), 200

@api.route('/favourite/<int:favourite_id>')
class DeleteFavourite(Resource):
    @api.expect(auth_header)
    @api.response(200, "Success", message_res)
    @api.response(400, "Bad Request", message_res)
    @api.response(401, "Unauthorised", message_res)
    def delete(self, favourite_id: int):
        """Delete given restuarnt from Favourites"""
        customer = get_customer_by_token(tokenize(request.headers))
        if not customer:
            return res_error(401)

        # Check if the restaurant exist
        restaurant_id = request.get_json()['restaurant_id']
        if not filter_restaurants(id = restaurant_id):
            return res_error(400, 'Invalid Restaurant ID')

        # Check if the favourite exist
        favourites = filter_favourites(
            id = favourite_id,
            customer_id = customer.id
        )
        if not favourites:
            return res_error(400, 'Restaurant Not In Favourites')

        # Delete from DB
        db.session.delete(favourites[0])
        db.session.commit()
        return {'message': 'Deleted Successfully'}, 200

