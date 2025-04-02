"""Utility function realted to Header of the requst"""
from flask_restx import reqparse
from werkzeug.datastructures import EnvironHeaders

# a Authorization token header required
auth_header = reqparse.RequestParser()
auth_header.add_argument(
    'Authorization', location='headers', required=True, help='Authorization token'
)

def tokenize(header: EnvironHeaders):
    """Extract the token out of the header"""
    return header.get('Authorization')
