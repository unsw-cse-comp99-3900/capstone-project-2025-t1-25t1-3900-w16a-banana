from typing import Optional, List
from sqlalchemy.orm.query import Query
from db_model import Restaurant, MenuCategory, MenuItem
from flask_restx import reqparse
from utils.header import check_token

def get_restaurant_by_header(header: reqparse.RequestParser) -> Optional[Restaurant]:
    return check_token(header, Restaurant)

def get_all_menu_categories(ownerRestaurant: Restaurant) -> List[MenuCategory]:
    """Returns a list of all menu categories for the given restaurant."""
    return MenuCategory.query.filter_by(
        restaurant_id=ownerRestaurant.restaurant_id
    ).all()

def get_menu_category_by_name(ownerRestaurant: Restaurant, category_name: str) -> Optional[MenuCategory]:
    """Returns a single menu category by name for the given restaurant, or None if not found."""
    return MenuCategory.query.filter_by(
        restaurant_id = ownerRestaurant.restaurant_id,
        name = category_name
    ).first()

def get_menu_category_by_id(ownerRestaurant: Restaurant, category_id: int) -> Optional[MenuCategory]:
    """Returns a single menu category by ID for the given restaurant, or None if not found."""
    return MenuCategory.query.filter_by(
        restaurant_id = ownerRestaurant.restaurant_id, category_id = category_id
    ).first()


def get_all_menu_items(menuCategory: MenuCategory) -> List[MenuItem]:
    """Returns a list of all menu categories for the given category."""
    return MenuItem.query.filter_by(
        category_id=menuCategory.category_id
    ).all()


def get_menu_item_by_category_item_id(menuCategory: MenuCategory, item_id: int) -> Optional[MenuItem]:
    """Returns a list of all menu categories with given ID."""
    return MenuItem.query.filter_by(
        category_id = menuCategory.category_id,
        item_id = item_id
    ).first()

def get_menu_item_by_category_item_name(menuCategory: MenuCategory, item_name: str) -> Optional[MenuItem]:
    """Returns a list of all menu categories with given Name."""
    return MenuItem.query.filter_by(
        category_id = menuCategory.category_id,
        name = item_name
    ).first()


def get_menu_all_items_by_restaurant(restaurant: Restaurant) -> Query:
    return MenuItem.query.join(MenuCategory).filter(
            MenuCategory.restaurant_id == restaurant.restaurant_id
    )

def get_menu_item_by_restaurant_item_id(restaurant: Restaurant, item_id: int) -> Optional[MenuItem]:
    """Returns a item of a given restaurant with given item id"""
    return MenuItem.query.join(MenuCategory).filter(
            MenuCategory.restaurant_id == restaurant.restaurant_id,
            MenuItem.item_id == item_id
    ).first()

def get_menu_item_by_restaurant_item_name(restaurant: Restaurant, item_name: str) -> Optional[MenuItem]:
    """Returns a item of a given restaurant with given item name"""
    return MenuItem.query.join(MenuCategory).filter(
            MenuCategory.restaurant_id == restaurant.restaurant_id,
            MenuItem.item_id == item_name
    ).first()