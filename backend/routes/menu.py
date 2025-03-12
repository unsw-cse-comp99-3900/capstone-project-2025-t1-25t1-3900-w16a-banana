from flask_restx import Namespace, Resource, fields
from flask import request, abort
import secrets

from utils.db import db
from utils.check import *
from utils.header import auth_header
from models import *

api = Namespace('menu', description='Menu related operations')

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







