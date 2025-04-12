"""Menu Category DB"""
from typing import TypedDict, Optional
from db_model.base import BaseModel
from db_model import Restaurant
from utils.db import db

class CategoryFormat(TypedDict):
    """Formatted Catetgory"""
    id: int
    name: str
    restaurant: Restaurant

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

    def format(self) -> Optional[CategoryFormat]:
        """
        Format Category to contain following
        - id: id of category
        - name: name of category
        - restaurant: Restaurant Object
        """
        try:
            restaurant: Restaurant = Restaurant.query.filter_by(id=self.restaurant_id).first()
            return {
                'id': self.id,
                'name': self.name,
                'restaurant': restaurant
            }
        except AttributeError:
            return None
