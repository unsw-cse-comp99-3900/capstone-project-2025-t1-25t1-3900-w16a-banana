from flask_restx import Resource
from flask import request

from utils.db import db
from utils.check import *
from utils.file import save_file
from utils.header import auth_header, tokenize
from utils.response import res_error
from db_model import *
from db_model.db_query import get_admin_by_token
from routes.admin.models import *

# Adding new admin TODO: Might have to add some security feature
@api.route('/register')
class AdminRegister(Resource):
    @api.expect(register_req)
    @api.response(200, "Success", register_res)
    @api.response(400, "Bad Request", error_res)
    @api.response(401, "Unauthorised", error_res)
    def post(self):
        """ Register a new admin account """

        data = request.json

        is_password_okay, description = is_password_safe(data['password'])
        if not is_password_okay:
            return res_error(400, description)

        is_email_exist = Admin.query.filter_by(email=data['email']).first()
        if is_email_exist:
            return res_error(400, 'Email already exist')

        new_admin = Admin(
            email=data['email'],
            password=data['password'],
            first_name=data['first_name'],
            last_name=data['last_name']
        )

        db.session.add(new_admin)
        db.session.commit()

        # return the new customer object
        return {'message': 'Registration Success'}, 200


@api.route("/update")
class AdminUpdate(Resource):
    @api.expect(auth_header, update_req_parser)
    @api.response(200, "Success")
    @api.response(400, "Bad Request", error_res)
    def put(self):
        """ Admin can update his first_name, last_name, email, password, profile image """

        admin = get_admin_by_token(tokenize(request.headers))
        if not admin:
            return res_error(401)

        args = update_req_parser.parse_args()

        if args.get('email'):
            is_email_exist = Admin.query.filter_by(email=args['email']) \
                .filter(Admin.id != admin.id).first()
            if is_email_exist:
                return res_error(400, 'Email already exists')
            admin.email = args["email"]

        if args.get('password'):
            is_password_okay, description = is_password_safe(args['password'])
            if not is_password_okay:
                return res_error(400, description)
            admin.password = args["password"]

        if args.get('first_name'):
            admin.first_name = args['first_name']

        if args.get('last_name'):
            admin.last_name = args['last_name']

        if args['profile_image']:
            url = save_file(args['profile_image'])
            if not url:
                return res_error(400, "Invalid Image File")
            
            admin.url_profile_image = url

        # save the changes
        db.session.commit()
        return admin.dict(), 200


# admin approve or reject application:
# when the new driver or restaurant applies,
# or when the existing driver or restaurant updates some important information

# the admin obtains all PENDING applications
# choose between the driver and restaurant
@api.doc(params={'application_type': 'Either restaurant or driver'})
@api.route('/pending/<string:application_type>')
class PendingApplications(Resource):
    @api.expect(auth_header)
    @api.response(200, "All Data for Restaurant OR Driver")
    @api.response(400, "Bad Request", error_res)
    @api.response(401, "Unauthorised", error_res)
    def get(self, application_type: str):
        """Admin obtains all PENDING applications, enter either driver or restaurant"""

        # check the application type
        if application_type not in ['driver', 'restaurant']:
            return res_error(400, 'Invalid application type')

        # check the token
        admin = get_admin_by_token(tokenize(request.headers))
        if not admin:
            return res_error(401)

        # get the pending applications
        if application_type == 'driver':
            applications = Driver.query.filter_by(registration_status=RegistrationStatus.PENDING).all()
        else:
            applications = Restaurant.query.filter_by(registration_status=RegistrationStatus.PENDING).all()

        # return the dicts
        return [application.dict() for application in applications]


# the admin approves or reject the PENDING application
@api.route('/<string:application_type>/<int:user_id>/<string:action>')
@api.doc(params={
    "application_type": "driver or restaurant",
    "user_id": "specific user id of given type",
    "action": "approve or reject"
})
class ApproveApplication(Resource):
    @api.doc(description='application_type is either driver or restaurant, user_id is the driver_id or restaurant_id, action is either approve or reject')
    @api.expect(auth_header)
    @api.response(400, "Bad Request", error_res)
    @api.response(401, "Unauthorised", error_res)
    def post(self, application_type, user_id, action):
        """Admin action on the application"""

        # check the token
        admin = get_admin_by_token(tokenize(request.headers))
        if not admin:
            return res_error(401, 'Unauthorized')

        # check the application type
        if application_type not in ['driver', 'restaurant']:
            return res_error(400, 'Invalid application type')

        if action not in ['approve', 'reject']:
            return res_error(400, 'Invalid action')
        
        # get the application
        if application_type == 'driver':
            application = Driver.query.filter_by(
                driver_id=user_id,
                registration_status=RegistrationStatus.PENDING
            ).first()
        else:
            application = Restaurant.query.filter_by(
                restaurant_id=user_id,
                registration_status=RegistrationStatus.PENDING
            ).first()

        if not application:
            return res_error(400, 'Invalid application')

        # approve or reject
        if action == 'reject':
            application.registration_status = RegistrationStatus.REJECTED
            db.session.commit()
            return {'message': 'Application rejected'}
        else:
            application.registration_status = RegistrationStatus.APPROVED
            db.session.commit()
            return {'message': 'Application approved'}
