class Config:
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///project.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    UPLOAD_FOLDER = 'uploads'