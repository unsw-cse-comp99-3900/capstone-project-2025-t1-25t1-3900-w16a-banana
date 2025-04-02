"""Flask-restx models for Driver Order APIs"""
from flask_restx import Namespace, fields

api = Namespace('driver-order', description='APIs for Driver')

message_res = api.model('Message Response', {
    'message': fields.String(default = 'Descriptive Message')
})

order_info = api.model('Order Information', {
    'id': fields.Integer(),
    'customer_id': fields.Integer(),
    'driver_id': fields.Integer(),
    'restaurant_id': fields.Integer(), 
    'order_status': fields.String(),
    'customer_address': fields.String(), 
    'customer_suburb': fields.String(),
    'customer_state': fields.String(),
    'customer_postcode': fields.String(),
    'restaurant_address': fields.String(),
    'restaurant_suburb': fields.String(),
    'restaurant_state': fields.String(),
    'restaurant_postcode': fields.String(), 
    'order_price': fields.Float(),
    'delivery_fee': fields.Float(),
    'order_time': fields.String(),
    'pickup_time': fields.String(),
    'delivery_time': fields.String(),
    'customer_notes': fields.String(),
    'restaurant_notes': fields.String()
})