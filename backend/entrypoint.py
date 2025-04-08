# initialize the database
from utils.init_db import initialize_database
initialize_database()
print("Database initialized successfully.")

# call the app to run the server
from app import app

if __name__ == '__main__':
    print("Starting the server...")
    app.run(port=11000, debug=True, host='0.0.0.0')
