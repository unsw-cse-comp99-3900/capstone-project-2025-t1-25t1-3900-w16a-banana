"""General functions for Chat APIs"""
from typing import Optional, Union
from db_model import Admin, Customer, Driver, Restaurant
from db_model.db_enum import ChatSupportUserType

def can_this_user_chat(
    user: Union[Admin, Customer, Driver, Restaurant]
) -> Optional[ChatSupportUserType]:
    """
    None if this user model cannot chat
    ChatSupportUserType Enum if can
    """
    try:
        return ChatSupportUserType(type(user).__name__.upper())
    except ValueError:
        return None
