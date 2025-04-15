"""APIs related to profile"""
from flask_restx import Resource
from utils.response import res_error

from db_model import (
    Admin, Customer, Driver, Restaurant
)
from routes.profile.models import (
    api,
    profile_req_parser
)

@api.route("/")
class ProfileResource(Resource):
    """Route /"""
    @api.expect(profile_req_parser)
    def get(self):
        """Obtain a profile, enter user_type (customer, restaurant, driver, admin) and user_id"""

        args = profile_req_parser.parse_args()
        user_type, user_id = args['user_type'], args['user_id']

        if user_type == 'customer':
            user = Customer.query.get(user_id)
        elif user_type == 'restaurant':
            user = Restaurant.query.get(user_id)
        elif user_type == 'driver':
            user = Driver.query.get(user_id)
        elif user_type == 'admin':
            user = Admin.query.get(user_id)
        else:
            return res_error(400, 'Invalid user type')

        if not user:
            return res_error(400, 'User not found')
        else:
            # get this user dict, remove token if it exists
            user_dict = user.dict()
            if 'token' in user_dict:
                del user_dict['token']
            
            return user_dict, 200

@api.route("/all/<string:user_type>")
class AllProfileResource(Resource):
    """Route /all/<string:user_type>"""
    def get(self, user_type):
        """
        Obtain all profiles of a certain user type, user_type in 
        (customer, restaurant, driver, admin)
        """
        if user_type == 'customer':
            users = Customer.query.all()
        elif user_type == 'restaurant':
            users = Restaurant.query.all()
        elif user_type == 'driver':
            users = Driver.query.all()
        elif user_type == 'admin':
            users = Admin.query.all()
        else:
            return res_error(400, 'Invalid user type')

        return [user.dict() for user in users]
