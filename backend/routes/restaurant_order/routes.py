"""APIs for Restaurnt Order feature"""
from typing import List
from flask_restx import Resource
from flask import request

from utils.db import db
from utils.header import auth_header, tokenize
from utils.response import res_error

from db_model import Order
from db_model.db_query import (
    filter_orders,
    get_restaurant_by_token,
    get_order_by_order_id
)
from db_model.db_enum import OrderStatus
from routes.restaurant_order.models import (
    api,
    error_res,
    get_all_orders_res,
)
from routes.restaurant_order.services import is_valid_order_action

@api.route('/orders/pending')
class GetPendingOrders(Resource):
    """Route: /orders/pending"""
    @api.expect(auth_header)
    @api.response(200, 'Success', get_all_orders_res)
    @api.response(400, 'Bad Request', error_res)
    @api.response(401, 'Unauthorised', error_res)
    def get(self):
        """Get All Pending Orders"""
        restaurant = get_restaurant_by_token(tokenize(request.headers))
        if not restaurant:
            return res_error(401)

        orders = filter_orders(restaurant_id = restaurant.id)
        pending_orders: List[Order] = []
        for order in orders:
            if order.order_status == OrderStatus.PENDING:
                pending_orders.append(order)

        return {
            'orders': [pending_order.dict() for pending_order in pending_orders]
        }, 200

@api.route('/orders/active')
class GetActiveOrders(Resource):
    """Route: /orders/active"""
    @api.expect(auth_header)
    @api.response(200, 'Success', get_all_orders_res)
    @api.response(400, 'Bad Request', error_res)
    @api.response(401, 'Unauthorised', error_res)
    def get(self):
        """Get All Active Orders"""
        restaurant = get_restaurant_by_token(tokenize(request.headers))
        if not restaurant:
            return res_error(401)

        orders = filter_orders(restaurant_id = restaurant.id)

        active_orders: List[Order] = []
        for order in orders:
            status = order.order_status
            if status == OrderStatus.RESTAURANT_ACCEPTED\
                or status == OrderStatus.READY_FOR_PICKUP\
                or status == OrderStatus.PICKED_UP:
                active_orders.append(order)

        return {
            'orders': [active_order.dict() for active_order in active_orders]
        }, 200

@api.route('/orders/complete')
class GetCompleteOrders(Resource):
    """Route: /orders/complete"""
    @api.expect(auth_header)
    @api.response(200, 'Success', get_all_orders_res)
    @api.response(400, 'Bad Request', error_res)
    @api.response(401, 'Unauthorised', error_res)
    def get(self):
        """Get All Complete Orders"""
        restaurant = get_restaurant_by_token(tokenize(request.headers))
        if not restaurant:
            return res_error(401)

        orders = filter_orders(restaurant_id = restaurant.id)

        complete_orders: List[Order] = []
        for order in orders:
            status = order.order_status
            if status == OrderStatus.DELIVERED\
                or status == OrderStatus.CANCELLED:
                complete_orders.append(order)

        return {
            'orders': [complete_order.dict() for complete_order in complete_orders]
        }, 200

# for a restaurant:
# pending order = new incoming order
# then the restaurant approves the order, 
# so the order becomes in-progress
# then the cooking is done, the restaurant notifies that the order is ready for pickup,
# and this order becomes completed for the restaurant
@api.route('/<string:order_type>')
@api.doc(params={
    'order_type': {
        'description': 'Order type to filter',
        'enum': ['pending', 'accepted', 'ready_for_pickup', 'all'],
        'type': 'string'
    }
})
class OrderResourceVe(Resource):
    @api.doc(description="Get all orders for my restaurant via order_type, orders are sorted reverse time order")
    @api.expect(auth_header)
    @api.response(200, 'Success')
    @api.response(400, 'Bad Request', error_res)
    @api.response(401, 'Unauthorised', error_res)
    def get(self, order_type):
        """A restaurant get all orders via type, pending, in-progress, completed"""

        restaurant = get_restaurant_by_token(tokenize(request.headers))
        if not restaurant:
            return res_error(401)
        
        if order_type == 'pending':
            orders = filter_orders(restaurant_id = restaurant.id, order_status = OrderStatus.PENDING)
        elif order_type == 'accepted':
            orders = filter_orders(restaurant_id = restaurant.id, order_status = OrderStatus.RESTAURANT_ACCEPTED)
        elif order_type == 'ready_for_pickup':
            orders = filter_orders(restaurant_id = restaurant.id, order_status = OrderStatus.READY_FOR_PICKUP)
        elif order_type == 'all':
            orders = filter_orders(restaurant_id = restaurant.id)
        else:
            return res_error(400, 'Invalid Order Type')
        
        # format the result
        results = []
        for order in orders:
            results.append(get_order_by_order_id(order.id))
        
        return results, 200


# for a restaurant, get a single order
@api.route('/<int:order_id>')
class SingleOrder(Resource):
    @api.doc(description="Get a single order for my restaurant via order_id")
    @api.expect(auth_header)
    @api.response(200, 'Success')
    @api.response(400, 'Bad Request', error_res)
    @api.response(401, 'Unauthorised', error_res)
    def get(self, order_id):
        """A restaurant get a single order via order_id"""
        
        restaurant = get_restaurant_by_token(tokenize(request.headers))
        if not restaurant:
            return res_error(401)

        order = Order.query.filter(
            Order.id == order_id,
            Order.restaurant_id == restaurant.id
        ).first()

        if not order:
            return res_error(400, 'Invalid Order ID')

        return get_order_by_order_id(order.id), 200

@api.route('/orders/<string:action>/<int:order_id>')
@api.doc(params={
    'action': {
        'description': 'Action to perform (accept/reject/ready)',
        'enum': ['accept', 'reject', 'ready'],
        'type': 'string'
    },
    'order_id': 'Order ID'
})
class OrderActions(Resource):
    @api.expect(auth_header)
    @api.response(200, 'Success', error_res)
    @api.response(400, 'Bad Request', error_res)
    @api.response(401, 'Unauthorised', error_res)
    def post(self, action: str, order_id: int):
        """
        Take action for Pending Order
        """
        restaurant = get_restaurant_by_token(tokenize(request.headers))
        if not restaurant:
            return res_error(401)
        # Get the Order
        orders = filter_orders(id = order_id)
        if not orders:
            return res_error(400, 'Invalid Order ID')
        order = orders[0]

        # Check if the action is valid
        if not is_valid_order_action(action):
            return res_error(400, 'Invalid Action for Order')

        msg: str = ''
        if action == 'accept':
            order.order_status = OrderStatus.RESTAURANT_ACCEPTED
            msg = 'Order Accepted'
        elif action == 'reject':
            order.order_status = OrderStatus.CANCELLED
            msg = 'Order Cancelled'
        elif action == 'ready':
            order.order_status = OrderStatus.READY_FOR_PICKUP
            msg = 'Order Ready for Pickup'

        db.session.commit()
        return {'message': msg}, 200