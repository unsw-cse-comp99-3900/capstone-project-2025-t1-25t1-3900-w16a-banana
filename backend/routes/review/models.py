"""Flask Restx model for Review APIs"""
from flask_restx import Namespace, reqparse, fields
from werkzeug.datastructures import FileStorage

api = Namespace('review', description='APIs for Rating Restaurant/Driver')

message_res = api.model('Simple Message Response', {
    'message': fields.String()
})

rating_req_parser = reqparse.RequestParser()
rating_req_parser.add_argument('rating', type=float, required=True, default=1)
rating_req_parser.add_argument('review_text', type=str, required=False, default='Excellent!')
rating_req_parser.add_argument(
    'img', type=FileStorage, location="files", required=False, help='Review Image'
)

review_model = api.model('Individual Review', {
    'order_id': fields.Integer(),
    'customer_id': fields.String(),
    'customer_name': fields.String(),
    'customer_profile_img': fields.String(),
    'review_id': fields.Integer(),
    'rating': fields.Float(),
    'review_text': fields.String(),
    'review_img': fields.String(),
    'reply': fields.String(),
    'time': fields.String()
})

get_reviews_reponse = api.model('Get ratings response', {
    'avg_rating': fields.Float(),
    'n_reviews': fields.Integer(),
    'reviews': fields.List(fields.Nested(review_model))
})

reply_req = api.model('Reply to Customer Review', {
    'reply': fields.String(required=True)
})
