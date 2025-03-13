from flask_restx import Namespace, Resource, fields, reqparse
from flask import request, abort
from werkzeug.datastructures import FileStorage
import secrets

from utils.db import db
from utils.file import save_image
from utils.check import *
from utils.header import auth_header, check_token
from models import *

api = Namespace('restaurant', description='APIs for Restaurants')
    

# Login routes are in separate api

# restaurant registration
# those will be in 'request.form'
register_parser = reqparse.RequestParser()
register_parser.add_argument('email', type=str, required=True, default="example@domain.com", help="Email is required")
register_parser.add_argument('password', type=str, required=True, default="SecurePassword12!@", help="Password is required")
register_parser.add_argument('phone', type=str, required=True, default="0412345678", help="Phone (04xxxxxxxx)")
register_parser.add_argument('name', type=str, required=True, default="A Restaurant", help="Restaurant Name")
register_parser.add_argument('address', type=str, required=True, default="111 Street", help="Address")
register_parser.add_argument('suburb', type=str, required=True, default="State", help="Suburb")
register_parser.add_argument('state', type=str, required=True, default="NSW", help="State (ACT, NSW, NT, QLD, SA, TAS, VIC, WA)")
register_parser.add_argument('postcode', type=str, required=True, default="2000", help="Postcode (4 digits)")
register_parser.add_argument('abn', type=str, required=True, default="12345678901", help="ABN (11 digits)")
register_parser.add_argument('description', type=str, required=True, default="A good restaurant", help="Restaurant Description")

# those will be in 'request.files'
register_parser.add_argument("image1", type=FileStorage, location="files", required=True, help="First restaurant image")
register_parser.add_argument("image2", type=FileStorage, location="files", required=True, help="Second restaurant image")
register_parser.add_argument("image3", type=FileStorage, location="files", required=True, help="Third restaurant image")

@api.route('/register')
class RegisterRestaurant(Resource):
    # The frontend will send using form-data since we have both text fields and file uploads
    @api.expect(register_parser)
    def post(self):
        """Register a new restaurant account"""

        args = register_parser.parse_args()
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

        # Ensure all three images are uploaded and in correct extension
        if not image1 or not image2 or not image3:
            abort(400, 'Please upload all three restaurant images')

        # Save uploaded images
        url_img1 = save_image(image1)
        url_img2 = save_image(image2)
        url_img3 = save_image(image3)

        if not url_img1 or not url_img2 or not url_img3:
            abort(400, 'Unsupported files for images')

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


###############################################################################################
# for the update profile, we group the attributes into non-approval needed and approval needed
# the non-approval needed attributes can be updated without admin approval,
# and approval needed attributes (only for driver and restaurant) need admin approval.

# all customer attributes can be updated without admin approval

# for restaurant:
# non approval needed: email, password, phone, url_img1, url_img2, url_img3, description
# approval needed: name, address, suburb, state, postcode, abn
###############################################################################################

# Restaurant update no approval model
update_no_approval_parser = reqparse.RequestParser()
update_no_approval_parser.add_argument('email', type=str, required=True, help="Email is required")
update_no_approval_parser.add_argument('password', type=str, required=True, help="Password is required")
update_no_approval_parser.add_argument('phone', type=str, required=True, help="Phone number (04xxxxxxxx)")
update_no_approval_parser.add_argument('description', type=str, required=True, help="Restaurant description")

# may update the images
update_no_approval_parser.add_argument('image1', type=FileStorage, location='files', required=False, help="First image")
update_no_approval_parser.add_argument('image2', type=FileStorage, location='files', required=False, help="Second image")
update_no_approval_parser.add_argument('image3', type=FileStorage, location='files', required=False, help="Third image")

