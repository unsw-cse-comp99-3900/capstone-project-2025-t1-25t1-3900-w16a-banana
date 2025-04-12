"""Base DB Model that Every Schema is built upon"""
from enum import Enum
from abc import ABCMeta
from utils.db import db

class BaseMixin:
    """Mixin for shared methods"""
    def dict(self):
        """Make JSON serialisable format"""
        result_dict = {}
        for col in self.__table__.columns:
            val = getattr(self, col.name)
            if col.name == 'password':
                continue
            if col.name == 'card_number':
                val = '****-****-****-****'
            elif (col.name == "created_at" or
                   col.name == "updated_at" or 'time' in col.name) and val:
                val = val.strftime("%Y-%m-%d %H:%M:%S")
            elif isinstance(val, Enum):
                val = val.value
            result_dict[col.name] = val
        return result_dict

class ModelMeta(ABCMeta, type(db.Model)):
    """meta model"""

class BaseModel(db.Model, BaseMixin, metaclass=ModelMeta):
    """Base model for all db"""
    __abstract__ = True
