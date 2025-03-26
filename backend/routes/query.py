from flask_restx import Namespace, Resource, fields, reqparse
from flask import request, abort
from werkzeug.datastructures import FileStorage
import secrets

from utils.db import db
from utils.file import save_image
from utils.check import *
from utils.header import auth_header
from db_model import *


api = Namespace('query', description='APIs for querying DB for General Info')

# get the full menu of a restaurant
# require the restaurant_id in the param.
# each menu contains some categories,
# each category contains some items.
# the item contains boolean flag "is_available", this will be left for the frontend to handle.
@api.route('/menus/<int:restaurant_id>')
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