@api.route('/update/non-approval')
class RestaurantNonApprovalUpdate(Resource):
    @api.expect(auth_header, update_no_approval_parser)
    def put(self):
        """Restaurant updates profile (email, password, phone, images, description) - No admin approval needed"""

        args = update_no_approval_parser.parse_args()
        
        # Authenticate restaurant
        restaurant = check_token(auth_header, Restaurant)
        if not restaurant:
            abort(401, 'Unauthorized')

        # Validate phone number
        if 'phone' in args and not is_valid_phone(args['phone']):
            abort(400, 'Invalid phone number')

        # Validate unique email
        if 'email' in args:
            is_email_exist = Restaurant.query.filter_by(email=args['email']) \
                .filter(Restaurant.restaurant_id != restaurant.restaurant_id).first()
            if is_email_exist:
                abort(400, 'Email already exists')

        # Process and save image uploads
        if args['image1']:
            restaurant.url_img1 = save_image(args['image1'])
        if args['image2']:
            restaurant.url_img2 = save_image(args['image2'])
        if args['image3']:
            restaurant.url_img3 = save_image(args['image3'])

        # Update restaurant attributes
        for key, value in args.items() and key not in ['image1', 'image2', 'image3']:
            setattr(restaurant, key, value)

        db.session.commit()
        return restaurant.dict(), 200



# for the restaurant, the attributes that need admin approval are:
# name, address, suburb, state, postcode, abn
# use a json model
update_approval_model = api.model('RestaurantModel', {
    'name': fields.String(required=True, description='Name'),
    'address': fields.String(required=True, description='Address'),
    'suburb': fields.String(required=True, description='Suburb'),
    'state': fields.String(required=True, description='State'),
    'postcode': fields.String(required=True, description='Postcode (4 digits)'),
    'abn': fields.String(required=True, description='ABN (11 digits)')
})

@api.route('/update/require-approval')
class RestaurantUpdateRequireApproval(Resource):
    @api.expect(auth_header, update_approval_model)
    def put(self):
        """Restaurant updates his profile, admin approval needed"""

        restaurant = check_token(auth_header, Restaurant)
        if not restaurant:
            abort(401, 'Unauthorized')

        # data
        data = request.json

        if 'abn' in data and not is_valid_abn(data['abn']):
            abort(400, 'Invalid ABN')

        if 'postcode' in data and not is_valid_postcode(data['postcode']):
            abort(400, 'Invalid postcode')

        if 'state' in data and not is_valid_state(data['state']):
            abort(400, 'Invalid state')

        # update the restaurant
        for key, value in data.items():
            setattr(restaurant, key, value)
        
        # set to pending
        restaurant.status = RegistrationStatus.PENDING
        db.session.commit()

        return restaurant.dict(), 200


# A restaurant can create a new menu category,
# or update the existing menu category name
# or delete the existing menu category.
# require the restaurant token in the auth_header variable
category_model = api.model('Category', {
    'name': fields.String(required=True, description='The menu category name')
})

@api.route('/category')
class MenuCategoryAction(Resource):
    @api.expect(auth_header, category_model)
    def post(self):
        """Restaurant creates a new menu category"""

        restaurant = check_token(auth_header, Restaurant)
        if not restaurant:
            abort(401, 'Unauthorized')

        # get data
        data = request.json
        name = data['name']

        category = MenuCategory.query.filter_by(restaurant_id=restaurant.restaurant_id, name=name).first()
        if category:
            abort(400, 'Category already exists')

        category = MenuCategory(restaurant_id=restaurant.id, name=name)
        db.session.add(category)
        db.session.commit()
        
        return category.dict()

@api.route('/category/<int:category_id>')
class MenuCategoryModify(Resource):
    @api.expect(auth_header, category_model)
    def put(self, category_id):
        """Restaurant updates an existing menu category name"""

        restaurant = check_token(auth_header, Restaurant)
        if not restaurant:
            abort(401, 'Unauthorized')

        category = MenuCategory.query.filter_by(restaurant_id=restaurant.restaurant_id, category_id=category_id).first()
        if not category:
            abort(404, 'Category not found')

        new_name = api.payload['name']
        existing_category = MenuCategory.query.filter_by(restaurant_id=restaurant.restaurant_id, name=new_name).first()
        if existing_category:
            abort(400, 'Category name already exists')

        category.name = new_name
        db.session.commit()

        return category.dict(), 200


    @api.expect(auth_header)
    def delete(self, category_id):
        """Restaurant deletes an existing menu category"""

        restaurant = check_token(auth_header, Restaurant)
        if not restaurant:
            abort(401, 'Unauthorized')

        category = MenuCategory.query.filter_by(restaurant_id=restaurant.restaurant_id, category_id=category_id).first()
        if not category:
            abort(404, 'Category not found')

        db.session.delete(category)
        db.session.commit()

        return {'message': 'Category deleted successfully'}, 200


