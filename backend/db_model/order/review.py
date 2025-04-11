"""Review DB"""
from datetime import datetime
from sqlalchemy import CheckConstraint
from db_model.base import BaseModel
from utils.db import db

class DriverReview(BaseModel):
    """
    Class for Driver Review DB.
    After the order, the customer can leave one review for the Driver.
    A Driver can leave one comment under that.
    A review is allowed to be updated. A review can have 1 image.
    """
    __tablename__ = 'driver_reviews'

    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(
        db.Integer,
        db.ForeignKey('customers.id'),
        nullable=False
    )
    driver_id = db.Column(
        db.Integer,
        db.ForeignKey('drivers.id'),
        nullable=False
    )

    # the review can have rating 1 - 5, some text, and maximum 1 images
    rating = db.Column(db.Integer, nullable=False)
    review_text = db.Column(db.String(255), nullable=False)
    url_img = db.Column(db.String(255), nullable=True)
    reply = db.Column(db.String(255), nullable=True)

    # created at and updated at
    updated_at = db.Column(db.DateTime, default=datetime.now)

    __table_args__ = (
        CheckConstraint('rating >= 1 AND rating <= 5', name='check_rating_range'),
    )

class RestaurantReview(BaseModel):
    """
    Class for Restaurant Review DB.
    After the order, the customer can leave one review for the restaurant.
    A restaurant can leave one comment under that.
    A review is allowed to be updated. A review can have 1 image.
    """
    __tablename__ = 'restaurant_reviews'

    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(
        db.Integer,
        db.ForeignKey('customers.id'),
        nullable=False
    )
    restaurant_id = db.Column(
        db.Integer,
        db.ForeignKey('restaurants.id'),
        nullable=False
    )

    # the review can have rating 1 - 5, some text, and maximum 1 images
    rating = db.Column(db.Integer, nullable=False)
    review_text = db.Column(db.String(255), nullable=False)
    url_img = db.Column(db.String(255), nullable=True)
    reply = db.Column(db.String(255), nullable=True)

    # created at and updated at
    updated_at = db.Column(db.DateTime, default=datetime.now)

    __table_args__ = (
        CheckConstraint('rating >= 1 AND rating <= 5', name='check_rating_range'),
    )
