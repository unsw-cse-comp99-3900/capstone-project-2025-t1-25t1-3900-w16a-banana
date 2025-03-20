from flask_restx import reqparse
from db_model import *
from typing import Union, Optional

# a Authorization token header required
auth_header = reqparse.RequestParser()
auth_header.add_argument('Authorization', location='headers', required=True, help='Authorization token')


# Extract token from the header
def get_token_from_header(header: reqparse.RequestParser) -> Optional[str]:
    return header.parse_args()['Authorization']

# Check the token and get the existing model
# TODO: Replace this
def check_token(header: reqparse.RequestParser, model: Union[Admin, Customer, Driver, Restaurant]):
    token = get_token_from_header(header)
    return model.query.filter_by(token=token).first()