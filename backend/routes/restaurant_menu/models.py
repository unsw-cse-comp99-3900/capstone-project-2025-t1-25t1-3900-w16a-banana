""""Flask-restx model for Restaurant-Menu APIs"""
from flask_restx import Namespace, fields, reqparse
from werkzeug.datastructures import FileStorage

api = Namespace('restaurant-menu', description='APIs for Restaurant Menus')


# Simple Message Response
message_res = api.model("Error", {
    "message": fields.String(description="Descriptive Message", example="Message Here")
})

# Basic Menu Category Structure
menu_category_model = api.model('Category Basic Structure', {
    'id': fields.Integer(description='Category ID'),
    'restaurant_id': fields.Integer(description='Restaurant ID'),
    'name': fields.String(description='The menu category name')
})

# Request for post menu categories
post_menu_category_req = api.model('New Category', {
    'name': fields.String(required=True, description='Menu category name')
})

# Request for update menu categories
update_menu_category_req = api.model('Update Category', {
    'name': fields.String(required=True, description='Menu category name')
})


"""
# Restaurant handle menu item, inside a menu category
# create, update, delete
# menu item: name, description, price, one img file, is_available
# for simplicity, only allow to handle one menu item at a time."
"""

# Basic structure of Menu Item
menu_item_model = api.model('Item Basic Structure', {
    'id': fields.Integer(description='Restaurant ID'),
    'category_id': fields.Integer(description='Category ID'),
    'name': fields.String(description='Item name'),
    'description': fields.String(description='Item Description'),
    'price': fields.Float(description='Item Price'),
    'url_img': fields.String(description='Item Image URL'),
    'is_available': fields.Boolean(description='Item Availability'),
})

get_all_items_by_category_res = api.model('Get All Menus in restaurant', {
    'items': fields.List(fields.Nested(menu_item_model), description='List of menu items'),
    'category_id': fields.Integer(description='Category ID')
})


# Request for post item
post_item_req_parser = reqparse.RequestParser()
post_item_req_parser.add_argument('name', type=str, required=True, help='Menu item name')
post_item_req_parser.add_argument(
    'description', type=str, required=True, help='Menu item description'
)
post_item_req_parser.add_argument('price', type=float, required=True, help='Menu item price')
post_item_req_parser.add_argument(
    'is_available', type=str, required=True, help='Menu item availability (true/false)'
)
post_item_req_parser.add_argument(
    'img', type=FileStorage, location='files', required=True, help='Menu item image file'
)

# "Request for update item
update_item_req_parser = reqparse.RequestParser()
update_item_req_parser.add_argument('name', type=str, required=False, help='Updated menu item name')
update_item_req_parser.add_argument(
    'description', type=str, required=False, help='Updated menu item description'
)
update_item_req_parser.add_argument(
    'price', type=float, required=False, help='Updated menu item price'
)
update_item_req_parser.add_argument(
    'is_available', type=str, required=False, help='Menu item availability (true/false)'
)
update_item_req_parser.add_argument(
    'img', type=FileStorage, location='files', required=False, help='New menu item image file'
)
