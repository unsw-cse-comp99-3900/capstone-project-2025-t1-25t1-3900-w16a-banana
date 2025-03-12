from flask_restx import Api 
from routes.login import api as login_api
from routes.register import api as register_api
from routes.application import api as application_api 
from routes.profile import api as profile_api
from routes.menu import api as menu_api

api = Api(
    version = "1.0",
    title="COMP3900 P75 API",
    validate=True
)

# register the name spaces
api.add_namespace(login_api)
api.add_namespace(register_api)
api.add_namespace(application_api)
api.add_namespace(profile_api)
api.add_namespace(menu_api)
