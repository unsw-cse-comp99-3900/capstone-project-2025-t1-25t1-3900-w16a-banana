"""Common functions for customer order goes here."""
from typing import List, TypedDict, Any
from utils.db import db
from db_model import CartItem, Order, OrderItem
from db_model.db_enum import State
from db_model.db_query import filter_cart_items

class FormatCartItems(TypedDict):
    """Type for formatted cart item. For API result type annotation."""
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
        cart_format = cart_item.format()
        if not cart_format:
            continue
        menu = cart_format.get('menu')
        restaurant = cart_format.get('restaurant')
        quantity = cart_format.get('quantity')
        items.append({
            'menu_id': menu.id,
            'menu_name': menu.name,
            'restaurant_id': restaurant.id,
            'restaurant_name': restaurant.name,
            'description': menu.description,
            'price': menu.price,
            'quantity': quantity,
            'total_price': quantity * menu.price,
            'url_img': menu.url_img
        })

    return items


def format_cart_items_v2(cart_items: List[CartItem]):
    """Format raw cart items, group under each restaurant"""
    result_dict = {}

    # iterate each cart item, group by restaurant id
    for item in cart_items:
        cart_format = item.format()
        restaurant = cart_format.get('restaurant')
        menu = cart_format.get('menu')

        # if the restaurant is not in the result_dict, add it
        if restaurant.id not in result_dict:
            result_dict[restaurant.id] = {
                'restaurant_id': restaurant.id,
                'restaurant_name': restaurant.name,
                'restaurant_img': restaurant.url_img1,
                'items': [],
            }

            # also add the restaurant address
            address = {
                'address': restaurant.address,
                'suburb': restaurant.suburb,
                'state': restaurant.state.value,
                'postcode': restaurant.postcode,
            }

            result_dict[restaurant.id]["address"] = address
        
        # add the menu item to the restaurant
        result_dict[restaurant.id]['items'].append({
            'menu_id': menu.id,
            'menu_name': menu.name,
            'price': menu.price,
            'quantity': item.quantity,
            'total_price': item.quantity * menu.price,
            'url_img': menu.url_img
        })

    # convert the result_dict to a list of dictionaries, order by the restaurant_id
    result_list = [v for v in result_dict.values()]
    result_list.sort(key=lambda x: x['restaurant_id'])

    return result_list


def format_cart_items_with_restaurant_filter(
        cart_items: List[CartItem], restaurant_id: int
) -> List[FormatCartItems]:
    """
    Format raw cart item model into more understandable format.
    Filter cart items from given restaurant id
    """
    items = []
    for cart_item in cart_items:
        cart_format = cart_item.format()
        restaurant = cart_format.get('restaurant')
        if restaurant.id != restaurant_id:
            continue
        menu = cart_format.get('menu')
        quantity = cart_format.get('quantity')
        items.append({
            'menu_id': menu.id,
            'menu_name': menu.name,
            'restaurant_id': restaurant.id,
            'restaurant_name': restaurant.name,
            'description': menu.description,
            'price': menu.price,
            'quantity': quantity,
            'total_price': quantity * menu.price,
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
        order_price = round(data['order_price'], 2),
        delivery_fee = round(data['delivery_fee'], 2),
        total_price = round(data['total_price'], 2),
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

    for formatted_cart_item in formatted_cart_items:
        order_items.append(OrderItem(
            order_id = order.id,
            menu_id = formatted_cart_item['menu_id'],
            price = formatted_cart_item['price'],
            quantity = formatted_cart_item['quantity'],
        ))

    return order_items

def empty_cart_items_from_restaurant(
        customer_id: int,
        restaurant_id: int
    ) -> None:
    """Remove all cart items from customer from given restaurant"""
    cart_items = filter_cart_items(customer_id = customer_id)
    for cart_item in cart_items:
        restaurant = cart_item.format().get('restaurant')
        if restaurant.id == restaurant_id:
            db.session.delete(cart_item)
    db.session.commit()
