from flask_restx import Namespace, Resource, fields, reqparse
from flask import request, abort
from werkzeug.datastructures import FileStorage
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

@api.route('/customer')
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
            state=State(data['state']),
            postcode=data['postcode'],
            # create the token now
            token=secrets.token_urlsafe(16)
        )

        db.session.add(new_customer)
        db.session.commit()

        # return the new customer object
        return new_customer.dict(), 200
    

# use driver_register_parser
driver_register_parser = reqparse.RequestParser()
driver_register_parser.add_argument('email', type=str, required=True, default="driver@email.com")
driver_register_parser.add_argument('password', type=str, required=True, default="securepassword")
driver_register_parser.add_argument('phone', type=str, required=True, default="0412345678")
driver_register_parser.add_argument('first_name', type=str, required=True, default="John")
driver_register_parser.add_argument('last_name', type=str, required=True, default="Doe")
driver_register_parser.add_argument('license_number', type=str, required=True, default="123456789")
driver_register_parser.add_argument('car_plate', type=str, required=True, default="ABC123")

# those will be in 'request.files'
driver_register_parser.add_argument("license_image", type=FileStorage, location="files", required=True, help="Driver License Image")
driver_register_parser.add_argument("car_image", type=FileStorage, location="files", required=True, help="Car Image")
driver_register_parser.add_argument("registration_paper", type=FileStorage, location="files", required=True, help="Registration Paper")


@api.route('/driver')
class RegisterDriver(Resource):
    # the frontend will send using the form data
    # since here we use both request.data and request.files
    def post(self):
        """Register driver and upload files"""

        args = driver_register_parser.parse_args()

        # check phone, postcode, state, and license number
        # no checks for now on the car plate etc
        if not is_valid_phone(args['phone']):
            abort(400, 'Invalid phone number')
        
        if not is_valid_postcode(args['postcode']):
            abort(400, 'Invalid postcode')

        if not is_valid_license_number(args['license_number']):
            abort(400, 'Invalid license number')
        
        # the email must be unique
        is_email_exist = Driver.query.filter_by(email=args["email"]).first()
        if is_email_exist:
            abort(400, 'Email already exist')
        
        # save the files
        url_license_image = save_file(args['license_image'])
        url_car_image = save_file(args['car_image'])
        url_registration_paper = save_file(args['registration_paper'])

        # create the new driver
        new_driver = Driver(
            email=args['email'],
            password=args['password'],
            phone=args['phone'],
            first_name=args['first_name'],
            last_name=args['last_name'],
            license_number=args['license_number'],
            car_plate=args['car_plate'],
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
# those will be in 'request.form'
restaurant_register_parser = reqparse.RequestParser()
restaurant_register_parser.add_argument('email', type=str, required=True, default="example@domain.com", help="Email is required")
restaurant_register_parser.add_argument('password', type=str, required=True, default="securepassword", help="Password is required")
restaurant_register_parser.add_argument('phone', type=str, required=True, default="0412345678", help="Phone (04xxxxxxxx)")
restaurant_register_parser.add_argument('name', type=str, required=True, default="A Restaurant", help="Restaurant Name")
restaurant_register_parser.add_argument('address', type=str, required=True, default="111 Street", help="Address")
restaurant_register_parser.add_argument('suburb', type=str, required=True, default="State", help="Suburb")
restaurant_register_parser.add_argument('state', type=str, required=True, default="NSW", help="State (ACT, NSW, NT, QLD, SA, TAS, VIC, WA)")
restaurant_register_parser.add_argument('postcode', type=str, required=True, default="2000", help="Postcode (4 digits)")
restaurant_register_parser.add_argument('abn', type=str, required=True, default="12345678901", help="ABN (11 digits)")
restaurant_register_parser.add_argument('description', type=str, required=True, default="A good restaurant", help="Restaurant Description")

# those will be in 'request.files'
restaurant_register_parser.add_argument("image1", type=FileStorage, location="files", required=True, help="First restaurant image")
restaurant_register_parser.add_argument("image2", type=FileStorage, location="files", required=True, help="Second restaurant image")
restaurant_register_parser.add_argument("image3", type=FileStorage, location="files", required=True, help="Third restaurant image")

@api.route('/restaurant')
class RegisterRestaurant(Resource):
    # The frontend will send using form-data since we have both text fields and file uploads
    @api.expect(restaurant_register_parser)
    def post(self):
        """Register a new restaurant account"""

        args = restaurant_register_parser.parse_args()
        # Extract form data
        email = args['email']
        password = args['password']
        phone = args['phone']
        name = args['name']
        address = args['address']
        suburb = args['suburb']
        state = args['state']
        postcode = args['postcode']
        abn = args['abn']
        description = args['description']
        image1 = args['image1']
        image2 = args['image2']
        image3 = args['image3']

        # some validation
        if not is_valid_phone(phone):
            abort(400, 'Invalid phone number')

        if not is_valid_postcode(postcode):
            abort(400, 'Invalid postcode')

        if not is_valid_state(state):
            abort(400, 'Invalid state')

        if not is_valid_abn(abn):
            abort(400, 'Invalid ABN')

        # Check if email or ABN is already registered
        if Restaurant.query.filter_by(email=email).first():
            abort(400, 'Email already exists')

        if Restaurant.query.filter_by(abn=abn).first():
            abort(400, 'ABN already exists')

        # Ensure all three images are uploaded
        if not image1 or not image2 or not image3:
            abort(400, 'Please upload all three restaurant images')

        # Save uploaded images
        url_img1 = save_file(image1)
        url_img2 = save_file(image2)
        url_img3 = save_file(image3)

        # Create new restaurant
        new_restaurant = Restaurant(
            email=email,
            password=password,
            phone=phone,
            name=name,
            address=address,
            suburb=suburb,
            state=State(state),
            postcode=postcode,
            abn=abn,
            description=description,
            url_img1=url_img1,
            url_img2=url_img2,
            url_img3=url_img3,
            token=secrets.token_urlsafe(16)
        )

        db.session.add(new_restaurant)
        db.session.commit()

        # the application status will be pending
        return new_restaurant.dict(), 200
