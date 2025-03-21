from db_model import *
from db_model.db_query import *

def is_valid_order_action(action: str) -> bool:
    return action in ['accept', 'reject', 'ready']