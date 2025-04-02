"""Utility functions realted to file storage"""
import os
from typing import Optional
from uuid import uuid4
from flask import current_app
from werkzeug.datastructures import FileStorage

SUPPORTED_IMAGE_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
SUPPORTED_DOCS_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg'}

# Return the extension of the file
def get_file_extension(file: FileStorage) -> Optional[str]:
    """Extract the extension out of the filename. Converted into lower case."""
    if '.' not in file.filename:
        return None
    else:
        return file.filename.rsplit('.', 1)[1].lower()


def save_file(file: FileStorage) -> Optional[str]:
    """
    Save file to the server and return the stored file path.
    Returns None if any error occurs during the process.
    """
    try:
        # Filename is created as `uniqueId.extension`
        filename = f"{uuid4().hex}.{get_file_extension(file)}"

        # Ensure the upload directory exists
        upload_folder = current_app.config['UPLOAD_FOLDER']
        os.makedirs(upload_folder, exist_ok=True)

        # Full path to save
        full_path = os.path.join(upload_folder, filename)

        # Save the file
        file.save(full_path)

        # Return the path to be stored in DB
        return f"{upload_folder}/{filename}"

    except (OSError, IOError, AttributeError) as e:
        current_app.logger.error(f"Error saving file: {e}")
        return None

def save_image(file: FileStorage) -> Optional[str]:
    """
    Save image file to the server and returns the stored URL.
    """
    if get_file_extension(file) in SUPPORTED_IMAGE_EXTENSIONS:
    # Save file after checking extension
        return save_file(file)
    else:
        return None

# save the new file to the current app upload folder
def save_document(file: FileStorage) -> Optional[str]:
    """
    Save document file to the server and returns the stored URL.
    """
    if get_file_extension(file) in SUPPORTED_DOCS_EXTENSIONS:
    # Save file after checking extension
        return save_file(file)
    else:
        return None
