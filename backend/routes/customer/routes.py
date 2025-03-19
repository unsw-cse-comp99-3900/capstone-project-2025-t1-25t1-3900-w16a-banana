from flask_restx import Namespace, Resource, fields, reqparse
from flask import request
import secrets

from utils.db import db
from utils.file import save_file
from utils.check import *
from utils.header import auth_header, check_token, get_token_from_header
from utils.response import res_error
from db_model import *
from db_model.db_query import *
from routes.customer.models import *

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
        is_username_exist = Customer.query.filter_by(username=data['username']).first()
        is_email_exist = Customer.query.filter_by(email=data['email']).first()
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
        # return {'message': 'Registration Success'}, 200
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
            is_username_exist = Customer.query.filter(
                Customer.username == args['username'],
                Customer.customer_id != customer.customer_id
            ).first()
            if is_username_exist:
                return res_error(400, 'Username already exist')
            customer.username = args['username']
        
        if args['email']:
            # the email must be unique
            is_email_exist = Customer.query.filter_by(email=args['email']) \
                .filter(Customer.customer_id != customer.customer_id).first()
            if is_email_exist:
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

@api.route('/cart')
class ShopItems(Resource):
    @api.expect(auth_header)
    @api.response(200, "Success", cart_item_get_res)
    @api.response(400, "Bad Request", error_res)
    @api.response(401, "Unauthorised", error_res)
    def get(self):
        """Get All Items' ID in the shopping cart"""
        # Check customer token
        customer = get_customer_by_token(get_token_from_header(auth_header))
        if not customer:
            return res_error(401)

        # Get all items in the cart
        cart_items = get_all_cart_item_by_customer_id(customer.customer_id)
        items = []
        for cart_item in cart_items:
            restaurant = get_restaurant_by_menu_item_id(cart_item.item_id)
            menu = get_menu_item_by_id(cart_item.item_id)
            items.append({
                'item_id': menu.item_id,
                'item_name': menu.name,
                'restaurant_id': restaurant.restaurant_id,
                'restaurant_name': restaurant.name,
                'description': menu.description,
                'price': menu.price,
                'quantity': cart_item.quantity,
                'total_price': cart_item.quantity * menu.price,
                'url_img': menu.url_img
            })

        return {'items': items}, 200
    
    ## TODO: Add response model and response
    @api.expect(auth_header, cart_item_update_req)
    @api.response(200, "Success", cart_item_update_res)
    @api.response(400, "Bad Request", error_res)
    @api.response(401, "Unauthorised", error_res)
    def put(self):
        """Update/Add/Remove item in the cart. Quantity 0 will remove the item."""
        customer = get_customer_by_token(get_token_from_header(auth_header))
        if not customer:
            return res_error(401)

        data = request.json

        if not MenuItem.query.filter_by(item_id=data['item_id']).first():
            return res_error(400, 'Wrong Item ID')

        if data['quantity'] < 0:
            return res_error(400, 'Wrong Item Quantity')

        # Check if item already exists
        cart_item = CartItem.query.filter_by(customer_id=customer.id, item_id=data['item_id']).first()

        message = ""
        # If there is no same item, add one
        if not cart_item:
            new_cart_item = CartItem(
                customer_id=customer.id,
                item_id=data['item_id'],
                quantity=data['quantity']
            )
            db.session.add(new_cart_item)
            message = "Item Added"
        # If the quantity is 0, delete the item
        elif data['quantity'] == 0:
            db.session.delete(cart_item)
            message = "Item Deleted"
        # Otherwise, update the item
        else:
            cart_item.quantity = data['quantity']
            message = "Item Updated"
        db.session.commit()

        return {'message': message}, 200