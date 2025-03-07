from flask_restx import Namespace, Resource, fields
from flask import request, jsonify


# Namespace is used to categorize APIs.
# This name space will also be imported to __init__.py to be attached.
test_ns  = Namespace("test", description="Test API")


# Model of a namespace defines the structure of a request
test_model = test_ns.model("Test", {
    "test": fields.String(required=True, description="Sample String")
})

# This defines the route of the test namespace.
@test_ns.route("/")
class TestPage(Resource):
    @test_ns.expect(test_model) # we are expecting to receive fields as defined above
    def put(self): # Handle PUT request to "/"
        return {"message": "test success"}, 200