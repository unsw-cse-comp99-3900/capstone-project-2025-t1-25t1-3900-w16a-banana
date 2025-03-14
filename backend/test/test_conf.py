import pytest
from app import app, db

@pytest.fixture(scope="session")
def client():
    app.config['TESTING'] = True

    with app.app_context():  # Create an application context
        db.drop_all()  # Ensure a fresh database
        db.create_all()  # Recreate tables

    with app.test_client() as client:
        yield client
