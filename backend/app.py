from flask import Flask, send_from_directory
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

# send static file from the folder
@app.route('/uploads/<path:filename>')
def send_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


# run the app
if __name__ == '__main__':
    app.run(port=11000, debug=True, host='0.0.0.0')
