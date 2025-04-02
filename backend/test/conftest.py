"""Pytest Configuration File"""
import os
import shutil
import pytest
from app import app, db

UPLOAD_FOLDER = app.config['UPLOAD_FOLDER']

@pytest.fixture(scope="session")
def client():
    """Test Client Generator"""
    app.config['TESTING'] = True

    with app.app_context():  # Create an application context
        db.drop_all()  # Ensure a fresh database
        db.create_all()  # Recreate tables

    with app.test_client() as test_client:
        yield test_client

@pytest.fixture(scope="session", autouse=True)
def cleanup_new_uploads():
    """Remove only new files added to uploads/ during tests."""
    # Snapshot the files BEFORE tests run
    existing_files = set(os.listdir(UPLOAD_FOLDER)) if os.path.exists(UPLOAD_FOLDER) else set()

    yield  # Run all tests

    # Snapshot after tests
    all_files = set(os.listdir(UPLOAD_FOLDER)) if os.path.exists(UPLOAD_FOLDER) else set()

    # Determine newly added files
    new_files = all_files - existing_files

    for filename in new_files:
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        try:
            if os.path.isfile(file_path) or os.path.islink(file_path):
                os.unlink(file_path)
            elif os.path.isdir(file_path):
                shutil.rmtree(file_path)
        except (OSError, FileNotFoundError, PermissionError) as e:
            print(f"Failed to delete {file_path}: {e}")
