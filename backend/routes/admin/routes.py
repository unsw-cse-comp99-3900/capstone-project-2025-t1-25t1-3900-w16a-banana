"""Admin APIs Route"""
from flask_restx import Resource
from flask import request

from utils.db import db
from utils.check import is_password_safe
from utils.file import save_image
from utils.header import auth_header, tokenize
from utils.response import res_error
from db_model import Admin
from db_model.db_enum import RegistrationStatus
from db_model.db_query import (
    get_admin_by_token,
    filter_admins,
    filter_drivers,
    filter_restaurants,
)
from routes.admin.models import (
    api,
    message_res,
    register_req,
    register_res,
    update_req_parser,
)

@api.route('/register')
class AdminRegister(Resource):
    """Route: /register"""
    @api.expect(register_req)
    @api.response(200, "Success", register_res)
    @api.response(400, "Bad Request", message_res)
    @api.response(401, "Unauthorised", message_res)
    def post(self):
        """ Register a new admin account """

        data = request.json

        is_password_okay, description = is_password_safe(data['password'])
        if not is_password_okay:
            return res_error(400, description)

        is_email_exist = filter_admins(email=data['email'])
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
    """Route: /update"""
    @api.expect(auth_header, update_req_parser)
    @api.response(200, "Success")
    @api.response(400, "Bad Request", message_res)
    def put(self):
        """ Admin can update his first_name, last_name, email, password, profile image """

        admin = get_admin_by_token(tokenize(request.headers))
        if not admin:
            return res_error(401)

        args = update_req_parser.parse_args()

        if args.get('email') and args.get('email') != admin.email:
            is_email_exist = filter_admins(email = args['email'])
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
            url = save_image(args['profile_image'])
            if not url:
                return res_error(400, "Invalid Image File")
            admin.url_profile_image = url

        # save the changes
        db.session.commit()
        return admin.dict(), 200



@api.route('/pending/<string:user_type>')
@api.doc(params={
    "user_type": {
        'description': 'Type of a user',
        'enum': ['driver', 'restaurant'],
        'type': 'string'
    }
})
class PendingApplications(Resource):
    """Route: /pending/<string:user_type>"""
    @api.expect(auth_header)
    @api.response(200, "All Data for Restaurant OR Driver")
    @api.response(400, "Bad Request", message_res)
    @api.response(401, "Unauthorised", message_res)
    def get(self, user_type: str):
        """
        Admin obtains all PENDING applications, for either driver or restaurant.
        This happens when they newly registered or changed some important information.
        """
        # check the token
        admin = get_admin_by_token(tokenize(request.headers))
        if not admin:
            return res_error(401)

        # get the pending applications
        if user_type == 'driver':
            applications = filter_drivers(RegistrationStatus=RegistrationStatus.PENDING)
        elif user_type == 'restaurant':
            applications = filter_restaurants(RegistrationStatus=RegistrationStatus.PENDING)
        else:
            return res_error(400, 'Invalid application type')

        # return the dicts
        return [application.dict() for application in applications], 200


# the admin approves or reject the PENDING application
@api.route('/<string:user_type>/<int:user_id>/<string:action>')
@api.doc(params={
    "user_type": {
        'description': 'Type of a user',
        'enum': ['driver', 'restaurant'],
        'type': 'string'
    },
    "user_id": "specific user id of given type",
    'action': {
        'description': 'Action to perform (approve/reject)',
        'enum': ['approve', 'reject'],
        'type': 'string'
    },
})
class ApproveApplication(Resource):
    """Route: /<string:user_type>/<int:user_id>/<string:action>"""
    @api.expect(auth_header)
    @api.response(200, "Bad Request", message_res)
    @api.response(400, "Bad Request", message_res)
    @api.response(401, "Unauthorised", message_res)
    def post(self, user_type: str, user_id: int, action: str):
        """
        Admin action on the application
        'approve' or 'reject'
        """
        # check the token
        admin = get_admin_by_token(tokenize(request.headers))
        if not admin:
            return res_error(401, 'Unauthorized')

        # get the pending user 
        if user_type == 'driver':
            users = filter_drivers(
                id=user_id,
                registration_status=RegistrationStatus.PENDING
            )
        elif user_type == 'restaurant':
            users = filter_restaurants(
                id=user_id,
                registration_status=RegistrationStatus.PENDING
            )
        else:
            return res_error(400, 'Invalid application type')

        # Check if the user exists
        if not users:
            return res_error(400, 'Invalid User ID')
        user = users[0]

        # approve or reject
        if action == 'reject':
            user.registration_status = RegistrationStatus.REJECTED
            message = 'Application rejected'
        elif action == 'approve':
            user.registration_status = RegistrationStatus.APPROVED
            message = 'Application Approved'
        else:
            return res_error(400, 'Invalid action')

        db.session.commit()
        return {'message': message}, 200
