from flask_restx import Namespace, Resource, fields, reqparse
from flask import request, abort
from werkzeug.datastructures import FileStorage
import secrets

from utils.file import save_file
from utils.db import db
from utils.check import *
from utils.header import auth_header
from models import *

api = Namespace('menu', description='Menu related operations')


# get the full menu of a restaurant
# require the restaurant_id in the param.
# each menu contains some categories,
# each category contains some items.
# the item contains boolean flag "is_available", this will be left for the frontend to handle.
@api.route('/<int:restaurant_id>')
class Menu(Resource):
    def get(self, restaurant_id):
        """Get the full menu of a restaurant"""

        restaurant = Restaurant.query.get(restaurant_id)
        if not restaurant:
            abort(404, 'Restaurant not found')

        categories = MenuCategory.query.filter_by(restaurant_id=restaurant_id).all()
        
        # write the results
        result = []
        for c in categories:
            items = MenuItem.query.filter_by(category_id=c.category_id).all()
            c_dict = c.dict()
            c_dict['items'] = [item.dict() for item in items]
            result.append(c_dict)
        
        return result


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

        token = auth_header.parse_args()['Authorization']
        restaurant = Restaurant.query.filter_by(token=token).first()
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

        token = auth_header.parse_args()['Authorization']
        restaurant = Restaurant.query.filter_by(token=token).first()
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

        token = auth_header.parse_args()['Authorization']
        restaurant = Restaurant.query.filter_by(token=token).first()
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

@api.route('/item/<int:category_id>')
class CreateMenuItem(Resource):
    @api.expect(auth_header, new_item_parser)
    def post(self, category_id):
        """Restaurant creates a new menu item under a category"""

        # Authentication
        token = request.headers.get('Authorization')
        restaurant = Restaurant.query.filter_by(token=token).first()
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
        url_img = save_file(img_file)

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
