"""CartItem DB"""
from typing import Optional, TypedDict
from sqlalchemy import CheckConstraint, UniqueConstraint
from db_model.base import BaseModel
from db_model import Restaurant, MenuCategory, MenuItem
from utils.db import db

class CartFormat(TypedDict):
    """Formatted Cart Items"""
    customer_id: int
    restaurant: Restaurant
    category: MenuCategory
    menu: MenuItem
    quantity: int

class CartItem(BaseModel):
    """
    Class for Cart Item DB. Items that customer put into the cart.
    One (Customer) <-> Many (Cart Items)
    """
    __tablename__ = "cart_items"

    # Customer whom the cart belongs
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), primary_key=True)

    # Item that is in the cart
    menu_id = db.Column(db.Integer, db.ForeignKey('menu_items.id'), primary_key=True)
    quantity = db.Column(db.Integer, nullable=False)

    # Make sure that quantity is greater than 0.
    __table_args__ = (
        CheckConstraint("quantity > 0", name="quantity_positive"),
        UniqueConstraint("customer_id", "menu_id", name="Unique Item In Cart")
    )

    def format(self) -> Optional[CartFormat]:
        """
        Format Cart Item to Contain Following Fields:
        - customer_id: int
        - restaurant: Restaurant
        - category: MenuCategory
        - menu: MenuItem
        - quantity: int
        """
        try:
            menu: MenuItem = MenuItem.query.filter_by(id=self.menu_id).first()
            category: MenuCategory = MenuCategory.query.filter_by(id=menu.category_id).first()
            restaurant: Restaurant = Restaurant.query.filter_by(id=category.restaurant_id).first()
            return {
                'customer_id': self.customer_id,
                'restaurant': restaurant,
                'category': category,
                'menu': menu,
                'quantity': self.quantity
            }
        except AttributeError:
            return None
