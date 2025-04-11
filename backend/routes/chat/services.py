"""General functions for Chat APIs"""
from typing import Optional, Union, TypedDict
from db_model import Admin, Customer, Driver, Restaurant
from db_model.db_enum import ChatSupportUserType

class ChatLog(TypedDict):
    """Type for Chat log"""
    message_type: str
    message: str
    time: str

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
