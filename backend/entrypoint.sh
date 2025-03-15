#!/bin/bash

echo "Initializing the database..."
python -c "from app import app, db; app.app_context().push(); db.create_all(); print('Database initialized')"
echo "Database setup complete."

echo "Starting Flask app..."
exec python app.py
