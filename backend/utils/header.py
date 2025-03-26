from flask_restx import reqparse
from db_model import *
from typing import Union, Optional
from werkzeug.datastructures import EnvironHeaders

# a Authorization token header required
auth_header = reqparse.RequestParser()
auth_header.add_argument('Authorization', location='headers', required=True, help='Authorization token')


def tokenize(header: EnvironHeaders):
    return header.get('Authorization')



# Extract token from the header
def get_token_from_header(header: reqparse.RequestParser) -> Optional[str]:
    return header.parse_args()['Authorization']