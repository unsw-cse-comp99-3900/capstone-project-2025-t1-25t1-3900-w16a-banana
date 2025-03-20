from flask_restx import Resource
from flask import request

from utils.db import db
from utils.header import auth_header, get_token_from_header
from utils.response import res_error
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
        customer = get_customer_by_token(get_token_from_header(auth_header))
        if not customer:
            return res_error(401)

        # Get all items in the cart
        cart_items = get_all_cart_item_from_customer(customer.customer_id)
        items = format_cart_items(cart_items)

        return {'items': items}, 200
    
    @api.expect(auth_header, cart_item_update_req)
    @api.response(200, "Success", cart_item_update_res)
    @api.response(400, "Bad Request", error_res)
    @api.response(401, "Unauthorised", error_res)
    def put(self):
        """Update/Add/Remove item in the cart. Quantity 0 will remove the item."""
        customer = get_customer_by_token(get_token_from_header(auth_header))
        if not customer:
            return res_error(401)

        data = request.json

        menu_item = get_menu_item_by_id(data['item_id'])
        if not menu_item:
            return res_error(400, 'Wrong Item ID')
        
        if not menu_item.is_available:
            return res_error(400, 'Item not available')

        if data['quantity'] < 0:
            return res_error(400, 'Wrong Item Quantity')

        # Check if item already exists
        cart_item = get_cart_item_from_customer_by_id(
            customer_id=customer.customer_id,
            menu_item_id=data['item_id']
        )

        message = ""
        # If there is no same item, add one
        if not cart_item:
            new_cart_item = CartItem(
                customer_id=customer.customer_id,
                item_id=data['item_id'],
                quantity=data['quantity']
            )
            db.session.add(new_cart_item)
            message = "Item Added"
        # If the quantity is 0, delete the item
        elif data['quantity'] == 0:
            db.session.delete(cart_item)
            message = "Item Deleted"
        # Otherwise, update the item
        else:
            cart_item.quantity = data['quantity']
            message = "Item Updated"
        db.session.commit()

        return {'message': message}, 200


@api.route('/order')
class OrderItems(Resource):
    @api.expect(auth_header, post_order_req)
    def post(self):
        """Place order for Given Restaurant ID"""
        customer = get_customer_by_token(get_token_from_header(auth_header))
        if not customer:
            return res_error(401)
        
        data = request.get_json()
        
        cart_items = get_all_cart_item_from_customer(customer.customer_id)

        cart_items = format_cart_items_with_restaurant_filter(
            cart_items = cart_items,
            restaurant_id = data['restaurant_id']
        )

        if not cart_items:
            return res_error(400, 'Wrong Restaurant ID')
        
        try:
            State(data['state'])
        except ValueError:
            return res_error(401, 'Invalid State')
        
        # Make new menu items
        new_customer_order = format_customer_order(
            customer_id=customer.customer_id,
            data=data,
        )

        db.session.add(new_customer_order)
        db.session.commit()

        new_order_items = format_order_items(
            customer_order=new_customer_order,
            formatted_cart_items=cart_items
        )

        for new_order_item in new_order_items:
            db.session.add(new_order_item)
        db.session.commit()

        return new_customer_order.dict(), 200