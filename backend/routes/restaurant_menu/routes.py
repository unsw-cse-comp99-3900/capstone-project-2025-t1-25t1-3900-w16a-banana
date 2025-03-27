from flask_restx import Resource
from flask import request
import secrets

from utils.db import db
from utils.file import save_image
from utils.check import *
from utils.header import auth_header, tokenize
from utils.response import res_error
from db_model import *
from db_model.db_query import *
from routes.restaurant_menu.models import *
from routes.restaurant_menu.services import *

# A restaurant can create a new menu category,
# or update the existing menu category name
# or delete the existing menu category.
# require the restaurant token in the auth_header variable

@api.route('/categories')
class MenuCategories(Resource):
    @api.expect(auth_header)
    @api.response(200, "Success", get_menu_categories_res)
    @api.response(400, "Unauthorised", error_res)
    def get(self):
        """Get all menu categories"""
        # Authenticate
        restaurant = get_restaurant_by_token(tokenize(request.headers))
        if not restaurant:
            return res_error(401)

        # Get every categories
        categories = filter_menu_categories(restaurant_id = restaurant.id)

        return {"categories": [category.dict() for category in categories]}, 200


@api.route('/category/new')
class NewMenuCategory(Resource):
    @api.expect(auth_header, post_menu_category_req)
    @api.response(200, "Success", menu_category_res)
    @api.response(400, "Bad Request ", error_res)
    @api.response(401, "Unauthorised", error_res)
    def post(self):
        """Restaurant creates a new menu category"""
        # Authenticate
        restaurant = get_restaurant_by_token(tokenize(request.headers))
        if not restaurant:
            return res_error(401)

        name = request.json['name']

        # Check for duplicate name
        if filter_menu_categories(
            restaurant_id = restaurant.id,
            name = name
        ):
            return res_error(400, 'Category already exists')

        # Make and commit new category
        category = MenuCategory(
            restaurant_id=restaurant.id,
            name=name
        )
        db.session.add(category)
        db.session.commit()
        
        return category.dict(), 200

@api.route('/category/<int:category_id>')
class MenuCategoryUpdate(Resource):
    @api.expect(auth_header, update_menu_category_req)
    @api.response(200, "Success", menu_category_res)
    @api.response(400, "Bad Request ", error_res)
    @api.response(401, "Unauthorised", error_res)
    @api.response(404, "Not Found", error_res)
    def put(self, category_id):
        """Restaurant updates an existing menu category name"""

        # Authenticate
        restaurant = get_restaurant_by_token(tokenize(request.headers))
        if not restaurant:
            return res_error(401)

        # Check Category
        categories = filter_menu_categories(
            restaurant_id = restaurant.id,
            category_id = category_id
        )
        if not categories:
            return res_error(404, "Category not found")
        category = categories[0]
        new_name = request.json['name']

        # Check for duplicate name
        if filter_menu_categories(
            restaurant_id = restaurant.id,
            name = new_name
        ):
            return res_error(400, 'Category name already exists')

        # Update and commit
        category.name = new_name
        db.session.commit()

        return category.dict(), 200

    @api.expect(auth_header)
    def delete(self, category_id):
        """Restaurant deletes an existing menu category"""

        # Autheticate
        restaurant = get_restaurant_by_token(tokenize(request.headers))
        if not restaurant:
            return res_error(401)

        # Check Category
        categories = filter_menu_categories(
            restaurant_id = restaurant.id,
            id = category_id
        )
        if not categories:
            return res_error(404, "Category not found")

        # Update and commit
        db.session.delete(categories[0])
        db.session.commit()

        return {'message': 'Category deleted successfully'}, 200


@api.route('/items')
class GetAllItemsInRestaurant(Resource):
    @api.expect(auth_header)
    @api.response(200, 'list of items', get_all_items_res)
    def get(self):
        """Get all items in category"""
        # Check restaurant
        restaurant = get_restaurant_by_token(tokenize(request.headers))
        if not restaurant:
            return res_error(401)

        # Get items in the restaurant
        items = filter_menu_from_restaurant(
            restaurant_id = restaurant.id,
            first_only = False 
        )

        return {'items': [item.dict() for item in items]}, 200


