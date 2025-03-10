# database models definition here

import enum
from datetime import datetime

from utils.db import db 

# a basic model to extend from
class BaseModel(db.Model):
    __abstract__ = True

    # a dict method
    def dict(self):
        result_dict = {}

        for col in self.__table__.columns:
            val = getattr(self, col.name)

            # ignore password
            if col.name == 'password':
                continue
            elif col.name == "created_at" or col.name == "updated_at":
                val = val.strftime("%Y-%m-%d %H:%M:%S")
            elif isinstance(val, enum.Enum):
                val = val.value
            else:
                continue 

            result_dict[col.name] = val
        
        return result_dict

# define a basic user model
class User(BaseModel):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(80), nullable=False)
