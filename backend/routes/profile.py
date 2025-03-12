from flask_restx import Namespace, Resource, fields, reqparse
from flask import request, abort
from werkzeug.datastructures import FileStorage

from utils.db import db
from utils.check import *
from models import *
from utils.header import auth_header
from utils.file import save_file

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


# for the update profile, we group the attributes into non-approval needed and approval needed
# the non-approval needed attributes can be updated without admin approval,
# and approval needed attributes (only for driver and restaurant) need admin approval.

# all customer attributes can be updated without admin approval

# for driver:
# non approval needed: email, password, phone
# approval needed: first_name, last_name, license_number, car_plate, license_image, car_image, registration_paper

# for restaurant:
# non approval needed: email, password, phone, url_img1, url_img2, url_img3, description
# approval needed: name, address, suburb, state, postcode, abn

# customer update model
customer_update_model = api.model('CustomerUpdateModel', {
    'username': fields.String(required=True, description='Username'),
    'email': fields.String(required=True, description='Email'),
    'password': fields.String(required=True, description='Password'),
    'phone': fields.String(required=True, description='Phone'),
    'address': fields.String(required=True, description='Address'),
    'suburb': fields.String(required=True, description='Suburb'),
    'state': fields.String(required=True, description='State'),
    'postcode': fields.String(required=True, description='Postcode (4 digits)')
})

# the customer needs to provide his token
@api.route('/update/customer')
class CustomerUpdate(Resource):
    @api.expect(auth_header, customer_update_model)
    def put(self):
        """Customer updates his profile, no admin approval needed"""

        token = auth_header.parse_args()['Authorization']
        customer = Customer.query.filter_by(token=token).first()
        if not customer:
            abort(401, 'Unauthorized')

        # data, needs to check
        data = request.json
        if 'username' in data:
            # the username must be unique
            is_username_exist = Customer.query.filter_by(username=data['username']) \
                .filter(Customer.customer_id != customer.customer_id).first()
            if is_username_exist:
                abort(400, 'Username already exist')
        
        if 'email' in data:
            # the email must be unique
            is_email_exist = Customer.query.filter_by(email=data['email']) \
                .filter(Customer.id != customer.id).first()
            if is_email_exist:
                abort(400, 'Email already exist')
        
        # check the phone, etc
        if 'phone' in data and not is_valid_phone(data['phone']):
            abort(400, 'Invalid phone number')
        
        if 'postcode' in data and not is_valid_postcode(data['postcode']):
            abort(400, 'Invalid postcode')
        
        if 'state' in data and not is_valid_state(data['state']):
            abort(400, 'Invalid state')
        
        # update the customer
        for key, value in data.items():
            setattr(customer, key, value)
        
        db.session.commit()
        return customer.dict(), 200


# both driver and restaurant can update profile without admin approval
# for the only 3 attributes
driver_and_restaurant_non_approval_model = api.model('DriverUpdateNonApprovalModel', {
    'email': fields.String(required=True, description='Email'),
    'password': fields.String(required=True, description='Password'),
    'phone': fields.String(required=True, description='Phone')
})

# and the driver and restaurant needs to provide the token
@api.route('/update/driver/non-approval')
@api.route('/update/restaurant/non-approval')
class DriverAndRestaurantNonApprovalUpdate(Resource):
    @api.expect(auth_header, driver_and_restaurant_non_approval_model)
    def put(self):
        """Driver and restaurant update their profile, no admin approval needed"""

        token = auth_header.parse_args()['Authorization']
        user = authenticate_user(token)

        # this user needs to be either Driver or Restaurant
        if not user or not isinstance(user, (Driver, Restaurant)):
            abort(401, 'Unauthorized')

        # data, needs to check
        data = request.json
        if 'phone' in data and not is_valid_phone(data['phone']):
            abort(400, 'Invalid phone number')

        # email also needs to be unique
        if 'email' in data:
            if isinstance(user, Driver):
                is_email_exist = Driver.query.filter_by(email=data['email']) \
                    .filter(Driver.driver_id != user.driver_id).first()
                if is_email_exist:
                    abort(400, 'Email already exist')
            else:
                is_email_exist = Restaurant.query.filter_by(email=data['email']) \
                    .filter(Restaurant.restaurant_id != user.restaurant_id).first()
                if is_email_exist:
                    abort(400, 'Email already exist')

        # update the user
        for key, value in data.items():
            setattr(user, key, value)
        
        db.session.commit()
        return user.dict(), 200


# some attributes change require approval from the admin
# driver: first_name, last_name, license_number, car_plate, license_image, car_image, registration_paper
# use reqparse to obtain these attributes, but required = False for all attributes
driver_parser = reqparse.RequestParser()
driver_parser.add_argument('first_name', type=str, required=False, help='First Name')
driver_parser.add_argument('last_name', type=str, required=False, help='Last Name')
driver_parser.add_argument('license_number', type=str, required=False, help='License Number')
driver_parser.add_argument('car_plate', type=str, required=False, help='Car Plate')

# 3 files
driver_parser.add_argument('license_image', type=FileStorage, location='files', required=False, help='License Image')
driver_parser.add_argument('car_image', type=FileStorage, location='files', required=False, help='Car Image')
driver_parser.add_argument('registration_paper', type=FileStorage, location='files', required=False, help='Registration Paper')

@api.route('/update/driver/require-approval')
class DriverUpdateRequireApproval(Resource):
    @api.expect(auth_header, driver_parser)
    def put(self):
        """Driver updates his profile, admin approval needed"""

        token = auth_header.parse_args()['Authorization']
        driver = Driver.query.filter_by(token=token).first()
        if not driver:
            abort(401, 'Unauthorized')

        # data
        args = driver_parser.parse_args()

        if 'frist_name' in args: driver.first_name = args['first_name']
        if 'last_name' in args: driver.last_name = args['last_name']
        if 'car_plate' in args: driver.car_plate = args['car_plate']

        if 'license_number' in args:
            if not is_valid_license_number(args['license_number']):
                abort(400, 'Invalid license number')
            driver.license_number = args['license_number']
        
        # 3 files
        # save the files
        if 'license_image' in args:
            driver.url_license_image = save_file(args['license_image'])
        
        if 'car_image' in args:
            driver.url_car_image = save_file(args['car_image'])
        
        if 'registration_paper' in args:
            driver.url_registration_paper = save_file(args['registration_paper'])
        
        db.session.commit()
        return driver.dict(), 200






