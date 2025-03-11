from flask_restx import Namespace, Resource, fields
from flask import request, abort
import secrets

from utils.db import db
from utils.file import save_file
from utils.check import *
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
            state=state,
            postcode=data['postcode'],
            # create the token now
            token=secrets.token_urlsafe(16)
        )

        db.session.add(new_customer)
        db.session.commit()

        # return the new customer object
        return new_customer.dict(), 200


# driver registration
driver_register_model = api.model('DriverRegister', {
    'email': fields.String(required=True, description="Email"),
    'password': fields.String(required=True, description="Password"),
    'phone': fields.String(required=True, description="Phone (04xxxxxxxx)"),
    'first_name': fields.String(required=True, description="First Name"),
    'last_name': fields.String(required=True, description="Last Name"),
    'license_number': fields.String(required=True, description="Driver License Number"),
    'car_plate': fields.String(required=True, description="Car Plate Number"),
})


@api.route('/register/driver')
class RegisterDriver(Resource):
    # the frontend will send using the form data
    # since here we use both request.data and request.files
    def post(self):
        """Register driver and upload files"""

        data = request.form
        files = request.files

        # check phone, postcode, state, and license number
        # no checks for now on the car plate etc
        if not is_valid_phone(data['phone']):
            abort(400, 'Invalid phone number')
        
        if not is_valid_postcode(data['postcode']):
            abort(400, 'Invalid postcode')

        if not is_valid_license_number(data['license_number']):
            abort(400, 'Invalid license number')
        
        # the email must be unique
        is_email_exist = Driver.query.filter_by(email=data['email']).first()
        if is_email_exist:
            abort(400, 'Email already exist')
        
        # the user needs to upload 3 things:
        # license_image, car_image, registration_paper
        if 'license_image' not in files or 'car_image' not in files or 'registration_paper' not in files:
            abort(400, 'Please upload all required files')
        
        # save the files
        url_license_image = save_file(files['license_image'])
        url_car_image = save_file(files['car_image'])
        url_registration_paper = save_file(files['registration_paper'])

        # create the new driver
        new_driver = Driver(
            email=data['email'],
            password=data['password'],
            phone=data['phone'],
            first_name=data['first_name'],
            last_name=data['last_name'],
            license_number=data['license_number'],
            car_plate=data['car_plate'],
            # 3 file urls
            url_license_image=url_license_image,
            url_car_image=url_car_image,
            url_registration_paper=url_registration_paper,
            # create the token now
            token=secrets.token_urlsafe(16)
        )

        db.session.add(new_driver)
        db.session.commit()

        # but the driver application status is still pending
        return new_driver.dict(), 200


# restaurant registration
restaurant_register_model = api.model('RestaurantRegister', {
    'email': fields.String(required=True, description="Email"),
    'password': fields.String(required=True, description="Password"),
    'phone': fields.String(required=True, description="Phone (04xxxxxxxx)"),
    'name': fields.String(required=True, description="Restaurant Name"),
    'address': fields.String(required=True, description="Address"),
    'suburb': fields.String(required=True, description="Suburb"),
    'state': fields.String(required=True, description="State (ACT, NSW, NT, QLD, SA, TAS, VIC, WA)"),
    'postcode': fields.String(required=True, description="Postcode (4 digits)"),
    'abn': fields.String(required=True, description="ABN (11 digits)"),
    'description': fields.String(required=True, description="Restaurant Description")
})


@api.route('/register/restaurant')
class RegisterRestaurant(Resource):
    # The frontend will send using form-data since we have both text fields and file uploads
    def post(self):
        """Register a new restaurant account"""

        data = request.form
        files = request.files 

        # some validation
        if not is_valid_phone(data['phone']):
            abort(400, 'Invalid phone number')

        if not is_valid_postcode(data['postcode']):
            abort(400, 'Invalid postcode')

        if not is_valid_state(data['state']):
            abort(400, 'Invalid state')

        if not is_valid_abn(data['abn']):
            abort(400, 'Invalid ABN')

        # Check if email or ABN is already registered
        if Restaurant.query.filter_by(email=data['email']).first():
            abort(400, 'Email already exists')

        if Restaurant.query.filter_by(abn=data['abn']).first():
            abort(400, 'ABN already exists')

        # Ensure all three images are uploaded
        if 'image1' not in files or 'image2' not in files or 'image3' not in files:
            abort(400, 'Please upload all three restaurant images')

        # Save uploaded images
        url_img1 = save_file(files['image1'])
        url_img2 = save_file(files['image2'])
        url_img3 = save_file(files['image3'])

        # Create new restaurant
        new_restaurant = Restaurant(
            email=data['email'],
            password=data['password'],
            phone=data['phone'],
            name=data['name'],
            address=data['address'],
            suburb=data['suburb'],
            state=State(data['state']),
            postcode=data['postcode'],
            abn=data['abn'],
            description=data['description'],
            url_img1=url_img1,
            url_img2=url_img2,
            url_img3=url_img3,
            token=secrets.token_urlsafe(16)
        )

        db.session.add(new_restaurant)
        db.session.commit()

        # the application status will be pending
        return new_restaurant.dict(), 200