# Restaurant handle menu item, inside a menu category
# create, update, delete
# menu item: name, description, price, one img file, is_available
# for simplicity, only allow to handle one menu item at a time.
new_item_parser = reqparse.RequestParser()
new_item_parser.add_argument('name', type=str, required=True, help='Menu item name')
new_item_parser.add_argument('description', type=str, required=True, help='Menu item description')
new_item_parser.add_argument('price', type=float, required=True, help='Menu item price')
new_item_parser.add_argument('is_available', type=bool, required=True, help='Menu item availability (true/false)')
new_item_parser.add_argument('img', type=FileStorage, location='files', required=True, help='Menu item image file')

# parser for updating an existing menu item.
# all the required is False now.
update_item_parser = reqparse.RequestParser()
update_item_parser.add_argument('name', type=str, required=False, help='Updated menu item name')
update_item_parser.add_argument('description', type=str, required=False, help='Updated menu item description')
update_item_parser.add_argument('price', type=float, required=False, help='Updated menu item price')
update_item_parser.add_argument('is_available', type=bool, required=False, help='Menu item availability (true/false)')
update_item_parser.add_argument('img', type=FileStorage, location='files', required=False, help='New menu item image file')

@api.route('/item/<int:category_id>')
class ManageMenuItem(Resource):
    @api.expect(auth_header, new_item_parser)
    def post(self, category_id):
        """Restaurant creates a new menu item under a category"""

        # Authentication
        restaurant = check_token(auth_header, Restaurant)
        if not restaurant:
            abort(401, "Unauthorized")

        args = new_item_parser.parse_args()

        category = MenuCategory.query.filter_by(
            restaurant_id=restaurant.restaurant_id,
            category_id=category_id
        ).first()

        if not category:
            abort(404, "Category not found")

        # Validate duplicate item names
        if MenuItem.query.filter_by(category_id=category_id, item_name=args['name']).first():
            abort(400, "Item name already exists")

        # Save image
        img_file = request.files.get('img')
        url_img = save_image(img_file)

        # Create the new menu item
        new_item = MenuItem(
            category_id=category_id,
            item_name=args['name'],
            item_description=args['description'],
            item_price=args['price'],
            url_img=url_img,
            is_available=args['is_available']
        )

        db.session.add(new_item)
        db.session.commit()

        return new_item.dict(), 200
    
    @api.expect(auth_header, update_item_parser)
    def put(self, item_id):
        """Update existing menu item attributes (can update any provided fields)"""

        token = auth_header.parse_args()['Authorization']
        restaurant = Restaurant.query.filter_by(token=token).first()
        if not restaurant:
            abort(401, 'Unauthorized')

        item = MenuItem.query.join(MenuCategory).filter(
            MenuCategory.restaurant_id == restaurant.restaurant_id,
            MenuItem.item_id == item_id
        ).first()

        if not item:
            abort(404, 'Menu item not found')

        args = update_item_parser.parse_args()

        # Check and update fields if provided
        for field in ['name', 'description', 'price', 'is_available']:
            if args[field]:
                setattr(item, field, args[field])

        if args['img']:
            item.url_img = save_image(args['img'])

        db.session.commit()

        return item.dict(), 200
    
    @api.expect(auth_header)
    def delete(self, item_id):
        """Restaurant disable a menu item: turn the is_available to False"""

        restaurant = check_token(auth_header, Restaurant)
        if not restaurant:
            abort(401, 'Unauthorized')

        item = MenuItem.query.join(MenuCategory).filter(
            MenuCategory.restaurant_id == restaurant.restaurant_id,
            MenuItem.item_id == item_id
        ).first()

        if not item:
            abort(404, 'Menu item not found')

        item.is_available = False
        db.session.commit()

        return {'message': 'Menu item deleted successfully'}, 200
