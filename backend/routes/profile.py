from flask_restx import Namespace, Resource, fields
from flask import request, abort

from utils.db import db 
from models import User

api = Namespace('profile', description='Profile related operations')

# a test route
@api.route('/test')
class Test(Resource):
    def get(self):
        # get all the users
        users = User.query.all()
        return [user.dict() for user in users]