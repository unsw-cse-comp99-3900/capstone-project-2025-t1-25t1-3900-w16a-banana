"""Review DB"""
from datetime import datetime
from sqlalchemy import CheckConstraint
from db_model.base import BaseModel
from db_model import Customer
from utils.db import db

class BaseReview(BaseModel):
    """
    Abstract base class for reviews.
    Shared fields: rating, review_text, url_img, reply, updated_at
    """
    __abstract__ = True

    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(
        db.Integer,
        db.ForeignKey('customers.id'),
        nullable=False
    )

    rating = db.Column(db.Integer, nullable=False)
    review_text = db.Column(db.String(255), nullable=False)
    url_img = db.Column(db.String(255), nullable=True)
    reply = db.Column(db.String(255), nullable=True)
    updated_at = db.Column(db.DateTime, default=datetime.now)

    __table_args__ = (
        CheckConstraint('rating >= 1 AND rating <= 5', name='check_rating_range'),
    )

    def format(self):
        """Format reveiw into understandable format"""
        customer: Customer = Customer.query.filter_by(id=self.customer_id).first()
        return {
            "customer_id": customer.id,
            "customer_name": customer.get_username(),
            "customer_profile_img": customer.url_profile_image,
            "review_id": self.id,
            "rating": self.rating,
            "review_text": self.review_text,
            "review_img": self.url_img,
            "reply": self.reply,
            "time": self.updated_at.strftime("%Y-%m-%d %H:%M:%S")
        }


class DriverReview(BaseReview):
    """
    Review left by customer for a driver.
    """
    __tablename__ = 'driver_reviews'
    driver_id = db.Column(
        db.Integer,
        db.ForeignKey('drivers.id'),
        nullable=False
    )


class RestaurantReview(BaseReview):
    """
    Review left by customer for a restaurant.
    """
    __tablename__ = 'restaurant_reviews'
    restaurant_id = db.Column(
        db.Integer,
        db.ForeignKey('restaurants.id'),
        nullable=False
    )
