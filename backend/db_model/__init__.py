"""This is a module that contains DB Schema Model"""
from .base import BaseModel
from .user.admin import Admin
from .user.customer import Customer
from .user.driver import Driver
from .user.restaurant import Restaurant
from .menu.category import MenuCategory
from .menu.item import MenuItem
from .order.cart import CartItem
from .order.order import Order, OrderItem
from .order.review import DriverReview, RestaurantReview
from .chat import Chat
from .favourites import Favourites
