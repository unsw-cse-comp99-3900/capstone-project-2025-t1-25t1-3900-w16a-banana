# send the file from the uploads directory to the frontend
from flask import Flask, send_from_directory, current_app
from flask_restx import Namespace, Resource, reqparse
from werkzeug.utils import secure_filename
import os

api = Namespace('files', description='send file from uploads directory')

@api.route('/<path:filename>')
class SendFile(Resource):
    @api.doc(description="try with http://localhost:11000/files/Placeholder.png in the browser")
    def get(self, filename: str):
        """Flask send static file from directory"""

        # To block accessing of nested trees
        filename = secure_filename(filename)

        # check if the file exists
        path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        if not os.path.exists(path):
            return {'message': 'File not found'}, 404

        return send_from_directory(current_app.config['UPLOAD_FOLDER'], filename)
