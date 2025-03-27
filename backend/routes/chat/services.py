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
    
def get_user_by_id(user_type: str, id: int):
    if user_type.upper() == 'RESTAURANT':
        return get_restaurant_by_id(id)
    elif user_type.upper() == 'DRIVER':
        return get_driver_by_id(id)
    elif user_type.upper() == 'CUSTOMER':
        return get_customer_by_id(id)
    
def extract_id(user_type: str, user_model: Union[Restaurant, Driver, Customer]) -> int:
    if user_type.upper() == 'CUSTOMER':
        return user_model.customer_id
    if user_type.upper() == 'DRIVER':
        return user_model.id
    if user_type.upper() == 'RESTAURANT':
        return user_model.id