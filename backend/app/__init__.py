from flask import Flask, jsonify
from flask_cors import CORS
from flask_restx import Api

# Import routes
from app.routes.test_routes import test_ns


# restx for swagger
api = Api(
    version = "1.0",
    title="COMP3900 P75 API",
    doc="/" # Show document on root page
)

def create_app():
    """Factory function to create and configure the Flask app"""

    # Flask
    app = Flask(__name__)
    
    # CORS
    CORS(app)

    # restx
    api.init_app(app)

    # TODO: Register Blueprints (routes)
    
    # This attaches the route that is defined in another file.
    # path="/api/test" makes any route in this file to have prefix "/api/test" 
    api.add_namespace(test_ns, path="/api/test")

    return app
