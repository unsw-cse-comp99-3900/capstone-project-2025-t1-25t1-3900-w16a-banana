from flask_restx import Resource
from flask import request

from utils.db import db
from utils.header import auth_header, tokenize
from utils.response import res_error
from utils.check import *
from db_model import *
from db_model.db_query import *
from routes.customer_order.models import *
from routes.customer_order.services import *


@api.route('/cart')
class ShopItems(Resource):
    @api.expect(auth_header)
    @api.response(200, "Success", cart_item_get_res)
    @api.response(400, "Bad Request", error_res)
    @api.response(401, "Unauthorised", error_res)
    def get(self):
        """Get All Items' ID in the shopping cart"""
        # Check customer token
        customer = get_customer_by_token(tokenize(request.headers))
        if not customer:
            return res_error(401)

        # Get all items in the cart
        cart_items = filter_cart_items(customer_id = customer.id)
        items = format_cart_items(cart_items)

        return {'items': items}, 200
    
    @api.expect(auth_header, cart_item_update_req)
    @api.response(200, "Success", cart_item_update_res)
    @api.response(400, "Bad Request", error_res)
    @api.response(401, "Unauthorised", error_res)
    def put(self):
        """Update/Add/Remove item in the cart. Quantity 0 will remove the item."""
        customer = get_customer_by_token(tokenize(request.headers))
        if not customer:
            return res_error(401)

        data = request.json

        menu_items = filter_menus(id = data['menu_id'])
        if not menu_items:
            return res_error(400, 'Wrong Item ID')
        menu_item = menu_items[0]

        if not menu_item.is_available:
            return res_error(400, 'Item not available')

        if data['quantity'] < 0:
            return res_error(400, 'Wrong Item Quantity')

        # Check if item already exists
        cart_items = filter_cart_items(
            customer_id = customer.id,
            menu_id = data['menu_id']
        )

        message = ""
        # If there is no same item, add one
        if not cart_items:
            new_cart_item = CartItem(
                customer_id=customer.id,
                menu_id=data['menu_id'],
                quantity=data['quantity']
            )
            db.session.add(new_cart_item)
            message = "Item Added"
        # If the quantity is 0, delete the item
        elif data['quantity'] == 0:
            db.session.delete(cart_items[0])
            message = "Item Deleted"
        # Otherwise, update the item
        else:
            cart_items[0].quantity = data['quantity']
            message = "Item Updated"
        db.session.commit()

        return {'message': message}, 200


@api.route('/orders')
class GetAllOrders(Resource):
    @api.expect(auth_header)
    @api.response(200, 'Success', get_all_orders_res)
    @api.response(400, 'Bad Request', error_res)
    @api.response(401, 'Unauthorised', error_res)
    def get(self):
        "See all orders of a customer"
        customer = get_customer_by_token(tokenize(request.headers))
        if not customer:
            return res_error(401)

        orders = filter_orders(customer_id = customer.id)
        return {'orders': [order.dict() for order in orders]}, 200

@api.route('/order/<int:order_id>')
class GetOrderItems(Resource):
    @api.expect(auth_header)
    @api.response(200, 'Success', get_order_res)
    @api.response(400, 'Bad Request', error_res)
    @api.response(401, 'Unauthorised', error_res)
    def get(self, order_id: int):
        """See placed order with given ID"""
        customer = get_customer_by_token(tokenize(request.headers))
        if not customer:
            return res_error(401)

        orders = filter_orders(
            customer_id=customer.id,
            id=order_id
        )

        if not orders:
            return res_error(400, 'Invalid Order ID')
        return orders[0].dict(), 200


@api.route('/order')
class OrderItems(Resource):
    @api.expect(auth_header, post_order_req)
    @api.response(200, 'Success', post_order_res)
    @api.response(400, 'Bad Request', error_res)
    @api.response(401, 'Unauthorised', error_res)
    def post(self):
        """
        Place order for Given Restaurant ID.
        This function also works when there are items from different restaurant.
        """
        customer = get_customer_by_token(tokenize(request.headers))
        if not customer:
            return res_error(401)

        data = request.get_json()

        # Get all cart items that belong to this restaurant
        cart_items = format_cart_items_with_restaurant_filter(
            cart_items = filter_cart_items(customer_id = customer.id),
            restaurant_id = data['restaurant_id']
        )
        if not cart_items:
            return res_error(400, 'Cart Empty')

        # Check the payload for validity
        if not is_valid_state(data['state']):
            return res_error(400, 'Invalid State')
        if not is_valid_postcode(data['postcode']):
            return res_error(400, 'Invalid Postcode')
        if not is_valid_card_format(data['card_number']):
            return res_error(400, 'Invalid Card Number')

        # Make new  order with wrong info.
        new_order = make_order(
            customer_id=customer.id,
            data=data,
        )

        # Push it first
        db.session.add(new_order)
        db.session.commit()

        # Make order items. Update order accordingly.
        new_order_items = attach_order_items(
            order=new_order,
            formatted_cart_items=cart_items
        )

        # Push each order item
        for new_order_item in new_order_items:
            db.session.add(new_order_item)
        db.session.commit()

        # Empty the cart
        empty_cart_items_from_restaurant(customer.id, data['restaurant_id'])

        return new_order.dict(), 200
