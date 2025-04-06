import os
import sys
from datetime import datetime
import json

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
    ("Jane Smith", "jane@example.com", "0498765432", "456 Elm St", "Sydney", "NSW", "2010"),
    ("Michael Brown", "michael@example.com", "0423456789", "789 Pine St", "Kensington", "NSW", "2011"),
    ("Emily Jones", "emily@example.com", "0456789012", "321 Oak St", "Kingsford", "NSW", "2012"),
    ("David White", "david@example.com", "0478901234", "654 Maple St", "Maroubra", "NSW", "2013"),
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

# restaurant: email, phone, name, address, suburb, state, postcode, abn (11 digits), description
restaurant_data = [
    ("sydneyeats@example.com", "0411222333", "Sydney Eats", "123 George St", "Sydney", "NSW", "2000", "11111111111", "A popular restaurant in Sydney CBD."),
    ("harbourgrill@example.com", "0422333444", "Harbour Grill", "456 Pitt St", "Sydney", "NSW", "2000", "22222222222", "Fine dining with a view of the harbour."),
    ("bondibites@example.com", "0433444555", "Bondi Bites", "789 Campbell Parade", "Bondi Beach", "NSW", "2026", "33333333333", "Casual dining spot near Bondi Beach."),
    ("newtownnoodles@example.com", "0444555666", "Newtown Noodles", "321 King St", "Newtown", "NSW", "2042", "44444444444", "Authentic Asian noodle house in Newtown."),
    ("parrapizza@example.com", "0455666777", "Parramatta Pizza", "654 Church St", "Parramatta", "NSW", "2150", "55555555555", "Family-friendly pizza restaurant in Parramatta."),
    ("glebegrill@example.com", "0466778899", "Glebe Grill", "789 Glebe Point Rd", "Glebe", "NSW", "2037", "66666666666", "Neighborhood favorite for grilled meats and cozy vibes."),
    ("manlymeals@example.com", "0477889900", "Manly Meals", "123 Beach Rd", "Manly", "NSW", "2095", "77777777777", "Beachside spot known for fresh seafood and healthy bowls."),
    ("redfernramen@example.com", "0488990011", "Redfern Ramen", "456 Redfern St", "Redfern", "NSW", "2016", "88888888888", "Tiny noodle bar with big flavor."),
    ("strathfieldspice@example.com", "0499001122", "Strathfield Spice", "321 Albert Rd", "Strathfield", "NSW", "2135", "99999999999", "Modern Indian eatery with a twist on the classics."),
    ("greenwichgarden@example.com", "0400111222", "Greenwich Garden", "654 Pacific Hwy", "Greenwich", "NSW", "2065", "10101010101", "Vegetarian café with garden seating and seasonal menus."),
]

def initialize_database():
    with app.app_context():
        # drop all tables, and create againn
        db.drop_all()
        db.create_all()

        # insert default data
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
                registration_status=RegistrationStatus.APPROVED,
            )

            db.session.add(driver)
            db.session.commit()

        # load the uploads/restaurant_menu.json file
        file = open("uploads/restaurant_menu.json", "r")
        menus = json.load(file)
        file.close()

        for index, (email, phone, name, address, suburb, state, postcode, abn, description) in enumerate(restaurant_data):
            restaurant = Restaurant(
                email=email,
                password="Abcd1234!",
                phone=phone,
                name=name,
                address=address,
                suburb=suburb,
                state=state,
                postcode=postcode,
                abn=abn,
                url_img1=f"uploads/restaurant/Image_{index+1}.jpg",
                url_img2="uploads/restaurant/general_1.jpg",
                url_img3="uploads/restaurant/general_2.jpg",
                description=description,
                registration_status=RegistrationStatus.APPROVED,
            )

            db.session.add(restaurant)
            db.session.commit()

            # insert the menus
            categories = menus[index]["categories"]

            for cate in categories:
                name = cate["name"]
                new_category = MenuCategory(
                    name=name,
                    restaurant_id=restaurant.id,
                )

                db.session.add(new_category)
                db.session.commit()

                # get all items
                items = cate["items"]
                for item in items:
                    name = item["name"]
                    price = item["price"]
                    description = item["description"]
                    url_img = item["url_img"]

                    new_item = MenuItem(
                        name=name,
                        price=price,
                        description=description,
                        url_img=url_img,
                        category_id=new_category.id,
                    )

                    db.session.add(new_item)
                    db.session.commit()

        # add one default admin
        admin = Admin(
            email="admin@example.com",
            password="Abcd1234!",
            first_name="Tom",
            last_name="Smith",
        )

        db.session.add(admin)
        db.session.commit()

        print("Default data inserted successfully.")

if __name__ == "__main__":
    initialize_database()
