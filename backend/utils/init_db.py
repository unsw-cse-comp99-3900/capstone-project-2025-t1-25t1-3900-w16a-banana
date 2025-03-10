import os
import sys 

# find the app
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app import app 
from utils.db import db

def init_db():
    with app.app_context():
        db.drop_all()
        db.create_all()
        print('Database initialized')

if __name__ == '__main__':
    init_db()