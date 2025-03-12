from flask_restx import Api 
from routes.admin import api as admin_api
from routes.auth import api as auth_api
from routes.customer import api as customer_api 
from routes.driver import api as driver_api
from routes.restaurant import api as restaurant_api
from routes.query import api as query_api
from routes.files import api as files_api

api = Api(
    version = "1.0",
    title="COMP3900 P75 API",
    validate=True
)

# register the name spaces
api.add_namespace(admin_api)
api.add_namespace(auth_api)
api.add_namespace(customer_api)
api.add_namespace(driver_api)
api.add_namespace(restaurant_api)
api.add_namespace(query_api)
api.add_namespace(files_api)
