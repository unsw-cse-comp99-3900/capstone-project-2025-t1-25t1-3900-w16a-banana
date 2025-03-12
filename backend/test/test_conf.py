import pytest
from app import app
from utils.db import db

@pytest.fixture
def client():
    app.config['TESTING'] = True

    with app.app_context():
        db.drop_all()
        db.create_all()
        yield app.test_client()
