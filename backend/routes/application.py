from flask_restx import Namespace, Resource, fields
from flask import request, abort
import secrets

from utils.db import db
from utils.file import save_file
from utils.check import *
from models import *

api = Namespace('application', description='Admin works on the new driver and new restaurant application')

@api.route('/test')
class Test(Resource):
    def get(self):
        return 'test'