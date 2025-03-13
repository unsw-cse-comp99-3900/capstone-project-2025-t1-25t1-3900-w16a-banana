from flask import current_app
from datetime import datetime
from werkzeug.utils import secure_filename
from werkzeug.datastructures import FileStorage

import os

SUPPORTED_IMAGE_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

# save the new file to the current app upload folder
def save_file(file: FileStorage) -> str:
    ts = datetime.now().strftime('%Y%m%d%H%M%S')
    filename = ts + '_' + secure_filename(file.filename)
    path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
    print(path)
    file.save(path)

    # the url file path to the database
    url = f"{current_app.config['UPLOAD_FOLDER']}/{filename}"
    return url

# save the new file to the current app upload folder
def save_image(file: FileStorage) -> str:
    is_image = '.' in file.filename and file.filename.rsplit('.', 1)[1].lower() in SUPPORTED_IMAGE_EXTENSIONS

    if is_image:
    # Save file after checking extension
        return save_file(file)
    else:
        return ""