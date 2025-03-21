from flask_restx import Resource
from flask import request

from utils.db import db
from utils.file import save_image
from utils.check import *
from utils.header import auth_header, get_token_from_header
from utils.response import res_error
from db_model import *
from db_model.db_query import *
from routes.restaurant.models import *
from routes.restaurant.services import *


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

        # some validation
        is_valid, msg = is_valid_restaurant_info(args)
        if not is_valid:
            return res_error(400, msg)

        # Check if email or ABN is already registered
        if get_restaurant_by_email(args['email']):
            return res_error(400, 'Email already exists')

        if get_restaurant_by_abn(args['abn']):
            return res_error(400, 'ABN already exists')

        # Save uploaded images
        url_img1 = save_image(args['image1'])
        url_img2 = save_image(args['image2'])
        url_img3 = save_image(args['image3'])

        if not url_img1 or not url_img2 or not url_img3:
            return res_error(400, 'Unsupported files for images')

        # Create new restaurant
        new_restaurant = Restaurant(
            email = args['email'],
            password = args['password'],
            phone = args['phone'],
            name = args['name'],
            address = args['address'],
            suburb = args['suburb'],
            state = State(args['state']),
            postcode = args['postcode'],
            abn = args['abn'],
            description = args['description'],
            url_img1 = url_img1,
            url_img2 = url_img2,
            url_img3 = url_img3,
        )

        db.session.add(new_restaurant)
        db.session.commit()

        # the application status will be pending
        return {'message': 'Registration Success'}, 200


@api.route('/update')
class RestaurantUpdate(Resource):
    @api.expect(auth_header, update_req_parser)
    @api.response(200, 'Success')
    @api.response(400, 'Bad Request', error_res)
    @api.response(400, 'Unauthorised', error_res)
    def put(self):
        """ Restaurant update all profiles using this route, the backend may change registration status to PENDING """

        restaurant = get_restaurant_by_token(get_token_from_header(auth_header))
        if not restaurant:
            return res_error(401)

        # data
        args = update_req_parser.parse_args()

        # track the sensitive data update
        require_approval = False

        # some validation
        is_valid, msg = is_valid_restaurant_info(args)
        if not is_valid:
            return res_error(400, msg)

        if args.get('name') and args.get('name') != restaurant.name:
            restaurant.name = args['name']
            require_approval = True
        
        if args.get('email') and args.get('email') != restaurant.email:
            if get_restaurant_by_email(args['email']):
                return res_error(400, 'Email already exists')    
            restaurant.email = args['email']
        
        if args.get('password'):
            restaurant.password = args['password']
        
        if args.get('phone') and args.get('phone') != restaurant.phone:
            restaurant.phone = args['phone']

        if args.get('address') and args.get('address') != restaurant.address:
            restaurant.address = args['address']
            require_approval = True
        
        if args.get('suburb') and args.get('suburb') != restaurant.suburb:
            restaurant.suburb = args['suburb']
            require_approval = True
        
        if args.get('state') and args.get('state') != restaurant.state:
            restaurant.state = args['state']
            require_approval = True
        
        if args.get('postcode') and args.get('postcode') != restaurant.postcode:
            restaurant.postcode = args['postcode']
            require_approval = True
        
        if args.get('abn') and args.get('abn') != restaurant.abn:
            if get_restaurant_by_abn(args['abn']):
                return res_error(400, 'ABN already exists')
            restaurant.abn = args['abn']
            require_approval = True

        if args.get('description') and args.get('description') != restaurant.description:
            restaurant.description = args['description']
        
        # process images if given
        if args.get('image1'):
            url = save_image(args['image1'])
            if not url:
                return res_error(400, 'Unsupported Image File')
            restaurant.url_img1 = url
    
        if args.get("image2"):
            url = save_image(args['image2'])
            if not url:
                return res_error(400, 'Unsupported Image File')
            restaurant.url_img2 = url
        
        if args.get("image3"):
            url = save_image(args['image3'])
            if not url:
                return res_error(400, 'Unsupported Image File')
            restaurant.url_img3 = url
        
        # track the require-approval fields
        if require_approval:
            restaurant.registration_status = RegistrationStatus.PENDING
        
        db.session.commit()
        return restaurant.dict(), 200
    