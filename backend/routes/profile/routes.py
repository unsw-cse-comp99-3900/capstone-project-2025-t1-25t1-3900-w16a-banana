from flask_restx import Resource 
from flask import request 

from utils.db import db 
from db_model import *
from routes.profile.models import *
from utils.response import res_error


@api.route("/")
class PRofileResource(Resource):
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
            return user.dict()
