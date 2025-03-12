from flask_restx import reqparse
from models import *
from typing import Union

# a Authorization token header required
auth_header = reqparse.RequestParser()
auth_header.add_argument('Authorization', location='headers', required=True, help='Authorization token')


def get_token(header: reqparse.RequestParser):
    return header.parse_args()['Authorization']


def check_token(header: reqparse.RequestParser, model: Union[Admin, Customer, Driver, Restaurant]):
    token = get_token(header)
    return model.query.filter_by(token=token).first()