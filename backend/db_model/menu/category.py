"""Menu Category DB"""
from db_model.base import BaseModel
from utils.db import db

class MenuCategory(BaseModel):
    """
    Class for Menu Category DB.
    Every menu items will be contained in a menu category
    Consists of id, restaurant id and its name
    """
    __tablename__ = 'menu_categories'

    id = db.Column(db.Integer, primary_key=True)
    restaurant_id = db.Column(
        db.Integer,
        db.ForeignKey('restaurants.id'),
        nullable=False
    )
    name = db.Column(db.String(50), nullable=False)
