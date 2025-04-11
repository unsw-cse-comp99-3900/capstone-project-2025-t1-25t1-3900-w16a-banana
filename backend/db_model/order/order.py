"""Order, OrderItem DB"""
from datetime import datetime
from db_model.base import BaseModel
from db_model.db_enum import OrderStatus, State
from utils.db import db

class Order(BaseModel):
    """
    Class for Order DB.
    This contains all the relevant information about order,
    including: Customer, Restaurant, Driver involved,
    address, order price, delivery fee, order time and notes.
    """
    __tablename__ = 'orders'

    id = db.Column(db.Integer, primary_key=True)

    # the order relates to one customer, one driver, and one restaurant
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=False)
    driver_id = db.Column(db.Integer, db.ForeignKey('drivers.id'), nullable=True)
    restaurant_id = db.Column(
        db.Integer,
        db.ForeignKey('restaurants.id'),
        nullable=False
    )

    # order stataus
    order_status = db.Column(db.Enum(OrderStatus), nullable=False, default=OrderStatus.PENDING)

    # the order should have the delivery address, suburb, state, postcode
    address = db.Column(db.String(255), nullable=False)
    suburb = db.Column(db.String(50), nullable=False)
    state = db.Column(db.Enum(State), nullable=False, default=State.NSW)
    postcode = db.Column(db.String(4), nullable=False)

    # the order price: order price, delivery fee, total price
    order_price = db.Column(db.Float, nullable=False)
    delivery_fee = db.Column(db.Float, nullable=False)
    total_price = db.Column(db.Float, nullable=False)

    # the order should have order time, pickup time, delivery time
    order_time = db.Column(db.DateTime, default=datetime.now)
    pickup_time = db.Column(db.DateTime, nullable=True, default=None)
    delivery_time = db.Column(db.DateTime, nullable=True, default=None)

    # the customer or the restaurant can leave some notes
    customer_notes = db.Column(db.String(255), nullable=True)
    restaurant_notes = db.Column(db.String(255), nullable=True)

    # the customer payment (a fake payment record)
    card_number = db.Column(db.String(16), nullable=False)

# each order contains many items, here we define one order to be one restaurant
class OrderItem(BaseModel):
    """
    Class for Order Item DB. Refers to Order
    One (Order) <-> Many (Order Item)
    """
    __tablename__ = 'order_items'

    id = db.Column(db.Integer, primary_key=True)

    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    menu_id = db.Column(db.Integer, db.ForeignKey('menu_items.id'), nullable=False)

    # the item price may be changed, so here needs to save the price when the order is made
    price = db.Column(db.Float, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
