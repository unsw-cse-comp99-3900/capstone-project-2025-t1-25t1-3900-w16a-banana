"""Admin DB"""
from datetime import datetime
from db_model.base import BaseModel
from utils.db import db

class Admin(BaseModel):
    """
    Class for Admin DB.
    """
    __tablename__ = 'admins'
    # Login Info
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)

    # Basic Info
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)

    # profile page
    url_profile_image = db.Column(db.String(255), nullable=False, default="uploads/admin.png")

    created_at = db.Column(db.DateTime, default=datetime.now)
    token = db.Column(db.String(255), nullable=True, default=None)
    role = db.Column(db.String, default="admin")

    def profile(self):
        """
        Return Non-Sensitive Information Only. JSON-Serialisable.
        """
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "url_profile_image": self.url_profile_image,
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            "role": self.role,
        }
