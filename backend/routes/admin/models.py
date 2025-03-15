from flask_restx import Namespace, fields

api = Namespace('admin', description='APIs for Adminstrators')

"""Error Response"""
error_res= api.model("Error", {
    "message": fields.String(description="Error message", example="Error Description")
})

"""Response/Request for admin register"""
register_req = api.model("Admin Register Request", {
    'email': fields.String(required=True, description='Email', default="admin@gmail.com"),
    'password': fields.String(required=True, description='Password', default="StrongPass12!@"),
    'first_name': fields.String(required=True, description='First Name', default="John"),
    'last_name': fields.String(required=True, description="Last Name", default="Doe")
})
register_res = api.model("Admin Register Reponse", {
    "message": fields.String(description="Success Message", example="Success")
})