from flask_restx import Resource
from flask import request
import secrets

from utils.db import db
from utils.file import save_image
from utils.check import *
from utils.header import auth_header, check_token
from utils.response import res_error
from db_model import *
from routes.restaurant.models import *


# Login routes are in separate api

@api.route('/register')
class RegisterRestaurant(Resource):
    # The frontend will send using form-data since we have both text fields and file uploads
    @api.expect(register_req_parser)
    @api.response(200, "Success", register_res)
    @api.response(400, "Bad Request", error_res)
    def post(self):
        """Register a new restaurant account"""

        args = register_req_parser.parse_args()
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
            return res_error(400, 'Invalid phone number')

        if not is_valid_postcode(postcode):
            return res_error(400, 'Invalid postcode')

        if not is_valid_state(state):
            return res_error(400, 'Invalid state')

        if not is_valid_abn(abn):
            return res_error(400, 'Invalid ABN')

        # Check if email or ABN is already registered
        if Restaurant.query.filter_by(email=email).first():
            return res_error(400, 'Email already exists')

        if Restaurant.query.filter_by(abn=abn).first():
            return res_error(400, 'ABN already exists')

        # Ensure all three images are uploaded and in correct extension
        if not image1 or not image2 or not image3:
            return res_error(400, 'Please upload all three restaurant images')

        # Save uploaded images
        url_img1 = save_image(image1)
        url_img2 = save_image(image2)
        url_img3 = save_image(image3)

        if not url_img1 or not url_img2 or not url_img3:
            return res_error(400, 'Unsupported files for images')

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
        )

        db.session.add(new_restaurant)
        db.session.commit()

        # the application status will be pending
        return {'message': 'Registration Success'}, 200


@api.route("/update")
class RestaurantUpdate(Resource):
    @api.expect(auth_header, update_req_parser)
    @api.response(200, "Success")
    @api.response(400, "Bad Request", error_res)
    @api.response(400, "Unauthorised", error_res)
    def put(self):
        """ Restaurant update all profiles using this route, the backend may change registration status to PENDING """

        restaurant = check_token(auth_header, Restaurant)
        if not restaurant:
            return res_error(401)

        # data
        args = update_req_parser.parse_args()

        # track the sensitive data update
        require_approval = False

        if args.get('name'):
            restaurant.name = args['name']
            require_approval = True
        
        if args.get("email"):
            is_email_exist = Restaurant.query.filter_by(email=args['email']) \
                .filter(Restaurant.restaurant_id != restaurant.restaurant_id).first()
            if is_email_exist:
                return res_error(400, 'Email already exists')    
            restaurant.email = args["email"]
        
        if args.get("password"):
            is_password_okay, description = is_password_safe(args['password'])
            if not is_password_okay:
                return res_error(400, description)
            restaurant.password = args["password"]
        
        if args.get("phone"):
            if not is_valid_phone(args['phone']):
                return res_error(400, 'Invalid phone number')
            restaurant.phone = args["phone"]

        if args.get("address"):
            restaurant.address = args["address"]
            require_approval = True
        
        if args.get("suburb"):
            restaurant.suburb = args["suburb"]
            require_approval = True
        
        if args.get("state"):
            if not is_valid_state(args['state']):
                return res_error(400, 'Invalid state')
            restaurant.state = args["state"]
            require_approval = True
        
        if args.get("postcode"):
            if not is_valid_postcode(args['postcode']):
                return res_error(400, 'Invalid postcode')
            restaurant.postcode = args["postcode"]
            require_approval = True
        
        if args.get("abn"):
            if not is_valid_abn(args['abn']):
                return res_error(400, 'Invalid ABN')
            restaurant.abn = args["abn"]
            require_approval = True

        if args.get("description"):
            restaurant.description = args["description"]
            require_approval = False
        
        # process images if given
        if args.get("image1"):
            url = save_image(args['image1'])
            if not url:
                return res_error(400, 'Unsupported Image File')
            restaurant.url_img1 = url
            require_approval = False
    
        if args.get("image2"):
            url = save_image(args['image2'])
            if not url:
                return res_error(400, 'Unsupported Image File')
            restaurant.url_img2 = url
            require_approval = False
        
        if args.get("image3"):
            url = save_image(args['image3'])
            if not url:
                return res_error(400, 'Unsupported Image File')
            restaurant.url_img3 = url
            require_approval = False
        
        # track the require-approval fields
        if require_approval:
            restaurant.registration_status = RegistrationStatus.PENDING
        
        db.session.commit()
        return restaurant.dict(), 200
