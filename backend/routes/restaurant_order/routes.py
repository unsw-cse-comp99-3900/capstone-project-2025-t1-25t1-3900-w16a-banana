from flask_restx import Resource
from flask import request

from utils.db import db
from utils.check import *
from utils.header import auth_header, get_token_from_header
from utils.response import res_error
from db_model import *
from db_model.db_query import *
from routes.restaurant_order.models import *
from routes.restaurant_order.services import *

@api.route('/orders/<string:action>/<int:order_id>')
@api.doc(params={
    'action': {
        'description': 'Action to perform (accept/reject/ready)',
        'enum': ['accept', 'reject', 'ready'],
        'type': 'string'
    },
    'order_id': 'Customer order ID'
})
class OrderActions(Resource):
    @api.expect(auth_header)
    @api.response(200, 'Success', error_res)
    @api.response(400, 'Bad Request', error_res)
    @api.response(401, 'Unauthorised', error_res)
    def post(self, action: str, order_id: int):
        restaurant = get_restaurant_by_token(get_token_from_header(auth_header))
        if not restaurant:
            return res_error(401)
        # Get the customer order
        customer_order = get_customer_order_by_id(order_id)
        if not customer_order:
            return res_error(400, 'Invalid Customer Order ID')
        # Check if the action is valid
        if not is_valid_order_action(action):
            return res_error(400, 'Invalid Action for Customer Order')
        
        msg: str = ''
        if action == 'accept':
            customer_order.order_status = OrderStatus.ACCEPTED
            msg = 'Order Accepted'
        elif action == 'reject':
            customer_order.order_status = OrderStatus.CANCELLED
            msg = 'Order Cancelled'
        elif action == 'ready':
            customer_order.order_status = OrderStatus.READY_FOR_PICKUP
            msg = 'Order Ready for Pickup'

        db.session.commit()
        return {'message': msg}, 200
    
@api.route('/orders/pending')
class GetPendingOrders(Resource):
    @api.expect(auth_header)
    @api.response(200, 'Success', get_all_orders_res)
    @api.response(400, 'Bad Request', error_res)
    @api.response(401, 'Unauthorised', error_res)
    def get(self):
        restaurant = get_restaurant_by_token(get_token_from_header(auth_header))
        if not restaurant:
            return res_error(401)
        
        customer_orders = get_all_customer_order_from_restaurant(restaurant.restaurant_id)

        pendingOrders: List[CustomerOrder] = []
        for customer_order in customer_orders:
            if customer_order.order_status == OrderStatus.PENDING:
                pendingOrders.append(customer_order)

        return {
            'orders': [pendingOrder.dict() for pendingOrder in pendingOrders]
        }, 200
    
@api.route('/orders/active')
class GetActiveOrders(Resource):
    @api.expect(auth_header)
    @api.response(200, 'Success', get_all_orders_res)
    @api.response(400, 'Bad Request', error_res)
    @api.response(401, 'Unauthorised', error_res)
    def get(self):
        restaurant = get_restaurant_by_token(get_token_from_header(auth_header))
        if not restaurant:
            return res_error(401)
        
        customer_orders = get_all_customer_order_from_restaurant(restaurant.restaurant_id)

        activeOrders: List[CustomerOrder] = []
        for customer_order in customer_orders:
            status = customer_order.order_status
            if status == OrderStatus.ACCEPTED\
                or status == OrderStatus.READY_FOR_PICKUP\
                or status == OrderStatus.DELIVERING:
                activeOrders.append(customer_order)

        return {
            'orders': [activeOrder.dict() for activeOrder in activeOrders]
        }, 200

@api.route('/orders/complete')
class GetCompleteOrders(Resource):
    @api.expect(auth_header)
    @api.response(200, 'Success', get_all_orders_res)
    @api.response(400, 'Bad Request', error_res)
    @api.response(401, 'Unauthorised', error_res)
    def get(self):
        restaurant = get_restaurant_by_token(get_token_from_header(auth_header))
        if not restaurant:
            return res_error(401)
        
        customer_orders = get_all_customer_order_from_restaurant(restaurant.restaurant_id)

        completeOrders: List[CustomerOrder] = []
        for customer_order in customer_orders:
            status = customer_order.order_status
            if status == OrderStatus.DELIVERED\
                or status == OrderStatus.CANCELLED:
                completeOrders.append(customer_order)

        return {
            'orders': [completeOrder.dict() for completeOrder in completeOrders]
        }, 200