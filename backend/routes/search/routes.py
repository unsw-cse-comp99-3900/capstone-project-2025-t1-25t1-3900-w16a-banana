"""General Search APIs"""
from flask_restx import Resource
from utils.response import res_error
from db_model import Restaurant, MenuItem, MenuCategory
from routes.search.models import (
    api,
    search_menu_req_parser,
    search_restaurant_req_parser
)

@api.route('/menu')
class SearchMenu(Resource):
    """Route: /search/menu"""
    @api.expect(search_menu_req_parser)
    def get(self):
        """Get the Full Menu list of a given Restaurant"""
        # Get the search filter
        args = search_menu_req_parser.parse_args()
        restaurant_name = args.get('restaurant_name')
        menu_name = args.get('menu_name')

        query = MenuItem.query.join(MenuCategory).join(Restaurant)

        if restaurant_name:
            query = query.filter(Restaurant.name.ilike(f"%{restaurant_name}%"))
        if menu_name:
            query = query.filter(MenuItem.name.ilike(f"%{menu_name}%"))

        menus = query.all()
        return [menu.dict() for menu in menus], 200

@api.route('/restaurant')
class SearchRestaurant(Resource):
    """Route: /search/menu"""
    @api.expect(search_restaurant_req_parser)
    def get(self):
        """Get the Full List of matching restaurant"""
        # Get the search filter
        args = search_restaurant_req_parser.parse_args()
        restaurant_name = args.get('restaurant_name')

        query = Restaurant.query

        if restaurant_name:
            query = query.filter(Restaurant.name.ilike(f"%{restaurant_name}%"))

        restaurants = query.all()
        return [restaurant.dict() for restaurant in restaurants], 200
