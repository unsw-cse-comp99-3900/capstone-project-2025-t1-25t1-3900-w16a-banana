"""General functions for Chat APIs"""
from typing import Optional, Union, TypedDict
from db_model import Admin, Customer, Driver, Restaurant, Chat
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

def get_username(user: Union[Admin, Customer, Driver, Restaurant]) -> str:
    """Get the user name of the user"""
    user_type = type(user).__name__.upper()
    if user_type == 'ADMIN':
        return f'{user.first_name} {user.last_name}'
    elif user_type == 'CUSTOMER':
        return user.username
    elif user_type == 'DRIVER':
        return f'{user.first_name} {user.last_name}'
    elif user_type == 'RESTAURANT':
        return user.name

def format_chat(me: Union[Customer, Driver, Restaurant], chat: Chat) -> ChatLog:
    """Format list of chat into redable format"""
    my_type = can_this_user_chat(me)
    my_id = me.id
    if chat.from_id == my_id and chat.from_type == my_type:
        return {
            'message_type': 'sent',
            'message': chat.message,
            'time': chat.time.strftime("%Y-%m-%d %H:%M:%S")
        }
    else:
        return {
                'message_type': 'received',
                'message': chat.message,
                'time': chat.time.strftime("%Y-%m-%d %H:%M:%S")
        }
