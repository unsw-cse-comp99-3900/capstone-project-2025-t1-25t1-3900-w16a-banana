"""DB Query functions"""
from collections import defaultdict
from typing import Optional, List

from sqlalchemy import or_, and_
from db_model import *

#--------------------------------------------------------#
#---------------Functions related to Users---------------#
#--------------------------------------------------------#
def get_admin_by_token(token: str) -> Optional[Admin]:
    """Find Admin with given token"""
    return Admin.query.filter_by(token=token).first()


def get_customer_by_token(token: str) -> Optional[Customer]:
    """Find Customer with given token"""
    return Customer.query.filter_by(token=token).first()

def get_driver_by_token(token: str) -> Optional[Driver]:
    """Find Driver with given token"""
    return Driver.query.filter_by(token=token).first()

def get_restaurant_by_token(token: str) -> Optional[Restaurant]:
    """Find Restaurant with given token"""
    return Restaurant.query.filter_by(token=token).first()


#--------------------------------------------------------#
#-------------Functions related to Restaurant-------------#
#--------------------------------------------------------#
def get_restaurant_by_id(id: int)-> Optional[Restaurant]:
    """Get the Restaurant with Given id"""
    return Restaurant.query.filter_by(restaurant_id=id).first()

def get_restaurant_by_email(email: str)-> Optional[Restaurant]:
    """Get the Restaurant with Given Email"""
    return Restaurant.query.filter_by(email=email).first()

def get_restaurant_by_abn(abn: str)-> Optional[Restaurant]:
    """Get the Restaurant with Given ABN"""
    return Restaurant.query.filter_by(abn = abn).first()

def get_restaurant_by_menu_id(menu_id: int) -> Optional[Restaurant]:
    item = get_menu_item_by_id(menu_id)
    if not item:
        return None
    category = get_menu_category_by_id(item.category_id)
    return Restaurant.query.filter_by(restaurant_id=category.category_id).first()


#--------------------------------------------------------#
#-------------Functions related to Customer-------------#
#--------------------------------------------------------#
def get_customer_by_id(id: int) -> Optional[Customer]:
    """Get Customer by ID"""
    return Customer.query.filter_by(customer_id = id).first()

def get_customer_by_email(email: str) -> Optional[Customer]:
    return Customer.query.filter_by(email = email).first()

def get_customer_by_username(username: str) -> Optional[Customer]:
    return Customer.query.filter_by(username = username).first()

#--------------------------------------------------------#
#--------------Functions related to Driver--------------#
#--------------------------------------------------------#
def get_driver_by_id(id: int) -> Optional[Driver]:
    """Get Driver by ID"""
    return Driver.query.filter_by(driver_id = id).first()


#--------------------------------------------------------#
#-----------Functions related to Customer Cart------------#
#--------------------------------------------------------#
def get_all_cart_item_from_customer(customer_id: int) -> List[CartItem]:
    return CartItem.query.filter_by(customer_id=customer_id).all()

def get_cart_item_from_customer_by_id(customer_id, menu_id: int) -> Optional[CartItem]:
    return CartItem.query.filter_by(
        customer_id = customer_id,
        menu_id = menu_id
    ).first()


#--------------------------------------------------------#
#---------------Functions related to Order---------------#
#--------------------------------------------------------#
def get_order_by_id(order_id: int) -> Optional[Order]:
    """Get Order with given ID"""
    return Order.query.filter_by(id = order_id).first()

def get_order_from_customer_by_id(customer_id: int, order_id: int) -> Optional[Order]:
    """Get Order from given Customer with given Order ID"""
    return Order.query.filter_by(
        id = order_id,
        customer_id = customer_id
    ).first()

def get_orders_by_customer(customer_id: int) -> List[Order]:
    """Get All Orders from given Customer"""
    return Order.query.filter_by(
        customer_id = customer_id
    ).all()

def get_orders_for_restaurant(restaurant_id: int) -> List[Order]:
    """Get All Orders from given Restaurant"""
    return Order.query.filter_by(
        restaurant_id = restaurant_id
    ).all()

def get_orders_waiting_driver() -> List[Order]:
    """Get All Orders that is waiting for driver"""
    return Order.query.filter(
        Order.driver_id.is_(None),
        Order.order_status != OrderStatus.CANCELLED
    ).all()


#--------------------------------------------------------#
#------------Functions related to Menu Items------------#
#--------------------------------------------------------#
def get_menu_item_by_id(id: int) -> Optional[MenuItem]:
    """Find Menu Item by its ID"""
    return MenuItem.query.filter_by(id=id).first()


