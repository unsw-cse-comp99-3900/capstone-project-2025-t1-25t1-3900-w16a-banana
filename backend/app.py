from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_restx import Api
from flask_cors import CORS

from settings import Config 
from routes import api
from utils.db import db

# create the Flask app
app = Flask(__name__)
app.config.from_object(Config)

# register the db and api
db.init_app(app)
api.init_app(app)

# cors
CORS(app)

# run the app
if __name__ == '__main__':
    app.run(port=11000, debug=True, host='0.0.0.0')
