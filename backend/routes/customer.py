from flask_restx import Namespace, Resource, fields, reqparse
from flask import request, abort
from werkzeug.datastructures import FileStorage
import secrets

from utils.db import db
from utils.file import save_file
from utils.check import *
from utils.header import auth_header, check_token
from models import *

api = Namespace('customer', description='APIs for Customer')

# Login feature is implemented on different api
# customer register model
# require: username, email, password, phone, address, suburb, state, postcode
register_model = api.model('CustomerRegister', {
    'username': fields.String(required=True, description="Username", default="customer1"),
    'email': fields.String(required=True, description="Email", default="customer@gmail.com"),
    'password': fields.String(required=True, description="Password", default="SafePass12!@"),
    'phone': fields.String(required=True, description="Phone (04xxxxxxxx)", default="0444444444"),
    'address': fields.String(required=True, description="Address", default="11 Street"),
    'suburb': fields.String(required=True, description="Suburb", default="Kensington"),
    'state': fields.String(required=True, description="State (ACT, NSW, NT, QLD, SA, TAS, VIC, WA)", default="NSW"),
    'postcode': fields.String(required=True, description="Postcode (4 digits)", default="2000")
})

"""Register a new customer account"""
@api.route('/register')
class RegisterCustomer(Resource):
    @api.expect(register_model)
    def post(self):

        data = request.json

        # Check password strength
        is_password_okay, description = is_password_safe(data['password'])
        if not is_password_okay:
            abort(400, description)

        # check the phone, postcode, and state
        if not is_valid_phone(data['phone']):
            abort(400, 'Invalid phone number')
        
        if not is_valid_postcode(data['postcode']):
            abort(400, 'Invalid postcode')
        
        if not is_valid_state(data['state']):
            abort(400, 'Invalid state')
        
        # the username and email must be unique
        is_username_exist = Customer.query.filter_by(username=data['username']).first()
        is_email_exist = Customer.query.filter_by(email=data['email']).first()
        if is_username_exist or is_email_exist:
            abort(400, 'Username or email already exist')
        
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


profile_parser = reqparse.RequestParser()
profile_parser.add_argument('username', type=str, required=False)
profile_parser.add_argument('email', type=str, required=False)
profile_parser.add_argument('password', type=str, required=False)
profile_parser.add_argument('phone', type=str, required=False)
profile_parser.add_argument('address', type=str, required=False)
profile_parser.add_argument('suburb', type=str, required=False)
profile_parser.add_argument('state', type=str, required=False)
profile_parser.add_argument('postcode', type=str, required=False)
profile_parser.add_argument("profile", type=FileStorage, location="files", required=False, help="Profile Image")

@api.route('/update/profile')
class CustomerUpdate(Resource):
    @api.expect(auth_header, profile_parser)
    def put(self):
        """Customer updates his profile, no admin approval needed"""

        customer = check_token(auth_header, Customer)
        if not customer:
            abort(401, 'Unauthorized')

        # data, needs to check
        args = profile_parser.parse_args()

        if 'password' in args:
            is_password_okay, description = is_password_safe(args['password'])
            if not is_password_okay:
                abort(400, description)

        if 'username' in args:
            # the username must be unique
            is_username_exist = Customer.query.filter_by(username=args['username']) \
                .filter(Customer.customer_id != customer.customer_id).first()
            if is_username_exist:
                abort(400, 'Username already exist')
        
        if 'email' in args:
            # the email must be unique
            is_email_exist = Customer.query.filter_by(email=args['email']) \
                .filter(Customer.id != customer.id).first()
            if is_email_exist:
                abort(400, 'Email already exist')
        
        # check the phone, etc
        if 'phone' in args and not is_valid_phone(args['phone']):
            abort(400, 'Invalid phone number')
        
        if 'postcode' in args and not is_valid_postcode(args['postcode']):
            abort(400, 'Invalid postcode')
        
        if 'state' in args and not is_valid_state(args['state']):
            abort(400, 'Invalid state')


        if 'profile' in args:
            url = save_file(args['license_image'])
            if not url:
                abort(400, "Invalid Image File")

        # update the customer
        for key, value in args.items():
            setattr(customer, key, value)
        
        db.session.commit()
        return customer.dict(), 200


cart_item_update_model = api.model('Cart Item Delete Model', {
    'item_id': fields.Integer(required=True, description='Item ID to Delete', default=1),
    'quantity': fields.Integer(required=True, description='Quantity of item', default=1)
})

@api.route('/cart')
class ShopItems(Resource):
    @api.expect(auth_header)
    def get(self):
        """Get All Items' ID in the shopping cart"""
        # Check customer token
        customer = check_token(auth_header, Customer)
        if not customer:
            abort(401, 'Unauthorized')

        # Get all items in the cart
        cart_items = CartItem.query.filter_by(customer_id=customer.id)
        item_id = []
        for cart_item in cart_items:
            item_id += cart_item.item_id

        return {item_id: item_id}, 200
    
    @api.expect(auth_header, cart_item_update_model)
    def put(self):
        """Update/Add/Remove item in the cart. Quantity 0 will remove the item."""
        # Check customer token
        customer = check_token(auth_header, Customer)
        if not customer:
            abort(401, 'Unauthorized')

        data = request.json

        if not MenuItem.query.filter_by(item_id=data['item_id']).first():
            abort(400, 'Wrong Item ID')

        if data['quantity'] < 0:
            abort(400, 'Wrong Item Quantity')

        # Check if item already exists
        cart_item = CartItem.query.filter_by(customer_id=customer.id, item_id=data['item_id']).first()

        # If there is no same item, add one
        if not cart_item:
            new_cart_item = CartItem(
                customer_id=customer.id,
                item_id=data['item_id'],
                quantity=data['quantity']
            )
            db.session.add(new_cart_item)
        # If the quantity is 0, delete the item
        elif data['quantity'] == 0:
            db.session.delete(cart_item)
        # Otherwise, update the item
        else:
            cart_item.quantity = data['quantity']
        db.session.commit()


