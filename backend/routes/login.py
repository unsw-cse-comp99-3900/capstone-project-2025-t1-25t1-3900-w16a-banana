from flask_restx import Namespace, Resource, fields
from flask import request, abort
import secrets

from utils.db import db 
from models import *

api = Namespace('auth', description='Authentication related operations')

# all login using email + password
# ask to enter user_type: customer, driver, restaurant, admin
login_model = api.model('Login', {
    'email': fields.String(required=True, description='Email'),
    'password': fields.String(required=True, description='Password'),
    'user_type': fields.String(required=True, description='User Type')
})

@api.route('/login')
class Login(Resource):
    @api.expect(login_model)
    def post(self):
        """Login and return the user object and token"""

        data = request.json 
        email, password, user_type = data['email'], data['password'], data['user_type']

        if user_type == 'customer':
            user = Customer.query.filter_by(email=email, password=password).first()
        elif user_type == 'driver':
            user = Driver.query.filter_by(email=email, password=password).first()
        elif user_type == 'restaurant':
            user = Restaurant.query.filter_by(email=email, password=password).first()
        elif user_type == 'admin':
            user = Admin.query.filter_by(email=email, password=password).first()
        
        if not user:
            abort(401, 'Invalid credentials')
        
        # screate the token
        token = secrets.token_urlsafe(16)
        user.token = token
        db.session.commit()

        return user.dict(), 200
