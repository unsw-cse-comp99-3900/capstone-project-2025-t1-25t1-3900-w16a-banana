import time
import os
from flask import current_app
from werkzeug.datastructures import FileStorage
from uuid import uuid4


SUPPORTED_IMAGE_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}


# Return the extension of the file
def get_file_extension(file: FileStorage) -> str:
    if '.' not in file.filename:
        return ""
    else:
        return file.filename.rsplit('.', 1)[1].lower()


# save the new file to the current app upload folder
def save_file(file: FileStorage) -> str:
    # Filename is created as `uniqueId.extension`
    filename = f"{uuid4().hex}.{get_file_extension(file)}"

    # Make sure that the directory exists
    os.makedirs(current_app.config['UPLOAD_FOLDER'], exist_ok=True)

    #Save the file
    file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], filename))

    # the url file path to the database
    return f"{current_app.config['UPLOAD_FOLDER']}/{filename}"

# save the new file to the current app upload folder
def save_image(file: FileStorage) -> str:
    if get_file_extension(file) in SUPPORTED_IMAGE_EXTENSIONS:
    # Save file after checking extension
        return save_file(file)
    else:
        return ""