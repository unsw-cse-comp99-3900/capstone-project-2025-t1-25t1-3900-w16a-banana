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
    api, message_res, rating_req_parser, 
    get_reviews_reponse, reply_req, review_model
)

@api.route('/restaurant/<int:restaurant_id>/order/<int:order_id>')
class RateRestaurant(Resource):
    """Route: /restaurant/<int:restaurant_id>/order/<int:order_id>"""
    @api.expect(auth_header, rating_req_parser)
    @api.response(200, 'Success')
    @api.response(400, 'Bad Request', message_res)
    @api.response(401, 'Unauthorised', message_res)
    def put(self, restaurant_id: int, order_id: int):
        """
        Customer post / update rating & review for restaurant based on an order ID.
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

        # check if this order exists, and the order is between this (customer, restaurant)
        orders = filter_orders(
            id=order_id,
            customer_id=customer.id,
            restaurant_id=restaurant_id,
        )

        if not orders:
            return res_error(400, 'Order Not Found')

        # check if previous review exists
        reviews = filter_restaurant_reviews(
            order_id=order_id,
            customer_id=customer.id,
            restaurant_id=restaurant_id
        )

        if reviews:
            review = reviews[0]
        else:
            # create this review
            review = RestaurantReview(
                customer_id=customer.id,
                restaurant_id=restaurant_id,
                order_id=order_id,
                rating=args.get('rating'),
                review_text=''
            )

            db.session.add(review)
            db.session.commit()
        
        # now update the review
        if args.get('rating'):
            review.rating = args.get('rating')

        if args.get('review_text'):
            review.review_text = args.get('review_text')
        
        if args.get('img'):
            url_img = save_image(args.get('img'))
            if not url_img:
                return res_error(400, 'Invalid Image File')
            review.url_img = url_img
        
        # save the update
        db.session.commit()

        # return the review
        return review.dict(), 200

@api.route('/driver/<int:driver_id>/order/<int:order_id>')
class RateDriver(Resource):
    '''Route: /driver/<int:driver_id>/order/<int:order_id>'''
    @api.expect(auth_header, rating_req_parser)
    @api.response(200, 'Success')
    @api.response(400, 'Bad Request', message_res)
    @api.response(401, 'Unauthorised', message_res)
    def put(self, driver_id: int, order_id: int):
        '''
        Customer post / update rating & review for a driver based on an order ID.
        Review text and img can be empty.
        One Review for a Driver.
        Must have order history to rate.
        '''
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

        # check if this order exists, and this order is between this (customer, driver)
        orders = filter_orders(
            id=order_id,
            customer_id=customer.id,
            driver_id=driver_id,
        )

        if not orders:
            return res_error(400, 'Order Not Found')

        # check if previous review exists
        reviews = filter_driver_reviews(
            order_id=order_id,
            customer_id=customer.id,
            driver_id=driver_id
        )

        if reviews:
            review = reviews[0]
        else:
            # create this order review
            review = DriverReview(
                customer_id=customer.id,
                driver_id=driver_id,
                order_id=order_id,
                rating=args.get('rating'),
                review_text=''
            )

            db.session.add(review)
            db.session.commit()
        
        # now update the review
        if args.get('rating'):
            review.rating = args.get('rating')

        if args.get('review_text'):
            review.review_text = args.get('review_text')
        
        if args.get('img'):
            url_img = save_image(args.get('img'))
            if not url_img:
                return res_error(400, 'Invalid Image File')
            review.url_img = url_img

        # save the update
        db.session.commit()

        # return the review
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
class GetReviewsOf(Resource):
    '''Get All Reviews Of Restaurant/Driver Without Token'''
    @api.response(200, 'Success', get_reviews_reponse)
    def get(self, user_type: str, user_id: int):
        '''Get all reviews of a restaurant / driver without token'''
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

        # return the average rating, number of reviews, and the reviews
        avg_rating = 0 if len(reviews) == 0 else total / len(reviews)

        response = {
            'avg_rating': avg_rating,
            'n_reviews': len(reviews),
            'reviews': review_list
        }

        return response, 200

@api.route('/<string:user_type>/reply/<int:review_id>')
@api.doc(params={
    'user_type': {
        'description': 'User Type',
        'enum': ['driver', 'restaurant'],
        'type': 'string'
    },
    'review_id': {'type': 'int'}
})
class ReplyReviews(Resource):
    '''Driver or Restaurant Reply to the Customer Review'''
    @api.expect(auth_header, reply_req)
    @api.response(200, 'Success. Return modified review')
    def put(self, user_type: str, review_id: int):
        '''A driver or restaurant reply to the customer review'''
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

@api.route('/customer-delete/<int:review_id>')
class DeleteReview(Resource):
    """Customer Delete Review"""
    @api.expect(auth_header)
    @api.response(200, 'Successful Deletion', message_res)
    @api.response(401, 'Unauthorised', message_res)
    @api.response(404, 'Review Not Found', message_res)
    def delete(self, review_id: int):
        """Customer delete a existing review"""

        # find the customer
        customer = get_customer_by_token(tokenize(request.headers))
        if not customer:
            return res_error(401, 'Customer Not Found')
        
        # find the review
        restaurant_reviews = filter_restaurant_reviews(id=review_id, customer_id=customer.id)
        driver_reviews = filter_driver_reviews(id=review_id, customer_id=customer.id)

        if not restaurant_reviews and not driver_reviews:
            return res_error(404, 'Review Not Found')
    
        # both reviews are together
        if restaurant_reviews:
            review = restaurant_reviews[0]
            db.session.delete(review)
            db.session.commit()
        
        if driver_reviews:
            review = driver_reviews[0]
            db.session.delete(review)
            db.session.commit()

        return {'message': 'Deleted Successfully'}, 200

@api.route('/about-me')
class GetMyReviewByCustomer(Resource):
    '''Get all customer reviews about me'''
    @api.expect(auth_header)
    @api.response(200, 'Successful Deletion', message_res)
    @api.response(400, 'Invalid Review Type', message_res)
    @api.response(404, 'Review Not Found', message_res)
    def get(self):
        '''Get all customer reviews about me (restaurant or driver)'''

        # check the token
        driver = get_driver_by_token(tokenize(request.headers))
        restaurant = get_restaurant_by_token(tokenize(request.headers))

        if not driver and not restaurant:
            return res_error(401, 'Invalid Token')

        # filter out all the reviews about me
        if driver:
            reviews = filter_driver_reviews(driver_id=driver.id)
        elif restaurant:
            reviews = filter_restaurant_reviews(restaurant_id=restaurant.id)

        # return all the reviews
        response = [r.format_with_target_profile() for r in reviews]
        return response, 200

@api.route('/order/<int:order_id>')
class GetReviewByOrder(Resource):
    '''Get the review for a specific order'''
    @api.response(200, 'Review Found', review_model)
    @api.response(404, 'Review Not Found', message_res)
    def get(self, order_id: int):
        '''Return the review tied to the order ID'''

        # get this order
        order = filter_orders(id=order_id)
        if not order:
            return res_error(404, 'Order Not Found')
        
        order = order[0]

        # Try to find restaurant or driver review for this order
        restaurant_reviews = filter_restaurant_reviews(order_id=order_id)
        driver_reviews = filter_driver_reviews(order_id=order_id)

        # so one order may have: one review to the restaurant, one review to the driver
        r_review = restaurant_reviews[0].format_with_target_profile() if restaurant_reviews else None
        d_review = driver_reviews[0].format_with_target_profile() if driver_reviews else None

        # format the response
        response = {
            'restaurant_review': r_review,
            'driver_review': d_review,
            'driver_id': order.driver_id,
            'restaurant_id': order.restaurant_id,
            'order_id': order.id,
        }

        return response, 200
