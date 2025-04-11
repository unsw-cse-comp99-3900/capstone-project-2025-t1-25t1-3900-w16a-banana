"""CartItem DB"""
from sqlalchemy import CheckConstraint, UniqueConstraint
from db_model.base import BaseModel
from utils.db import db

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
