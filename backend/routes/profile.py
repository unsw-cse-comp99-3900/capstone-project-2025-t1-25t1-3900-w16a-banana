from flask_restx import Namespace, Resource, fields
from flask import request, abort

from utils.db import db 
from models import *
from utils.header import auth_header

api = Namespace('profile', description='Profile related operations')

# authenticate the user with the token.
# so the token will be checked in 4 tables
def authenticate_user(token):
    for user in [Customer, Driver, Restaurant, Admin]:
        user = user.query.filter_by(token=token).first()
        if user:
            return user
    
    return None

# for a easier mapping
user_type_model = {
    'customer': Customer,
    'driver': Driver,
    'restaurant': Restaurant,
    'admin': Admin
}


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







