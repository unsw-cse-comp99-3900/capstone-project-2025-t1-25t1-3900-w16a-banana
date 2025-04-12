"""Favourites DB"""
from utils.db import db
from db_model.base import BaseModel

class Favourites(BaseModel):
    """
    Class of Favourites restaurant DB
    Customer <-> Favourites (Many)
    """
    __tablename__ = 'favourites'
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=False)
    restaurant_id = db.Column(db.Integer, db.ForeignKey('restaurants.id'), nullable=False)
