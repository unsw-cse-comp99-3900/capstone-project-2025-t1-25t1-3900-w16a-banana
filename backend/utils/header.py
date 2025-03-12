from flask_restx import reqparse

# a Authorization token header required
auth_header = reqparse.RequestParser()
auth_header.add_argument('Authorization', location='headers', required=True, help='Authorization token')
