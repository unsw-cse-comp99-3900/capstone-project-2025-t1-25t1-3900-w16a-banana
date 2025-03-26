from typing import Optional, List, TypedDict
from db_model import *
from db_model.db_query import *

class FormattedOrder(TypedDict):
    order_id: int
    customer_id: int
    driver_id: int
    restaurant_id: int 
    order_status: str
    customer_address: str 
    customer_suburb: str
    customer_state: str
    customer_postcode: str
    restaurant_address: str
    restaurant_suburb: str
    restaurant_state: str
    restaurant_postcode: str 
    order_price: float
    delivery_fee: float
    order_time: str
    pickup_time: str
    delivery_time: str
    customer_notes: str
    restaurant_notes: str

def format_order(order: CustomerOrder) -> Optional[FormattedOrder]:
    """With given order format the information that driver might need."""
    order = order.dict()
    restaurant = get_restaurant_by_id(order.restaurant_id)
    if not restaurant:
        return None

    return {
        'order_id': order.order_id,
        'customer_id': order.customer_id,
        'driver_id': order.driver_id,
        'restaurant_id': order.restaurant_id,
        'order_status': order.order_status,
        'customer_address': order.address,
        'customer_suburb': order.suburb,
        'customer_state': order.state,
        'customer_postcode': order.postcode,
        'restaurant_address': restaurant.address,
        'restaurant_suburb': restaurant.suburb,
        'restaurant_state': restaurant.state,
        'restaurant_postcode': restaurant.postcode,
        'order_price': order.order_price,
        'delivery_fee': order.delivery_fee,
        'order_time': order.order_time,
        'pickup_time': order.pickup_time,
        'delivery_time': order.delivery_time,
        'customer_notes': order.customer_notes,
        'restaurant_notes': order.restaurant_notes,
    }