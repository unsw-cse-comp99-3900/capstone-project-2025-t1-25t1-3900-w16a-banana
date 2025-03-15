from flask_restx import reqparse
from db_model import *
from typing import Union

# a Authorization token header required
auth_header = reqparse.RequestParser()
auth_header.add_argument('Authorization', location='headers', required=True, help='Authorization token')


# Extract token from the header
def get_token(header: reqparse.RequestParser):
    return header.parse_args()['Authorization']

# Check the token and get the existing model
def check_token(header: reqparse.RequestParser, model: Union[Admin, Customer, Driver, Restaurant]):
    token = get_token(header)
    return model.query.filter_by(token=token).first()