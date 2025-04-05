"""Routes related to Driver Dealing with Orders"""
from datetime import datetime
from flask_restx import Resource
from flask import request

from utils.db import db
from utils.header import auth_header, tokenize
from utils.response import res_error
from db_model.db_query import (
    filter_orders,
    get_driver_by_token,
    get_orders_waiting_driver,
    get_order_by_order_id
)
from db_model.db_enum import OrderStatus
from routes.driver_order.models import (
    api,
    message_res,
    order_info,
)
from routes.driver_order.services import (
    format_order
)

@api.route('/orders/available')
class AvailableOrders(Resource):
    """Route: /orders/available"""
    @api.expect(auth_header)
    @api.marshal_list_with(order_info)
    @api.response(200, 'Success')
    @api.response(400, 'Bad Request', message_res)
    @api.response(401, 'Unauthorised', message_res)
    def get(self):
        """Get all Orders that is waiting for driver to be assigned"""
        driver = get_driver_by_token(tokenize(request.headers))
        if not driver:
            return res_error(401)

        orders = get_orders_waiting_driver()

        return [format_order(order) for order in orders], 200

@api.route('/order/accept/<int:order_id>')
@api.doc(params={
    'order_id': 'Order ID'
})
class AcceptOrder(Resource):
    """Route /order/accept/<int:order_id>"""
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
    """Route /order/pickup/<int:order_id>"""
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
    """Route: /order/complete/<int:order_id>"""
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

# order_type: new, in_progress, completed
# new: the order is not taken by any driver yet
# in_progress: I have taken this order, and I am doing it
# completed: delivered
@api.route('/<string:order_type>')
@api.doc(params={
    'order_type': {
        'description': 'Order Type',
        'enum': ['new', 'in_progress', 'completed'],
        'type': 'string'
    }
})
class AvailableOrdersV2(Resource):
    @api.expect(auth_header)
    @api.response(200, 'Success')
    @api.response(400, 'Bad Request', message_res)
    @api.response(401, 'Unauthorised', message_res)
    def get(self, order_type):
        """Get all available orders so the driver can accept"""
        driver = get_driver_by_token(tokenize(request.headers))
        if not driver:
            return res_error(401)

        if order_type == 'new':
            orders = get_orders_waiting_driver()
        elif order_type == 'in_progress':
            orders = filter_orders(driver_id=driver.id, order_status=OrderStatus.DELIVERED)
        elif order_type == 'completed':
            orders = filter_orders(driver_id=driver.id, order_status=OrderStatus.DELIVERED)
        
        results = [get_order_by_order_id(o.id) for o in orders]
        return results, 200
