"""Driver DB"""
from datetime import datetime
from db_model.db_enum import RegistrationStatus
from utils.db import db
from .user import User

class Driver(User):
    """
    Class for Driver DB.
    """
    __tablename__ = 'drivers'
    # Login info
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)

    # Basic Info
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    phone = db.Column(db.String(10), nullable=False)

    # License Number and Car plate
    license_number = db.Column(db.String(50), nullable=False)
    car_plate = db.Column(db.String(6), nullable=False)

    # the driver should have the driver license image, registration paper
    # these can be pdf or image format
    url_license_image = db.Column(db.String(255), nullable=False)
    url_registration_paper = db.Column(db.String(255), nullable=False)

    # during registration, the driver application has the status
    registration_status = db.Column(
        db.Enum(RegistrationStatus),
        nullable=False,
        default=RegistrationStatus.PENDING
    )
    # the driver can have a profile
    url_profile_image = db.Column(db.String(255), nullable=False, default="uploads/driver.png")

    created_at = db.Column(db.DateTime, default=datetime.now)
    token = db.Column(db.String(255), nullable=True, default=None)
    role = db.Column(db.String, default="driver")

    def get_username(self) -> str:
        return f'{self.first_name} {self.last_name}'

    def get_profile(self):
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "phone": self.phone,
            "car_plate": self.car_plate,
            "url_profile_image": self.url_profile_image,
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            "role": self.role,
        }
