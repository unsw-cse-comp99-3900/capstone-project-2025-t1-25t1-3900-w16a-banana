# send the file from the uploads directory to the frontend
from flask import Flask, send_from_directory, current_app
from flask_restx import Namespace, Resource, reqparse
import os

api = Namespace('uploads', description='send file from uploads directory')

@api.route('/<path:filename>')
class SendFile(Resource):
    def get(self, filename):
        """Try with http://localhost:11000/uploads/Placeholder.png in the browser"""

        # check if the file exists
        path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        if not os.path.exists(path):
            return {'message': 'File not found'}, 404

        return send_from_directory(current_app.config['UPLOAD_FOLDER'], filename)
