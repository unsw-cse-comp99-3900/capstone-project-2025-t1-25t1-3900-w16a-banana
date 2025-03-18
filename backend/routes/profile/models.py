from flask_restx import Namespace, fields, reqparse 

api = Namespace('profile', description='APIs for Profile')

# Obtain a profile
# user_type, user_id
profile_req_parser = reqparse.RequestParser()
profile_req_parser.add_argument('user_type', type=str, required=True, help='User Type')
profile_req_parser.add_argument('user_id', type=int, required=True, help='User ID')
