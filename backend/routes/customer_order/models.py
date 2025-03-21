from flask_restx import Namespace, fields, reqparse

api = Namespace('customer-order', description='APIs for Customer')

"""Error Response"""
error_res= api.model("Error", {
    "message": fields.String(description="Error message", example="Error Description")
})

"""Response for customer cart get"""
single_cart_item_res = api.model('Single Cart Item Model', {
    'item_id': fields.Integer(),
    'item_name': fields.String(),
    'restaurant_id': fields.Integer(),
    'restaurant_name': fields.String(),
    'description': fields.String(),
    'price': fields.Float(),
    'quantity': fields.Integer(),
    'total_price': fields.Float(),
    'url_img': fields.String()
})

cart_item_get_res = api.model('Get All Cart Item Model', {
    'items': fields.List(fields.Nested(single_cart_item_res))
})

"""Response/Request for customer cart update"""
cart_item_update_req = api.model('Cart Item Update Request Model', {
    'item_id': fields.Integer(required=True, description='Item ID to Update', default=1),
    'quantity': fields.Integer(required=True, description='Quantity of item', default=1)
})

cart_item_update_res = api.model("Cart Item Update Response Model", {
    "message": fields.String(description="Success Message", example="Cart Item Update/Delete Successful")
})

"""Response/Request for customer viewing customer order"""
get_order_res = api.model("Get Order Response", {
    "order_id": fields.Integer(),
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

get_all_orders_res = api.model("Get All Orders Response", {
    "customer_orders": fields.List(fields.Nested(get_order_res))
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
    "order_id": fields.Integer(),
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