def get_all_menu_items_from_category(category_id: int) -> List[MenuItem]:
    """Get all menus in the given category"""
    return MenuItem.query.filter_by(category_id=category_id).all()

def get_all_menu_items_from_restaurant(restaurant_id: int) -> List[MenuItem]:
    return MenuItem.query.join(MenuCategory).filter(
            MenuCategory.restaurant_id == restaurant_id
    ).all()

def get_menu_item_from_category_by_name(category_id: int, name: str) -> Optional[MenuItem]:
    return MenuItem.query.filter_by(
        category_id = category_id,
        name = name
    ).first()

def get_menu_item_from_restaurant_by_name(restaurant_id: int, name: str) -> Optional[MenuItem]:
    """Find Menu Item from given Restaurant with Given Name"""
    return MenuItem.query.join(MenuCategory).filter(
            MenuCategory.restaurant_id == restaurant_id,
            MenuItem.name == name
    ).first()

def get_menu_item_from_restaurant_by_id(restaurant_id: int, menu_id: int) -> Optional[MenuItem]:
    """Find Menu Item from given Restaurant with Given ID"""
    return MenuItem.query.join(MenuCategory).filter(
            MenuCategory.restaurant_id == restaurant_id,
            MenuItem.id == menu_id
    ).first()

#--------------------------------------------------------#
#-----------Functions related to Menu Category-----------#
#--------------------------------------------------------#
def get_menu_category_by_id(category_id: int) -> Optional[MenuCategory]:
    """Find Menu Category given ID"""
    return MenuCategory.query.filter_by(category_id=category_id).first()


def get_all_menu_categories_from_restaurant(restaurant_id: int) -> List[MenuCategory]:
    """Find All Menu Category from given Restaurant"""
    return MenuCategory.query.filter_by(
        restaurant_id=restaurant_id
    ).all()


def get_menu_category_from_restaurant_by_name(restaurant_id: int, category_name: str) -> Optional[MenuCategory]:
    """Find Menu Category from given Restaurant with given Name"""
    return MenuCategory.query.filter_by(
        restaurant_id = restaurant_id,
        name = category_name
    ).first()

def get_menu_category_from_restaurant_by_id(
        restaurant_id: int,
        category_id: int
    ) -> Optional[MenuCategory]:
    """Find Menu Category from given Restaurant with given ID"""
    return MenuCategory.query.filter_by(
        restaurant_id = restaurant_id,
        category_id = category_id
    ).first()


#--------------------------------------------------------#
#---------------Functions related to Chat---------------#
#--------------------------------------------------------#
def get_chats_by_user(user_type: ChatSupportUserType, user_id: int):
    """
    Get all chats involving the user and group them by the other user involved.

    :param user_type: Enum value of ChatSupportUserType (e.g., ChatSupportUserType.Customer)
    :param user_id: Integer user ID
    :return: Dictionary grouped by (other_user_type, other_user_id)
    """
    chats = Chat.query.filter(
        or_(
            (Chat.from_type == user_type) & (Chat.from_id == user_id),
            (Chat.to_type == user_type) & (Chat.to_id == user_id)
        )
    ).order_by(Chat.time.asc()).all()

    grouped_chats = defaultdict(list)

    for chat in chats:
        if chat.from_type == user_type and chat.from_id == user_id:
            other_user = (chat.to_type, chat.to_id)
        else:
            other_user = (chat.from_type, chat.from_id)
        grouped_chats[other_user].append(chat)

    return grouped_chats

def get_chats_between_users(
        user1_type: ChatSupportUserType, user1_id: int,
        user2_type: ChatSupportUserType, user2_id: int
    ) -> List[Chat]:
    """
    Get all chat logs exchanged between two users (in either direction).

    :param user1_type: Enum value of ChatSupportUserType (e.g., ChatSupportUserType.Customer)
    :param user1_id: Integer ID of the first user
    :param user2_type: Enum value of ChatSupportUserType
    :param user2_id: Integer ID of the second user
    :return: List of Chat objects sorted by time
    """
    chats = Chat.query.filter(
        or_(
            and_(Chat.from_type == user1_type, Chat.from_id == user1_id,
                 Chat.to_type == user2_type, Chat.to_id == user2_id),
            and_(Chat.from_type == user2_type, Chat.from_id == user2_id,
                 Chat.to_type == user1_type, Chat.to_id == user1_id)
        )
    ).order_by(Chat.time.asc()).all()
    return chats
