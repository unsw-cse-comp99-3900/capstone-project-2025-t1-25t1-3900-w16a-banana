"""Customer DB"""
from datetime import datetime
from db_model.base import BaseModel
from db_model.db_enum import State
from utils.db import db

class Customer(BaseModel):
    """
    Class for Customer DB.
    Contains id, username, email, password, phone, address,
    suburb, state, postcode, token, url_profile_image, created_at
    """
    __tablename__ = 'customers'
    # Login Info
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)

    # Basic Info
    username = db.Column(db.String(50), unique=True, nullable=False)
    phone = db.Column(db.String(10), nullable=False)

    # Address: address, suburb, state, postcode
    address = db.Column(db.String(255), nullable=False)
    suburb = db.Column(db.String(50), nullable=False)
    state = db.Column(db.Enum(State), nullable=False, default=State.NSW)
    postcode = db.Column(db.String(4), nullable=False)

    # Customer Profile Image URL
    url_profile_image = db.Column(db.String(255), nullable=False, default="uploads/customer.png")

    created_at = db.Column(db.DateTime, default=datetime.now)
    token = db.Column(db.String(255), nullable=True, default=None)
    role = db.Column(db.String, default="customer")

    def profile(self):
        """
        Return Non-Sensitive Information Only. JSON-Serialisable.
        """
        return {
            "id": self.id,
            "username": self.username,
            "phone": self.phone,
            "url_profile_image": self.url_profile_image,
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            "role": self.role,
        }
