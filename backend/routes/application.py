from flask_restx import Namespace, Resource, fields
from flask import request, abort
import secrets

from utils.db import db
from utils.check import *
from utils.header import auth_header
from models import *

api = Namespace('application', description='Admin works on the new driver and new restaurant application')

# admin approve or reject application:
# when the new driver or restaurant applies,
# or when the existing driver or restaurant updates some important information

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


# the admin approves or reject the PENDING application
@api.route('/<string:application_type>/<int:user_id>/<string:action>')
class ApproveApplication(Resource):
    @api.expect(auth_header)
    @api.doc(description='application_type is either driver or restaurant, user_id is the driver_id or restaurant_id, action is either approve or reject')
    def post(self, application_type, user_id, action):
        """Admin action on the application"""

        # check the application type
        if application_type not in ['driver', 'restaurant']:
            abort(400, 'Invalid application type')

        if action not in ['approve', 'reject']:
            abort(400, 'Invalid action')

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

        # approve or reject
        if action == 'reject':
            application.status = RegistrationStatus.REJECTED
            db.session.commit()
            return {'message': 'Application rejected'}
        else:
            application.status = RegistrationStatus.APPROVED
            db.session.commit()
            return {'message': 'Application approved'}
