from flask_restx import Namespace, Resource, fields
from flask import request, abort
import secrets

from utils.db import db
from utils.check import *
from utils.header import auth_header
from models import *

api = Namespace('application', description='Admin works on the new driver and new restaurant application')


# the admin obtains all PENDING applications
# choose between the driver and restaurant
@api.route('/pending/<string:application_type>')
class PendingApplications(Resource):
    @api.expect(auth_header)
    def get(self, application_type):
        """Admin obtains all PENDING applications, enter either driver or restaurant"""

        # check the application type
        if application_type not in ['driver', 'restaurant']:
            abort(400, 'Invalid application type')

        # check the token
        token = auth_header.parse_args()['Authorization']
        admin = Admin.query.filter_by(token=token).first()
        if not admin:
            abort(401, 'Unauthorized')

        # get the pending applications
        if application_type == 'driver':
            applications = Driver.query.filter_by(status=RegistrationStatus.PENDING).all()
        else:
            applications = Restaurant.query.filter_by(status=RegistrationStatus.PENDING).all()

        # return the dicts
        return [application.dict() for application in applications]


# the admin approves the application
@api.route('/approve/<string:application_type>/<int:user_id>')
class ApproveApplication(Resource):
    @api.expect(auth_header)
    def post(self, application_type, user_id):
        """Admin approves the application, enter either driver or restaurant, and use the driver_id or restaurant_id"""

        # check the application type
        if application_type not in ['driver', 'restaurant']:
            abort(400, 'Invalid application type')

        # check the token
        token = auth_header.parse_args()['Authorization']
        admin = Admin.query.filter_by(token=token).first()
        if not admin:
            abort(401, 'Unauthorized')

        # get the application
        if application_type == 'driver':
            application = Driver.query.filter_by(id=user_id, status=RegistrationStatus.PENDING).first()
        else:
            application = Restaurant.query.filter_by(id=user_id, status=RegistrationStatus.PENDING).first()

        if not application:
            abort(400, 'Invalid application')

        # approve the application
        application.status = RegistrationStatus.APPROVED
        db.session.commit()

        return {'message': 'Application approved'}
