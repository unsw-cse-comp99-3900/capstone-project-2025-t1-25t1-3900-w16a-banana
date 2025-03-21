from typing import Tuple

from utils.check import *
from db_model import *
from db_model.db_query import *
from routes.restaurant.models import *


def is_valid_restaurant_info(args) -> Tuple[bool, str]:
    """
    Check fields of args which is a dictionary of restaurant's information.
    Password, Phone, State, Postcode, ABN is checked.
    """
    password = args.get('password')
    phone = args.get('phone')
    state = args.get('state')
    postcode = args.get('postcode')
    abn = args.get('abn')

    if password:
        is_safe, msg = is_password_safe(password)
        if not is_safe:
            return False, msg
    if phone:
        if not is_valid_phone(phone):
            return False, 'Invalid Phone Number'
    if state:
        if not is_valid_state(state):
            return False, 'Invalid State'
    if postcode:
        if not is_valid_postcode(postcode):
            return False, 'Invalid Postcode'
    if abn:
        if not is_valid_abn(abn):
            return False, 'Invalid Phone Number'
        
    return True, 'Valid Information'