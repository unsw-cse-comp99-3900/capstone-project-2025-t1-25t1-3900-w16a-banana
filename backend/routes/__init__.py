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
from routes.query import api as query_api
from routes.test import api as test_api
from routes.profile.routes import api as profile_api

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
api.add_namespace(query_api)
api.add_namespace(test_api)
api.add_namespace(profile_api)