@api.route('/items/<int:category_id>')
class GetAllItemsInCategory(Resource):
    """Route: /items/<int:category_id>"""
    @api.expect(auth_header)
    @api.response(200, 'list of items', get_all_items_res)
    def get(self, category_id):
        """Get all items in category"""
        # Check restaurant
        restaurant = get_restaurant_by_token(tokenize(request.headers))
        if not restaurant:
            return res_error(401)

        # Check Category
        categories = filter_menu_categories(
            restaurant_id = restaurant.id,
            id = category_id
        )
        if not categories:
            return res_error(404, "Category not found")

        # Get items in the category
        items = filter_menu_items(category_id = categories[0].id)

        return {'items': [item.dict() for item in items]}, 200

@api.route('/item/new/<int:category_id>')
class NewMenuItem(Resource):
    @api.expect(auth_header, post_item_req_parser)
    @api.response(200, 'New Item Data')
    @api.response(400, "Bad Request ", error_res)
    @api.response(401, "Unauthorised", error_res)
    @api.response(404, "Not Found", error_res)
    def post(self, category_id):
        """Restaurant creates a new menu item under a category"""

        # Authenticate
        restaurant = get_restaurant_by_token(tokenize(request.headers))
        if not restaurant:
            return res_error(401)

        args = post_item_req_parser.parse_args()

        # Check category
        categories = filter_menu_categories(
            restaurant_id = restaurant.id,
            id = category_id
        )
        if not categories:
            return res_error(404, "Category not found")

        # Check duplicate name
        if filter_menu_from_restaurant(
            restaurant_id = restaurant.id,
            name = args['name'],
            first_only = True
        ):
            return res_error(400, "Item name already exists")

        # Check for right string for availability
        if args['is_available'] != 'true' and\
            args['is_available'] != 'false':
            return res_error(400, "Availability Must be 'true' or 'false'")

        # Save image
        img_file = request.files.get('img')
        url_img = save_image(img_file)
        if not url_img:
            return res_error(400, 'Unsupported Image File')

        # Create the new menu item
        new_item = MenuItem(
            category_id=category_id,
            name=args['name'],
            description=args['description'],
            price=args['price'],
            url_img=url_img,
            is_available=True if str(args['is_available']) == 'true' else False
        )

        # Push and commit
        db.session.add(new_item)
        db.session.commit()

        return new_item.dict(), 200

@api.route('/item/<int:menu_id>')
class ManageMenuItem(Resource):
    @api.expect(auth_header, update_item_req_parser)
    @api.response(200, 'Updated Item Data')
    @api.response(400, "Bad Request ", error_res)
    @api.response(401, "Unauthorised", error_res)
    @api.response(404, "Not Found", error_res)
    def put(self, menu_id):
        """Update existing menu item attributes (can update any provided fields)"""

        # Authenticate
        restaurant = get_restaurant_by_token(tokenize(request.headers))
        if not restaurant:
            return res_error(401)

        # Get specific item
        item = filter_menu_from_restaurant(
            restaurant_id = restaurant.id,
            menu_id = menu_id,
            first_only = True
        )
        if not item:
            return res_error(404, 'Menu item not found')

        args = update_item_req_parser.parse_args()

        # Update Image. Check If files saved
        if args['img']:
            url_img = save_image(args['img'])
            if not url_img:
                return res_error(400, "Unsupported Image File")
            item.url_img = save_image(args['img'])

        # Update Name. Check if name conflicts
        if args['name']:
            if filter_menu_from_restaurant(
                restaurant_id = restaurant.id,
                name = args['name'],
                first_only = True
        )   :
                return res_error(400, "Duplicate Item Name")
            item.name = args['name']

        # Check and update fields if provided
        for field in ['description', 'price']:
            if args[field]:
                setattr(item, field, args[field])

        if args['is_available']:
            if args['is_available'] != 'true' and\
            args['is_available'] != 'false':
                return res_error(400, "Availability Must be 'true' or 'false'")
            item.is_available=True if str(args['is_available']) == 'true' else False

        db.session.commit()
        return item.dict(), 200

    @api.expect(auth_header)
    @api.response(200, 'Simple message JSON for success')
    @api.response(400, "Bad Request ", error_res)
    @api.response(401, "Unauthorised", error_res)
    @api.response(404, "Not Found", error_res)
    def delete(self, menu_id: int):
        """Delete a menu item permenantly"""
        # Authenticate
        restaurant = get_restaurant_by_token(tokenize(request.headers))
        if not restaurant:
            return res_error(401)

        # Get specific item
        item = filter_menu_from_restaurant(
            restaurant_id = restaurant.id,
            menu_id = menu_id,
            first_only = True
        )
        if not item:
            return res_error(404, 'Menu item not found')

        # Delete and commit
        db.session.delete(item)
        db.session.commit()

        return {'message': 'Menu item deleted successfully'}, 200