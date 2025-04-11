"""Base DB Model that Every Schema is built upon"""
from enum import Enum
from utils.db import db

class BaseModel(db.Model):
    """Base Class that Every Schema is built upon"""
    __abstract__ = True
    def dict(self):
        """Make a dictionary of itself (for JSON serialisability)"""
        result_dict = {}

        for col in self.__table__.columns:
            val = getattr(self, col.name)

            # ignore password
            if col.name == 'password':
                continue
            if col.name == 'card_number':
                val = '****-****-****-****'
            elif (col.name == "created_at"\
                or col.name == "updated_at"\
                or 'time' in col.name)\
                and val:
                val = val.strftime("%Y-%m-%d %H:%M:%S")
            elif isinstance(val, Enum):
                val = val.value
            result_dict[col.name] = val
        return result_dict
