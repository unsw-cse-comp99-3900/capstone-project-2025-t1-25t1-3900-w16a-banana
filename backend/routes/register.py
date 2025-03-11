from flask_restx import Namespace, Resource, fields
from flask import request, abort
import secrets

from utils.db import db 
from models import *

api = Namespace('register', description='Registration related operations')

# customer register model
# require: username, email, password, phone, address, suburb, state, postcode
customer_register_model = api.model('CustomerRegister', {
    'username': fields.String(required=True, description="Username"),
    'email': fields.String(required=True, description="Email"),
    'password': fields.String(required=True, description="Password"),
    'phone': fields.String(required=True, description="Phone (04xxxxxxxx)"),
    'address': fields.String(required=True, description="Address"),
    'suburb': fields.String(required=True, description="Suburb"),
    'state': fields.String(required=True, description="State (ACT, NSW, NT, QLD, SA, TAS, VIC, WA)"),
    'postcode': fields.String(required=True, description="Postcode (4 digits)")
})

@api.route('/register/customer')
class RegisterCustomer(Resource):
    @api.expect(customer_register_model)
    def post(self):
        """Register a new customer account"""

        data = request.json

        # check the phone needs to start with "04",
        # length is 10, and all are digits
        is_valid_phone = data['phone'].startswith("04") and len(data['phone']) == 10 and data['phone'].isdigit()
        if not is_valid_phone:
            abort(400, 'Invalid phone number')
        
        # check the postcode needs to be length 4 and all are digits
        is_valid_postcode = len(data['postcode']) == 4 and data['postcode'].isdigit()
        if not is_valid_postcode:
            abort(400, 'Invalid postcode')
        
        # convert the state into the enum
        try:
            state = State(data['state'])
        except ValueError:
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
            state=state,
            postcode=data['postcode']
        )

        db.session.add(new_customer)
        db.session.commit()

        # create the token
        token = secrets.token_urlsafe(16)
        new_customer.token = token
        db.session.commit()

        return new_customer.dict(), 200




