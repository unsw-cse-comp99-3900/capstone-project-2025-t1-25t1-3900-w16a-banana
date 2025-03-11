from flask import current_app
from datetime import datetime
import os

# save the new file to the current app upload folder
def save_file(file):
    ts = datetime.now().strftime('%Y%m%d%H%M%S')
    filename = ts + '_' + file.filename
    path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
    file.save(path)

    # the url file path to the database
    # url = f"{current_app.config['UPLOAD_URL']}/{filename}"
    # return url
    return ""
    