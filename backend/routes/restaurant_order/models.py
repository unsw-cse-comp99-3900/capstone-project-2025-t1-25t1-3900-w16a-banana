from flask_restx import Namespace, fields

api = Namespace('restaurant-order', description='APIs for Restaurant Order')

"""Error Response"""
error_res= api.model("Error", {
    "message": fields.String(description="Error message", example="Error Description")
})

"""Response for get pending orders"""
get_single_order_res = api.model("Get Single Customer Order Response", {
    'order_id': fields.Integer(description='Order ID'),
    'customer_id': fields.Integer(description='Customer ID'),
    'driver_id': fields.Integer(description='Driver ID'),
    'restaurant_id': fields.Integer(description='Restaurant ID'),

    'order_status': fields.String(description='Current status of the order'),

    'address': fields.String(description='Delivery address'),
    'suburb': fields.String(description='Suburb'),
    'state': fields.String(description='State'),
    'postcode': fields.String(description='Postcode'),

    'order_price': fields.Float(description='Subtotal of the order'),
    'delivery_fee': fields.Float(description='Delivery fee'),
    'total_price': fields.Float(description='Total price including delivery'),

    'order_time': fields.String(description='Order placed time', default='YYYY-MM-DD HH:MM:SS'),
    'pickup_time': fields.String(description='Pickup time', default='YYYY-MM-DD HH:MM:SS'),
    'delivery_time': fields.String(description='Delivery time', default='YYYY-MM-DD HH:MM:SS'),

    'customer_notes': fields.String(description='Notes left by the customer'),
    'restaurant_notes': fields.String(description='Notes left by the restaurant'),

    'card_number': fields.String(description='Card number used for payment (masked/fake)')
})

get_all_orders_res = api.model("Get All Customer Orders Response", {
    'orders': fields.List(fields.Nested(get_single_order_res))
})