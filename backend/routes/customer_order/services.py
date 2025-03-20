"""Common functions for customer order goes here."""
from typing import List, TypedDict, Tuple, Any
from db_model import *
from db_model.db_query import *
from utils.db import db

class FormatCartItems(TypedDict):
    item_id: int 
    item_name: str
    restaurant_id: int
    restaurant_name: str
    description: str
    price: float
    quantity: int
    total_price: float
    url_img: str

def format_cart_items(cart_items: List[CartItem]) -> List[FormatCartItems]:
    """Format raw cart item model into more understandable format"""
    items = []
    for cart_item in cart_items:
        restaurant = get_restaurant_by_menu_item_id(cart_item.item_id)
        menu = get_menu_item_by_id(cart_item.item_id)
        items.append({
            'item_id': menu.item_id,
            'item_name': menu.name,
            'restaurant_id': restaurant.restaurant_id,
            'restaurant_name': restaurant.name,
            'description': menu.description,
            'price': menu.price,
            'quantity': cart_item.quantity,
            'total_price': cart_item.quantity * menu.price,
            'url_img': menu.url_img
        })

    return items

def format_cart_items_with_restaurant_filter(cart_items: List[CartItem], restaurant_id: int) -> List[FormatCartItems]:
    """
    Format raw cart item model into more understandable format.
    Filter cart items from given restaurant id
    """
    items = []
    for cart_item in cart_items:
        restaurant = get_restaurant_by_menu_item_id(cart_item.item_id)
        if restaurant.restaurant_id != restaurant_id:
            continue
        menu = get_menu_item_by_id(cart_item.item_id)
        items.append({
            'item_id': menu.item_id,
            'item_name': menu.name,
            'restaurant_id': restaurant.restaurant_id,
            'restaurant_name': restaurant.name,
            'description': menu.description,
            'price': menu.price,
            'quantity': cart_item.quantity,
            'total_price': cart_item.quantity * menu.price,
            'url_img': menu.url_img
        })

    return items

# TODO: Add delivery fee calculation
def make_customer_order(
        customer_id: int,
        data: Any #This will be json data
) -> CustomerOrder:
    """
    Make customer order with limited information.
    Have no order items attached.
    """
    # Make fake order
    return CustomerOrder(
        customer_id = customer_id,
        restaurant_id = data['restaurant_id'],
        address = data['address'],
        suburb = data['suburb'],
        state = State(data['state']),
        postcode = data['postcode'],
        order_price = 0,
        delivery_fee = 0,
        total_price = 0,
        customer_notes = data['customer_notes'],
        card_number = data['card_number']
    )

def attach_order_items(
        customer_order: CustomerOrder,
        formatted_cart_items: List[FormatCartItems]
) -> List[OrderItem]:
    """
    Attach order items to given customer order.
    Customer order will now have updated information.
    """
    order_items: List[OrderItem] = []
    total_price = 0
    for formatted_cart_item in formatted_cart_items:
        total_price += formatted_cart_item['total_price']
        order_items.append(OrderItem(
            order_id = customer_order.order_id,
            item_id = formatted_cart_item['item_id'],
            price = formatted_cart_item['price'],
            quantity = formatted_cart_item['quantity'],
        ))

    # TODO: Add delivery fee calculation
    customer_order.order_price = total_price
    customer_order.delivery_fee = 8
    customer_order.total_price = customer_order.order_price + customer_order.delivery_fee
    
    return order_items

def empty_cart_items_from_restaurant(customer_id: int, restaurant_id: int) -> None:
    cart_items = get_all_cart_item_from_customer(customer_id)
    for cart_item in cart_items:
        restaurant = get_restaurant_by_menu_item_id(cart_item.item_id)
        if restaurant.restaurant_id == restaurant_id:
            db.session.delete(cart_item)
    db.session.commit()