from flask_restx import Resource
from flask import request

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
class IncomingOrders(Resource):
    @api.expect(auth_header)
    def get(self):
        """Get all available (Waiting for a driver) offers"""
        driver = get_driver_by_token(tokenize(request.headers))
        if not driver:
            return res_error(401)
        
        orders = get_all_customer_order_driver_waiting()
        
        return {
            orders: [format_order(order) for order in orders]
        }, 200


@api.route('/orders/<int:order_id>')
class HandleOffers(Resource):
    def post(self, order_id):
        """Accept or reject incoming offers"""
        return