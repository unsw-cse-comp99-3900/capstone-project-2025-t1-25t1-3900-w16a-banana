"""Routes related to Driver Dealing with Orders"""
from datetime import datetime
from flask_restx import Resource
from flask import request

from utils.db import db
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
    @api.response(200, 'Success', get_available_orders_res)
    @api.response(400, 'Bad Request', message_res)
    @api.response(401, 'Unauthorised', message_res)
    def get(self):
        """Get all Orders that is waiting for driver to be assigned"""
        driver = get_driver_by_token(tokenize(request.headers))
        if not driver:
            return res_error(401)

        orders = get_orders_waiting_driver()

        return {
            'orders': [format_order(order) for order in orders]
        }, 200

@api.route('/order/accept/<int:order_id>')
@api.doc(params={
    'order_id': 'Order ID'
})
class AcceptOrder(Resource):
    @api.expect(auth_header)
    @api.response(200, 'Success', message_res)
    @api.response(400, 'Bad Request', message_res)
    @api.response(401, 'Unauthorised', message_res)
    def post(self, order_id: int):
        """Accept given Order"""
        driver = get_driver_by_token(tokenize(request.headers))
        if not driver:
            return res_error(401)

        # Get the Order
        orders = filter_orders(id = order_id)
        if not orders:
            return res_error(404, 'Order Not Found')
        order = orders[0]

        if order.driver_id:
            return res_error(404, 'Order Accepted By Other Driver')

        if order.order_status != OrderStatus.ACCEPTED\
            and order.order_status != OrderStatus.READY_FOR_PICKUP:
            return res_error(400, 'Order Cannot Be Accepted')

        order.driver_id = driver.id
        db.session.commit()

        return { 'message': 'Order Accepted' }, 200


@api.route('/order/pickup/<int:order_id>')
@api.doc(params={
    'order_id': 'Order ID'
})
class PickupOrder(Resource):
    @api.expect(auth_header)
    @api.response(200, 'Success', message_res)
    @api.response(400, 'Bad Request', message_res)
    @api.response(401, 'Unauthorised', message_res)
    def post(self, order_id: int):
        """Pickup for already accepted orders"""
        driver = get_driver_by_token(tokenize(request.headers))
        if not driver:
            return res_error(401)

        # Get the Order
        orders = filter_orders(id = order_id)
        if not orders:
            return res_error(404, 'Order Not Found')
        order = orders[0]

        if order.driver_id != driver.id:
            return res_error(404, 'Order Unaccessible')

        if order.order_status != OrderStatus.READY_FOR_PICKUP:
            return res_error(400, 'Order Not Ready')

        order.order_status = OrderStatus.PICKED_UP
        order.pickup_time = datetime.now()

        db.session.commit()
        return { 'message': 'Order Picked Up' }, 200

@api.route('/order/complete/<int:order_id>')
@api.doc(params={
    'order_id': 'Order ID'
})
class CompleteOrder(Resource):
    @api.expect(auth_header)
    def post(self, order_id: int):
        """Complete delivery for already accepted orders"""
        driver = get_driver_by_token(tokenize(request.headers))
        if not driver:
            return res_error(401)

        # Get the Order
        orders = filter_orders(id = order_id)
        if not orders:
            return res_error(404, 'Order Not Found')

        order = orders[0]
        if order.driver_id != driver.id:
            return res_error(404, 'Order Unaccessible')

        if order.order_status != OrderStatus.PICKED_UP:
            return res_error(400, 'Order Not Picked Up')

        order.order_status = OrderStatus.DELIVERED
        order.delivery_time = datetime.now()

        db.session.commit()
        return { 'message': 'Delivery Completed' }, 200
