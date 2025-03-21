"""DB Query functions"""
from typing import Optional, List
from db_model import *


"---------------------------------------------------------"
"""Functions related to Users"""
"---------------------------------------------------------"
def get_admin_by_token(token: str) -> Optional[Admin]:
    if not token:
        return None
    return Admin.query.filter_by(token=token).first()


def get_customer_by_token(token: str) -> Optional[Customer]:
    if not token:
        return None
    return Customer.query.filter_by(token=token).first()

def get_driver_by_token(token: str) -> Optional[Driver]:
    if not token:
        return None
    return Driver.query.filter_by(token=token).first()

def get_restaurant_by_token(token: str) -> Optional[Restaurant]:
    if not token:
        return None
    return Restaurant.query.filter_by(token=token).first()


"---------------------------------------------------------"
"""Functions related to Restaurant"""
"---------------------------------------------------------"
def get_restaurant_by_email(email: str)-> Optional[Restaurant]:
    """Get the Restaurant with Given Email"""
    return Restaurant.query.filter_by(email=email).first()

def get_restaurant_by_abn(abn: str)-> Optional[Restaurant]:
    """Get the Restaurant with Given ABN"""
    return Restaurant.query.filter_by(abn = abn).first()

def get_restaurant_by_menu_item_id(id: int) -> Optional[Restaurant]:
    item = get_menu_item_by_id(id)
    if not item:
        return None
    category = get_menu_category_by_id(item.category_id)
    return Restaurant.query.filter_by(restaurant_id=category.category_id).first()


"---------------------------------------------------------"
"""Functions related to Customer"""
"---------------------------------------------------------"
def get_customer_by_email(email: str) -> Optional[Customer]:
    return Customer.query.filter_by(email = email).first()

def get_customer_by_username(username: str) -> Optional[Customer]:
    return Customer.query.filter_by(username = username).first()


"---------------------------------------------------------"
"""Functions related to Customer Cart"""
"---------------------------------------------------------"
def get_all_cart_item_from_customer(customer_id: int) -> List[CartItem]:
    return CartItem.query.filter_by(customer_id=customer_id).all()

def get_cart_item_from_customer_by_id(customer_id, menu_item_id: int) -> Optional[CartItem]:
    return CartItem.query.filter_by(
        customer_id = customer_id,
        item_id = menu_item_id
    ).first()


"---------------------------------------------------------"
"""Functions related to Customer Order"""
"---------------------------------------------------------"
def get_customer_order_by_id(order_id: int) -> Optional[CustomerOrder]:
    """Get Customer Order with given ID"""
    return CustomerOrder.query.filter_by(order_id = order_id).first()

def get_customer_order_from_customer_by_id(customer_id: int, order_id: int) -> Optional[CustomerOrder]:
    """Get Customer Order from given Customer with given Order ID"""
    return CustomerOrder.query.filter_by(
        order_id = order_id,
        customer_id = customer_id
    ).first()

def get_all_customer_order_from_customer(customer_id: int) -> List[CustomerOrder]:
    """Get All Customer Orders from given Customer"""
    return CustomerOrder.query.filter_by(
        customer_id = customer_id
    ).all()

def get_all_customer_order_from_restaurant(restaurant_id: int) -> List[CustomerOrder]:
    """Get All Cusomter Orders from given Restaurant"""
    return CustomerOrder.query.filter_by(
        restaurant_id = restaurant_id
    ).all()


"---------------------------------------------------------"
"""Functions related to Menus Items"""
"---------------------------------------------------------"
def get_menu_item_by_id(id: int) -> Optional[MenuItem]:
    """Find Menu Item by its ID"""
    return MenuItem.query.filter_by(item_id=id).first()


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

def get_menu_item_from_restaurant_by_id(restaurant_id: int, id: int) -> Optional[MenuItem]:
    """Find Menu Item from given Restaurant with Given ID"""
    return MenuItem.query.join(MenuCategory).filter(
            MenuCategory.restaurant_id == restaurant_id,
            MenuItem.item_id == id
    ).first()

"---------------------------------------------------------"
"""Functions realted to Menu Categories"""
"---------------------------------------------------------"
def get_menu_category_by_id(id: int) -> Optional[MenuCategory]:
    """Find Menu Category given ID"""
    return MenuCategory.query.filter_by(category_id=id).first()


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

def get_menu_category_from_restaurant_by_id(restaurant_id: int, category_id: int) -> Optional[MenuCategory]:
    """Find Menu Category from given Restaurant with given ID"""
    return MenuCategory.query.filter_by(
        restaurant_id = restaurant_id,
        category_id = category_id
    ).first()



