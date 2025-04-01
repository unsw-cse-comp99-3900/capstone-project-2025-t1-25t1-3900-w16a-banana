"""Flask-restx model for Search APIs"""
from flask_restx import Namespace, reqparse

api = Namespace(
    'search', 
    description='APIs for search DB for General Info. This does not require token'
)

# ADD MORE FILTER
search_menu_req_parser = reqparse.RequestParser()
search_menu_req_parser.add_argument('restaurant_name', type=str, required=False)
search_menu_req_parser.add_argument('menu_name', type=str, required=False)

# ADD MORE FILTER: Rating, Distance
search_restaurant_req_parser = reqparse.RequestParser()
search_restaurant_req_parser.add_argument('restaurant_name', type=str, required=False)
