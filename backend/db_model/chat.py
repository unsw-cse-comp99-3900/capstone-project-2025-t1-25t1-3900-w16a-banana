"""Chat DB"""
from datetime import datetime
from utils.db import db
from db_model.base import BaseModel
from db_model.db_enum import ChatSupportUserType

class Chat(BaseModel):
    """
    Class of Chat DB.
    The type of sender, receiver, and their id must be specified.
    """
    __tablename__ = 'chat'
    id = db.Column(db.Integer, primary_key=True)
    from_type = db.Column(db.Enum(ChatSupportUserType), nullable=True)
    to_type = db.Column(db.Enum(ChatSupportUserType), nullable=True)
    from_id = db.Column(db.Integer, nullable=True)
    to_id = db.Column(db.Integer, nullable=True)

    message = db.Column(db.String(500), nullable=False)
    time = db.Column(db.DateTime, default=datetime.now)
