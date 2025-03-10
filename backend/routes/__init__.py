from flask_restx import Api 
from routes.auth import api as auth_api 
from routes.profile import api as profile_api

api = Api(
    version = "1.0",
    title="COMP3900 P75 API",
    validate=True
)

# register the name spaces
api.add_namespace(auth_api)
api.add_namespace(profile_api)
