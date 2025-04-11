"""Menu Item DB"""
from db_model.base import BaseModel
from utils.db import db

class MenuItem(BaseModel):
    """
    Class for Menut Item DB.
    Each Menu Item must belong to certain category.
    """
    __tablename__ = 'menu_items'

    id = db.Column(db.Integer, primary_key=True)
    category_id = db.Column(
        db.Integer,
        db.ForeignKey('menu_categories.id'),
        nullable=False
    )
    # Basic information
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(255), nullable=False)
    price = db.Column(db.Float, nullable=False)
    url_img = db.Column(db.String(255), nullable=False)

    # the item may be available or not
    is_available = db.Column(db.Boolean, nullable=False, default=True)
