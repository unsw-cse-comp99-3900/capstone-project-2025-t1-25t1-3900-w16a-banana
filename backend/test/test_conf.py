import pytest
from app import app
from utils.db import db

import sys
sys.path.insert(0, "/app/backend")  # to import application, this is required

from app import app


@pytest.fixture
def client():
    app.config['TESTING'] = True

    with app.app_context():
        db.drop_all()
        db.create_all()
        yield app.test_client()
