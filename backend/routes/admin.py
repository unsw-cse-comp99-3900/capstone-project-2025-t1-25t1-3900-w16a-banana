from flask_restx import Namespace, Resource, fields
from flask import request, abort
import secrets

from utils.db import db
from utils.check import *
from utils.header import auth_header, check_token
from models import *

api = Namespace('admin', description='APIs for Adminstrators')


register_model = api.model("Admin Register Model", {
    'email': fields.String(required=True, description='Email', default="admin@gmail.com"),
    'password': fields.String(required=True, description='Password', default="StrongPass12!@"),
    'first_name': fields.String(required=True, description='First Name', default="John"),
    'last_name': fields.String(required=True, description="Last Name", default="Doe")
})


# Adding new admin TODO: Might have to add some security feature
@api.route('/register')
class AdminRegister(Resource):
    def post(self):
        data = request.json

        is_email_exist = Customer.query.filter_by(email=data['email']).first()

        is_password_okay, description = is_password_safe(data['password'])
        if not is_password_okay:
            abort(400, description)

        if is_email_exist:
            abort(400, 'Email already exist')

        new_admin = Admin(
            email=data['email'],
            password=data['password'],
            first_name=data['first_name'],
            last_name=data['last_name']
        )

        db.session.add(new_admin)
        db.session.commit()

        # return the new customer object
        return new_admin.dict(), 200

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
        admin = check_token(auth_header, Admin)
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

        # check the token
        admin = check_token(auth_header, Admin)
        if not admin:
            abort(401, 'Unauthorized')

        # check the application type
        if application_type not in ['driver', 'restaurant']:
            abort(400, 'Invalid application type')

        if action not in ['approve', 'reject']:
            abort(400, 'Invalid action')
        
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
