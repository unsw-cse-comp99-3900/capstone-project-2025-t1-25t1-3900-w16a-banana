"""Flask-restx model for Customer-Order APIs"""
from flask_restx import Namespace, fields

api = Namespace('customer-order', description='APIs for Customer')

"""Error Response"""
error_res= api.model("Error", {
    "message": fields.String(description="Error message", example="Error Description")
})

"""Response for customer cart get"""
cart_item_model = api.model('Single Cart Item Model', {
    'menu_id': fields.Integer(),
    'menu_name': fields.String(),
    'restaurant_id': fields.Integer(),
    'restaurant_name': fields.String(),
    'description': fields.String(),
    'price': fields.Float(),
    'quantity': fields.Integer(),
    'total_price': fields.Float(),
    'url_img': fields.String()
})

"""Response/Request for customer cart update"""
cart_item_update_req = api.model('Cart Item Update Request Model', {
    'menu_id': fields.Integer(required=True, description='Item ID to Update', default=1),
    'quantity': fields.Integer(required=True, description='Quantity of item', default=1)
})

cart_item_update_res = api.model("Cart Item Update Response Model", {
    "message": fields.String(
        description="Success Message", example="Cart Item Update/Delete Successful"
    )
})

"""Response/Request for customer viewing order"""
get_order_res = api.model("Get Order Response", {
    "id": fields.Integer(),
    "customer_id": fields.Integer(),
    "driver_id": fields.Integer(),
    "restaurant_id": fields.Integer(),
    "order_status": fields.String(),
    "address":  fields.String(),
    "suburb": fields.String(),
    "state": fields.String(),
    "postcode": fields.String(),
    "order_price": fields.Float(),
    "delivery_fee": fields.Float(),
    "total_price": fields.Float(),
    "order_time": fields.String(description="YYYY-MM-DD HH:MM:SS"),
    "pickup_time": fields.String(),
    "delivery_time": fields.String(description="YYYY-MM-DD HH:MM:SS"),
    "customer_notes": fields.String(),
    "restaurant_notes": fields.String(),
    "card_number": fields.String()
})


"""Response/Request for customer placing order"""
post_order_req = api.model("Order From Cart Request", {
    'restaurant_id': fields.Integer(required=True),
    'address': fields.String(required=True),
    'suburb': fields.String(required=True),
    'state': fields.String(required=True, default='NSW'),
    'postcode': fields.String(required=True),
    'customer_notes': fields.String(required=True, default='2000'),
    'card_number': fields.String(required=True)
})
post_order_res = api.model("Order From Cart Response", {
    "id": fields.Integer(),
    "customer_id": fields.Integer(),
    "driver_id": fields.Integer(),
    "restaurant_id": fields.Integer(),
    "order_status": fields.String(),
    "address":  fields.String(),
    "suburb": fields.String(),
    "state": fields.String(),
    "postcode": fields.String(),
    "order_price": fields.Float(),
    "delivery_fee": fields.Float(),
    "total_price": fields.Float(),
    "order_time": fields.String(description="YYYY-MM-DD HH:MM:SS"),
    "pickup_time": fields.String(),
    "delivery_time": fields.String(description="YYYY-MM-DD HH:MM:SS"),
    "customer_notes": fields.String(),
    "restaurant_notes": fields.String(),
    "card_number": fields.String()
})
