from typing import Optional, Union
from db_model import *
from db_model.db_query import *

def get_user_by_token(token: str) -> Optional[Union[Customer, Restaurant, Driver]]:
    restuarant = get_restaurant_by_token(token)
    driver = get_driver_by_token(token)
    customer = get_customer_by_token(token)
    if restuarant:
        return restuarant
    if driver:
        return driver
    if customer:
        return customer
    return None

def get_user_by_id(user_type: str, user_id: int):
    """Find user of given type and id"""
    if user_type.upper() == 'RESTAURANT':
        restaurants = filter_restaurants(id = user_id)
        return restaurants[0] if restaurants else None
    elif user_type.upper() == 'DRIVER':
        drivers = filter_drivers(id = user_id)
        return drivers[0] if drivers else None
    elif user_type.upper() == 'CUSTOMER':
        customers = filter_customers(id = user_id)
        return customers[0] if customers else None