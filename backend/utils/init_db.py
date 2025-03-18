import os
import sys
from datetime import datetime

# find the app
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from app import app
from utils.db import db
from db_model import *

# Default data
# all passwords are Abcd1234!
# customers: username, email, phone, address, suburb, state, postcode
default_customers = [
    ("John Doe", "john@example.com", "0412345678", "123 Main St", "Sydney", "NSW", "2000"),
    ("Jane Smith", "jane@example.com", "0498765432", "456 Elm St", "Melbourne", "VIC", "3000"),
    ("Michael Brown", "michael@example.com", "0423456789", "789 Pine St", "Brisbane", "QLD", "4000"),
    ("Emily Jones", "emily@example.com", "0456789012", "321 Oak St", "Perth", "WA", "6000"),
    ("David White", "david@example.com", "0478901234", "654 Maple St", "Adelaide", "SA", "5000"),
]

# drivers: email, phone, first_name, last_name, license_number, car_plate
# the uploads folder has the default license_image.png and registration_paper.jpg
driver_data = [
    ("alex@example.com", "0411222333", "Alex", "Johnson", "1234567890", "ABC123"),
    ("sophia@example.com", "0422333444", "Sophia", "Wilson", "2345678901", "XYZ987"),
    ("daniel@example.com", "0433444555", "Daniel", "Martin", "3456789012", "LMN456"),
    ("olivia@example.com", "0444555666", "Olivia", "Brown", "4567890123", "QWE123"),
    ("matthew@example.com", "0455666777", "Matthew", "Taylor", "5678901234", "RTY789"),
]

def insert_customers():
    with app.app_context():
        for username, email, phone, address, suburb, state, postcode in default_customers:
            customer = Customer(
                username=username,
                email=email,
                password="Abcd1234!",
                phone=phone,
                address=address,
                suburb=suburb,
                state=state,
                postcode=postcode,
            )

            db.session.add(customer)
            db.session.commit()

        for email, phone, first_name, last_name, license_number, car_plate in driver_data:
            driver = Driver(
                email=email,
                password="Abcd1234!",
                phone=phone,
                first_name=first_name,
                last_name=last_name,
                license_number=license_number,
                car_plate=car_plate,
                url_license_image="uploads/license_image.png",
                url_registration_paper="uploads/registration_paper.jpg",
            )

            db.session.add(driver)
            db.session.commit()
        

if __name__ == "__main__":
    insert_customers()
