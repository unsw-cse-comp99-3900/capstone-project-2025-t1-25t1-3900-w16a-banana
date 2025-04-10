"""Module for All Routes"""
from flask_restx import Api
from routes.admin.routes import api as admin_api
from routes.auth import api as auth_api
from routes.customer.routes import api as customer_api
from routes.customer_order.routes import api as customer_order_api
from routes.driver.routes import api as driver_api
from routes.driver_order.routes import api as driver_order_api
from routes.restaurant.routes import api as restaurant_api
from routes.restaurant_menu.routes import api as restaurant_menu_api
from routes.restaurant_order.routes import api as restaurant_order_api
from routes.search.routes import api as search_api
from routes.test import api as test_api
from routes.profile.routes import api as profile_api
from routes.chat.routes import api as chat_api
from routes.report.routes import api as report_api
from routes.review.routes import api as review_api

api = Api(
    version = "1.0",
    title="COMP3900 P75 API",
    validate=True
)

# register the name spaces
api.add_namespace(admin_api)
api.add_namespace(auth_api)
api.add_namespace(customer_api)
api.add_namespace(customer_order_api)
api.add_namespace(driver_api)
api.add_namespace(driver_order_api)
api.add_namespace(restaurant_api)
api.add_namespace(restaurant_menu_api)
api.add_namespace(restaurant_order_api)
api.add_namespace(search_api)
api.add_namespace(test_api)
api.add_namespace(profile_api)
api.add_namespace(chat_api)
api.add_namespace(report_api)
api.add_namespace(review_api)
