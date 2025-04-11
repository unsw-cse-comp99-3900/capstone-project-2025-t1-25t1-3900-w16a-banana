"""Restaurant DB"""
from datetime import datetime
from db_model.base import BaseModel
from db_model.db_enum import RegistrationStatus, State
from utils.db import db

class Restaurant(BaseModel):
    """
    Class for Restaurant DB.
    """
    __tablename__ = 'restaurants'
    # Login info
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)

    # Basic info
    phone = db.Column(db.String(10), nullable=False)
    name = db.Column(db.String(50), nullable=False)

    # Address
    address = db.Column(db.String(255), nullable=False)
    suburb = db.Column(db.String(50), nullable=False)
    state = db.Column(db.Enum(State), nullable=False, default=State.NSW)
    postcode = db.Column(db.String(4), nullable=False)

    # shop description
    description = db.Column(db.String(255), nullable=False)

    # the restaurant should have ABN, ABN is 11 digits
    abn = db.Column(db.String(11), nullable=False)

    # during registration, the restaurant application has the status
    registration_status = db.Column(
        db.Enum(RegistrationStatus),
        nullable=False,
        default=RegistrationStatus.PENDING
    )

    # Restaurant can have profile and additional 3 images
    url_profile_image = db.Column(db.String(255), nullable=False, default="uploads/manager.png")
    url_img1 = db.Column(db.String(255), nullable=False)
    url_img2 = db.Column(db.String(255), nullable=False)
    url_img3 = db.Column(db.String(255), nullable=False)

    created_at = db.Column(db.DateTime, nullable=False, default=datetime.now)
    token = db.Column(db.String(255), nullable=True, default=None)
    role = db.Column(db.String, default="restaurant")

    def profile(self):
        """
        Return Non-Sensitive Information Only. JSON-Serialisable.
        """
        return {
            "id": self.id,
            "name": self.name,
            "phone": self.phone,
            "address": self.address,
            "suburb": self.suburb,
            "state": self.state.value,
            "postcode": self.postcode,
            "description": self.description,
            "url_profile_image": self.url_profile_image,
            "url_img1": self.url_img1,
            "url_img2": self.url_img2,
            "url_img3": self.url_img3,
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            "role": self.role,
        }
