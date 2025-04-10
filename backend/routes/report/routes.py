"""Report APIs"""
from datetime import datetime
from flask_restx import Resource
from flask import request

from utils.header import auth_header, tokenize
from utils.response import res_error
from db_model.db_query import (
    get_customer_by_token,
    get_driver_by_token,
    get_restaurant_by_token
)
from routes.report.models import (
    api,
    date_req_parser,
    spending_report_model,
    earning_report_model
)
from routes.report.services import filter_orders_by_user_and_date_range

@api.route('/customer')
class CustomerReport(Resource):
    """Route: /customer"""
    @api.expect(auth_header, date_req_parser)
    @api.response(200, 'Success', spending_report_model)
    @api.response(400, 'Bad Request')
    @api.response(401, 'Unauthorised')
    def get(self):
        """Get Spending of a Customer in given date range"""
        customer = get_customer_by_token(tokenize(request.headers))
        if not customer:
            return res_error(401, 'Invalid Customer')
        args = date_req_parser.parse_args()
        start_date_str = args.get('start_date')
        end_date_str = args.get('end_date')

        try:
            start_date = datetime.strptime(start_date_str, "%Y-%m-%d")
            end_date = datetime.strptime(end_date_str, "%Y-%m-%d")
        except ValueError:
            return res_error(400, 'Date format must be YYYY-MM-DD')

        orders = filter_orders_by_user_and_date_range(
            customer_id=customer.id,
            start_date=start_date,
            end_date=end_date
        )
        total_spending = 0
        for order in orders:
            total_spending += order.order_price

        return {
            'total_order': len(orders),
            'total_spending': total_spending
        }, 200

@api.route('/driver')
class DriverReport(Resource):
    """Route: /driver"""
    @api.expect(auth_header, date_req_parser)
    @api.response(200, 'Success', earning_report_model)
    @api.response(400, 'Bad Request')
    @api.response(401, 'Unauthorised')
    def get(self):
        """Get Spending of a Customer in given date range"""
        driver = get_driver_by_token(tokenize(request.headers))
        if not driver:
            return res_error(401, 'Invalid Driver')
        args = date_req_parser.parse_args()
        start_date_str = args.get('start_date')
        end_date_str = args.get('end_date')

        try:
            start_date = datetime.strptime(start_date_str, "%Y-%m-%d")
            end_date = datetime.strptime(end_date_str, "%Y-%m-%d")
        except ValueError:
            return res_error(400, 'Date format must be YYYY-MM-DD')

        orders = filter_orders_by_user_and_date_range(
            driver_id=driver.id,
            start_date=start_date,
            end_date=end_date
        )
        total_earning = 0
        for order in orders:
            total_earning += order.delivery_fee

        return {
            'total_order': len(orders),
            'total_earning': total_earning
        }, 200

@api.route('/restaurant')
class RestaurantReport(Resource):
    """Route: /restaurant"""
    @api.expect(auth_header, date_req_parser)
    @api.response(200, 'Success', earning_report_model)
    @api.response(400, 'Bad Request')
    @api.response(401, 'Unauthorised')
    def get(self):
        """Get Spending of a Customer in given date range"""
        restaurant = get_restaurant_by_token(tokenize(request.headers))
        if not restaurant:
            return res_error(401, 'Invalid Restaurant')
        args = date_req_parser.parse_args()
        start_date_str = args.get('start_date')
        end_date_str = args.get('end_date')

        try:
            start_date = datetime.strptime(start_date_str, "%Y-%m-%d")
            end_date = datetime.strptime(end_date_str, "%Y-%m-%d")
        except ValueError:
            return res_error(400, 'Date format must be YYYY-MM-DD')

        orders = filter_orders_by_user_and_date_range(
            restaurant_id=restaurant.id,
            start_date=start_date,
            end_date=end_date
        )
        total_earning = 0
        for order in orders:
            total_earning += order.order_price

        return {
            'total_order': len(orders),
            'total_earning': total_earning
        }, 200
