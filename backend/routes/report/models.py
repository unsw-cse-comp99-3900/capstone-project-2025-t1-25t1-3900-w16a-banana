"""Flask Restx model for Report APIs"""
from flask_restx import Namespace, reqparse, fields

api = Namespace('report', description='APIs for Report/Record')

date_req_parser = reqparse.RequestParser()
date_req_parser.add_argument('start_date', type=str, required=True, help="Start date in YYYY-MM-DD")
date_req_parser.add_argument('end_date', type=str, required=True, help="End date in YYYY-MM-DD")

spending_report_model = api.model('Customer Spending Model', {
    'total_order': fields.Integer(description='Number of total order'),
    'total_spending': fields.Float(description='Total Spending')
})

earning_report_model = api.model('Customer Earning Model', {
    'total_order': fields.Integer(description='Number of total order'),
    'total_earning': fields.Float(description='Total Earning')
})
