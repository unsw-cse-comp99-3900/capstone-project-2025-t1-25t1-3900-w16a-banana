"""Chat DB"""
from typing import Union, TypedDict
from datetime import datetime
from utils.db import db
from db_model import Customer, Driver, Restaurant
from db_model.base import BaseModel
from db_model.db_enum import ChatSupportUserType

class ChatLog(TypedDict):
    """Type for Chat log"""
    message_type: str
    message: str
    time: str

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

    def format_chat(self, me: Union[Customer, Driver, Restaurant]) -> ChatLog:
        """Format list of chat into redable format"""
        my_type = ChatSupportUserType(type(me).__name__.upper())
        my_id = me.id
        if self.from_id == my_id and self.from_type == my_type:
            return {
                'message_type': 'sent',
                'message': self.message,
                'time': self.time.strftime("%Y-%m-%d %H:%M:%S")
            }
        else:
            return {
                    'message_type': 'received',
                    'message': self.message,
                    'time': self.time.strftime("%Y-%m-%d %H:%M:%S")
            }
