"""Base User Model"""
from abc import abstractmethod
from typing import Dict
from db_model.base import BaseModel

class User(BaseModel):
    """Base User Model"""
    __abstract__ = True

    @abstractmethod
    def get_username(self) -> str:
        """Get the username"""

    @abstractmethod
    def get_profile(self) -> Dict:
        """
        Get the profile information without sensitive information.
        JSON-Serialisable
        """
