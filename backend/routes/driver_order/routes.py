from flask_restx import Resource
from flask import request
from datetime import datetime

from utils.db import db
from utils.file import save_file
from utils.check import *
from utils.header import auth_header, tokenize
from utils.response import res_error
from db_model import *
from db_model.db_query import *
from routes.driver_order.models import *
from routes.driver_order.services import *

@api.route('/orders/available')
class AvailableOrders(Resource):
    @api.expect(auth_header)
    def get(self):
        """Get all Orders that is waiting for driver to be assigned"""
        driver = get_driver_by_token(tokenize(request.headers))
        if not driver:
            return res_error(401)
        
        orders = get_all_customer_order_driver_waiting()
        
        return {
            'orders': [format_order(order) for order in orders]
        }, 200
    
@api.route('/order/accept/<int:order_id>')
@api.doc(params={
    'order_id': 'Customer order ID'
})
class AcceptOrder(Resource):
    @api.expect(auth_header)
    def post(self, order_id: int):
        """Accept given customer order"""
        driver = get_driver_by_token(tokenize(request.headers))
        if not driver:
            return res_error(401)

        # Get the customer order
        customer_order = get_customer_order_by_id(order_id)
        if not customer_order\
            or customer_order.driver_id:
            print(customer_order.driver_id)
            return res_error(404, 'Order Not Found')
        
        if customer_order.order_status != OrderStatus.ACCEPTED\
            and customer_order.order_status != OrderStatus.READY_FOR_PICKUP:
            return res_error(400, 'Order Cannot Be Accepted')
        
        customer_order.driver_id = driver.driver_id
        db.session.commit()

        return { 'message': 'Order Accepted' }, 200


@api.route('/order/pickup/<int:order_id>')
@api.doc(params={
    'order_id': 'Customer order ID'
})
class PickupOrder(Resource):
    @api.expect(auth_header)
    def post(self, order_id: int):
        """Pickup for already accepted orders"""
        driver = get_driver_by_token(tokenize(request.headers))
        if not driver:
            return res_error(401)

        # Get the customer order
        customer_order = get_customer_order_by_id(order_id)
        if not customer_order\
            or customer_order.driver_id != driver.driver_id:
            return res_error(404, 'Order Not Found')
        
        if customer_order.order_status != OrderStatus.READY_FOR_PICKUP:
            return res_error(400, 'Order Not Ready')

        customer_order.order_status = OrderStatus.PICKED_UP
        customer_order.pickup_time = datetime.now()

        db.session.commit()
        return { 'message': 'Order Picked Up' }, 200

@api.route('/order/complete/<int:order_id>')
@api.doc(params={
    'order_id': 'Customer order ID'
})
class CompleteOrder(Resource):
    @api.expect(auth_header)
    def post(self, order_id: int):
        """Complete delivery for already accepted orders"""
        driver = get_driver_by_token(tokenize(request.headers))
        if not driver:
            return res_error(401)

        # Get the customer order
        customer_order = get_customer_order_by_id(order_id)
        if not customer_order\
            or customer_order.driver_id != driver.driver_id:
            return res_error(404, 'Order Not Found')
        
        if customer_order.order_status != OrderStatus.PICKED_UP:
            return res_error(400, 'Order Not Picked Up')
        
        customer_order.order_status = OrderStatus.DELIVERED
        customer_order.delivery_time = datetime.now()

        db.session.commit()
        return { 'message': 'Delivery Completed' }, 200