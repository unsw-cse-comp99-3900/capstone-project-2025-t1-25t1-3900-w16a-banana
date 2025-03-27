"""Common functions for customer order goes here."""
from typing import List, TypedDict, Any
from db_model import *
from db_model.db_query import *
from utils.db import db

class FormatCartItems(TypedDict):
    menu_id: int 
    menu_name: str
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
        restaurant = get_restaurant_by_menu(cart_item.menu_id)
        menus = filter_menu_items(id = cart_item.menu_id)
        menu = menus[0]
        items.append({
            'menu_id': menu.id,
            'menu_name': menu.name,
            'restaurant_id': restaurant.id,
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
        restaurant = get_restaurant_by_menu(cart_item.menu_id)
        if restaurant.id != restaurant_id:
            continue
        menus = filter_menu_items(id = cart_item.menu_id)
        menu = menus[0]
        items.append({
            'menu_id': menu.id,
            'menu_name': menu.name,
            'restaurant_id': restaurant.id,
            'restaurant_name': restaurant.name,
            'description': menu.description,
            'price': menu.price,
            'quantity': cart_item.quantity,
            'total_price': cart_item.quantity * menu.price,
            'url_img': menu.url_img
        })

    return items

def make_order(
        customer_id: int,
        data: Any #This will be json data
) -> Order:
    """
    Make Order with limited information.
    Have no order items attached.
    """
    # Make fake order
    return Order(
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
        order: Order,
        formatted_cart_items: List[FormatCartItems]
) -> List[OrderItem]:
    """
    Attach order items to given Order.
    Order will now have updated information.
    """
    order_items: List[OrderItem] = []
    total_price = 0
    for formatted_cart_item in formatted_cart_items:
        total_price += formatted_cart_item['total_price']
        order_items.append(OrderItem(
            order_id = order.id,
            menu_id = formatted_cart_item['menu_id'],
            price = formatted_cart_item['price'],
            quantity = formatted_cart_item['quantity'],
        ))

    # TODO: Add delivery fee calculation
    order.order_price = total_price
    order.delivery_fee = 8
    order.total_price = order.order_price + order.delivery_fee

    return order_items

def empty_cart_items_from_restaurant(
        customer_id: int,
        restaurant_id: int
    ) -> None:
    """Remove all cart items from customer from given restaurant"""
    cart_items = filter_cart_items(customer_id = customer_id)
    for cart_item in cart_items:
        restaurant = get_restaurant_by_menu(cart_item.menu_id)
        if restaurant.id == restaurant_id:
            db.session.delete(cart_item)
    db.session.commit()
