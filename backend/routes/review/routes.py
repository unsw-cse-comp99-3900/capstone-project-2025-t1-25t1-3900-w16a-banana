"""Review APIs"""
from datetime import datetime
from flask_restx import Resource
from flask import request

from utils.header import auth_header, tokenize
from utils.response import res_error
from utils.db import db
from utils.file import save_image
from db_model import RestaurantReview, DriverReview
from db_model.db_query import (
    get_customer_by_token, get_driver_by_token, get_restaurant_by_token,
    filter_restaurants, filter_drivers,
    filter_restaurant_reviews, filter_driver_reviews,
    filter_orders
)
from db_model.db_enum import OrderStatus
from routes.review.models import (
    api, message_res, rating_req_parser, get_reviews_reponse, reply_req
)

@api.route('/restaurant/<int:restaurant_id>')
class RateRestaurant(Resource):
    """Route: /restaurant/<int:restaurant_id>"""
    @api.expect(auth_header, rating_req_parser)
    @api.response(200, 'Success')
    @api.response(400, 'Bad Request', message_res)
    @api.response(401, 'Unauthorised', message_res)
    def put(self, restaurant_id: int):
        """
        Customer Rating Post/Update For Restaurant.
        Review text and img can be empty.
        One Review for a Restaurant.
        Must have order history to rate.
        """
        # Look for customer
        customer = get_customer_by_token(tokenize(request.headers))
        if not customer:
            return res_error(401, 'Customer Not Found')
        # Find the restaurant
        if not filter_restaurants(id=restaurant_id):
            return res_error(400, 'Given Restaurant ID Is Not Valid')
        # Check the argument
        args = rating_req_parser.parse_args()
        if not args.get('rating') or not 1 <= args.get('rating') <= 5:
            return res_error(400, 'Invalid Rating')

        # Check the previous review.
        reviews = filter_restaurant_reviews(
            customer_id = customer.id,
            restaurant_id = restaurant_id
        )
        if reviews:
            review = reviews[0]
            review.rating = args.get('rating')
        else:
            # Check the complete order history
            if not filter_orders(
                customer_id=customer.id, restaurant_id=restaurant_id,
                order_status=OrderStatus.DELIVERED
            ):
                return res_error(400, 'Customer Haven\'t Ordered From Here')
            review = RestaurantReview(
                customer_id=customer.id,
                restaurant_id=restaurant_id,
                rating=args.get('rating'),
                review_text=''
            )
            db.session.add(review)
        if args.get('review_text'):
            review.review_text = args.get('review_text')
        if args.get('img'):
            url_img = save_image(args.get('img'))
            if not url_img:
                return res_error(400, 'Invalid Image File')
            review.url_img = url_img
        review.updated_at = datetime.now()
        db.session.commit()
        return review.dict(), 200

@api.route('/driver/<int:driver_id>')
class RateDriver(Resource):
    """Route: /driver/<int:driver_id>"""
    @api.expect(auth_header, rating_req_parser)
    @api.response(200, 'Success')
    @api.response(400, 'Bad Request', message_res)
    @api.response(401, 'Unauthorised', message_res)
    def put(self, driver_id: int):
        """
        Customer Rating Post/Update For Driver.
        Review text and img can be empty.
        One Review for a Driver.
        Must have order history to rate.
        """
        # Look for customer
        customer = get_customer_by_token(tokenize(request.headers))
        if not customer:
            return res_error(401, 'Customer Not Found')
        # Find the driver
        if not filter_drivers(id=driver_id):
            return res_error(400, 'Given Driver ID Is Not Valid')
        # Check the argument
        args = rating_req_parser.parse_args()
        if not args.get('rating') or not 1 <= args.get('rating') <= 5:
            return res_error(400, 'Invalid Rating')

        # Check the previous review.
        reviews = filter_driver_reviews(
            customer_id = customer.id,
            driver_id = driver_id
        )
        if reviews:
            review = reviews[0]
            review.rating = args.get('rating')
        else:
            # Check the complete order history
            if not filter_orders(
                customer_id=customer.id, driver_id=driver_id,
                order_status=OrderStatus.DELIVERED
            ):
                return res_error(400, 'Customer Haven\'t Received From This Driver')
            review = DriverReview(
                customer_id=customer.id,
                driver_id=driver_id,
                rating=args.get('rating'),
                review_text=''
            )
            db.session.add(review)
        if args.get('review_text'):
            review.review_text = args.get('review_text')
        if args.get('img'):
            url_img = save_image(args.get('img'))
            if not url_img:
                return res_error(400, 'Invalid Image File')
            review.url_img = url_img
        review.updated_at = datetime.now()
        db.session.commit()
        return review.dict(), 200

@api.route('/<string:user_type>/<int:user_id>')
@api.doc(params={
    'user_type': {
        'description': 'User Type',
        'enum': ['driver', 'restaurant'],
        'type': 'string'
    },
    'user_id': {'type': 'int'}
})
class GetReviews(Resource):
    """Get All Reviews Without Token"""
    @api.response(200, 'Success', get_reviews_reponse)
    def get(self, user_type: str, user_id: int):
        """Get Reviews"""
        if user_type == 'driver':
            if not filter_drivers(id=user_id):
                return res_error(400, 'Driver ID Invalid')
            reviews = filter_driver_reviews(driver_id=user_id)
        elif user_type == 'restaurant':
            if not filter_restaurants(id=user_id):
                return res_error(400, 'Restaurant ID Invalid')
            reviews = filter_restaurant_reviews(restaurant_id=user_id)
        else:
            return res_error(400, 'Invalid User Type')
        review_list = []
        total = 0
        for review in reviews:
            total += review.rating
            review_list.append(review.format())
        return {
            'avg_rating': 0 if len(reviews) == 0 else total / len(reviews),
            'n_reviews': len(reviews),
            'reviews': review_list
        }, 200

@api.route('/reply/<string:user_type>/<int:review_id>')
@api.doc(params={
    'user_type': {
        'description': 'User Type',
        'enum': ['driver', 'restaurant'],
        'type': 'string'
    },
    'review_id': {'type': 'int'}
})
class ReplyReviews(Resource):
    """Update/Post Review Reply"""
    @api.expect(auth_header, reply_req)
    def put(self, user_type: str, review_id: int):
        """Update/Post Review"""
        reply = request.get_json().get('reply')
        if not reply:
            return res_error(400, 'No Reply Given')
        if user_type == 'driver':
            driver = get_driver_by_token(tokenize(request.headers))
            if not driver:
                return res_error(401, 'Driver Token Invalid')
            reviews = filter_driver_reviews(driver_id=driver.id, id=review_id)
            if not reviews:
                return res_error(400, 'Invalid Review ID')
            reviews[0].reply = reply
        if user_type == 'restaurant':
            restaurant = get_restaurant_by_token(tokenize(request.headers))
            if not restaurant:
                return res_error(401, 'Restaurant Token Invalid')
            reviews = filter_restaurant_reviews(restaurant_id=restaurant.id, id=review_id)
            if not reviews:
                return res_error(400, 'Invalid Review ID')
            reviews[0].reply = reply

        db.session.commit()
        return reviews[0].dict(), 200
