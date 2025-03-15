from flask_restx import Namespace, Resource, fields
from flask import request, abort
import secrets

from utils.db import db 
from utils.header import auth_header
from db_model import *

api = Namespace('auth', description='Authentication related operations. Common for all types of users')

# all login using email + password
# ask to enter user_type: customer, driver, restaurant, admin
login_model = api.model('Login', {
    'email': fields.String(required=True, description='Email'),
    'password': fields.String(required=True, description='Password'),
    'user_type': fields.String(required=True, description='User Type')
})

# for a easier mapping
user_type_model = {
    'customer': Customer,
    'driver': Driver,
    'restaurant': Restaurant,
    'admin': Admin
}

# authenticate the user with the token.
# so the token will be checked in 4 tables
def authenticate_user(token):
    for user in [Customer, Driver, Restaurant, Admin]:
        user = user.query.filter_by(token=token).first()
        if user:
            return user
    return None

@api.route('/login')
class Login(Resource):
    @api.expect(login_model)
    def post(self):
        """Login and return the user object and token"""

        data = request.json 
        email, password, user_type = data['email'], data['password'], data['user_type']

        # check if the user exists
        user = None

        if user_type == 'customer':
            user = Customer.query.filter_by(email=email, password=password).first()
        elif user_type == 'driver':
            user = Driver.query.filter_by(email=email, password=password).first()
        elif user_type == 'restaurant':
            user = Restaurant.query.filter_by(email=email, password=password).first()
        elif user_type == 'admin':
            user = Admin.query.filter_by(email=email, password=password).first()
        else:
            abort(400, 'Invalid user type, must be one of customer, driver, restaurant, admin')

        if not user:
            abort(401, 'Invalid credentials')
        
        # screate the token
        token = secrets.token_urlsafe(16)
        user.token = token
        db.session.commit()

        return user.dict(), 200

# as long as the token is valid, any user can obtain any user's profile
# require the user_type = customer, driver, restaurant, admin
# and the user_id
# (this general api is easy to use for the frontend)
@api.route('/<string:user_type>/<int:user_id>')
class ViewProfile(Resource):
    @api.expect(auth_header)
    def get(self, user_type, user_id):
        """Obtain the user's profile, enter the user_type and user_id"""

        # check the user type
        if user_type not in ['customer', 'driver', 'restaurant', 'admin']:
            abort(400, 'Invalid user type')

        # check the token, this user can be in Customer, Driver, Restaurant, or Admin
        token = auth_header.parse_args()['Authorization']
        is_user = authenticate_user(token)

        if not is_user:
            abort(401, 'Unauthorized')

        # get the user, need the user to be exist
        user = user_type_model[user_type].query.get(user_id)
        if not user:
            abort(404, 'User not found')

        # return the dict
        return user.dict(), 200


# use the token to obtain my own profile
@api.route('/me')
class MyProfile(Resource):
    @api.expect(auth_header)
    def get(self):
        """Obtain my own profile, response includes the user_type"""

        # check the token, this user can be in Customer, Driver, Restaurant, or Admin
        token = auth_header.parse_args()['Authorization']
        user = authenticate_user(token)

        if not user:
            abort(401, 'Unauthorized')

        # the response also contain the user_type
        result = user.dict()

        # remove the s at the end
        user_type = user.__tablename__
        if user_type[-1] == 's':
            user_type = user_type[:-1]
        
        result['user_type'] = user_type

        return result, 200