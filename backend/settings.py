import os 

# use absolute path for the project.db file
directory = os.path.abspath(os.path.dirname(__file__))
db_path = os.path.join(directory, 'project.db')

class Config:
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = f'sqlite:///{db_path}'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    UPLOAD_FOLDER = 'uploads'