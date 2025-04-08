import os
import sys
from datetime import datetime, timedelta
import json
import random

# fix seed
random.seed(39006666)

# find the app
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from app import app
from utils.db import db
from db_model import *

# Default data
# all passwords are Abcd1234!
# customers: username, email, phone, address, suburb, state, postcode
default_customers = [
    ("John Doe", "john@example.com", "0412345678", "1 Anzac Parade", "Kensington", "NSW", "2010"),
    ("Jane Smith", "jane@example.com", "0498765432", "123 Main Street", "Blacktown", "NSW", "2148"),
    ("Michael Brown", "michael@example.com", "0423456789", "10 Avoca Street", "Randwick", "NSW", "2031"),
    ("Emily Jones", "emily@example.com", "0456789012", "10 Alison Road", "Randwick", "NSW", "2031"),
    ("David White", "david@example.com", "0478901234", "1 Burwood Road", "Burwood", "NSW", "2134"),
    ("Samantha Green", "samantha@example.com", "0465123789", "1 Gipps St", "Concord", "NSW", "2137"),
    ("Nathan Turner", "nathan@example.com", "0491123456", "88 Oxford St", "Paddington", "NSW", "2021"),
    ("Isabella Lee", "isabella@example.com", "0432789456", "99 Crown St", "Darlinghurst", "NSW", "2010"),
    ("Liam Scott", "liam@example.com", "0456234890", "22 George St", "Parramatta", "NSW", "2150"),
    ("Chloe Taylor", "chloe@example.com", "0487345612", "15 Bourke St", "Woolloomooloo", "NSW", "2011"),
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

        # add one default admin
        admin = Admin(
            email="admin@example.com",
            password="Abcd1234!",
            first_name="Tom",
            last_name="Smith",
        )

        db.session.add(admin)
        db.session.commit()

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

        # each customer has 50 orders by default
        # the date ranges from 2025-03-23 to 2025-04-07
        # time ranges from 10:00 to 20:00.
        # for simplicity, pickup time is set to 30 minutes after the order creation time.
        # and delivery time is set to 30 minutes after pickup time.
        # all address are default to the customer account address
        customers = Customer.query.all()
        restaurants = Restaurant.query.all()
        drivers = Driver.query.all()

        # this list will store all the new orders. 
        # and after finishing creation, we will commit the orders along the time line.
        all_orders = []

        for customer in customers:
            # create 50 orders for each customer
            for _ in range(50):
                # random pick one restaurant and one driver
                restaurant = random.choice(restaurants)
                driver = random.choice(drivers)

                # select all the menu items from this restaurant, 
                # and randomly pick 2 - 5 items, each item has quantity x 1
                items = MenuItem.query.join(MenuCategory).filter(MenuCategory.restaurant_id == restaurant.id).all()
                items = random.sample(items, random.randint(2, 5))

                # sum up the price
                order_price = sum([item.price for item in items])
                delivery_fee = random.choice([5, 10, 15, 20])
                total_price = order_price + delivery_fee 

                # create the order time
                order_time = datetime(2025, 3, 23) + timedelta(days=random.randint(0, 16), hours=random.randint(10, 20))
                pickup_time = order_time + timedelta(minutes=30)
                delivery_time = pickup_time + timedelta(minutes=30)
                
                # create a new order dict
                new_order_dict = {
                    "customer_id": customer.id,
                    "driver_id": driver.id,
                    "restaurant_id": restaurant.id,
                    "order_status": OrderStatus.DELIVERED,
                    "address": customer.address,
                    "suburb": customer.suburb,
                    "state": customer.state,
                    "postcode": customer.postcode,
                    "order_price": order_price,
                    "delivery_fee": delivery_fee,
                    "total_price": total_price,
                    "order_time": order_time,
                    "pickup_time": pickup_time,
                    "delivery_time": delivery_time,
                    "customer_notes": "Please leave the food at the door.",
                    "restaurant_notes": "Please enjoy your meal.",
                    "card_number": "1111222233334444",
                }

                # add the "items" key
                new_order_dict_items = []

                for item in items:
                    new_order_dict_items.append({
                        "menu_id": item.id,
                        "price": item.price,
                        "quantity": 1,
                    })

                # add the items to the order
                new_order_dict["items"] = new_order_dict_items
                all_orders.append(new_order_dict)
            
        # sort all the orders based on the order time ascending
        all_orders.sort(key=lambda x: x["order_time"])

        # create the order records in the database
        for order_dict in all_orders:
            # create a new order
            new_order = Order(
                customer_id=order_dict["customer_id"],
                driver_id=order_dict["driver_id"],
                restaurant_id=order_dict["restaurant_id"],
                order_status=order_dict["order_status"],
                address=order_dict["address"],
                suburb=order_dict["suburb"],
                state=order_dict["state"],
                postcode=order_dict["postcode"],
                order_price=order_dict["order_price"],
                delivery_fee=order_dict["delivery_fee"],
                total_price=order_dict["total_price"],
                order_time=order_dict["order_time"],
                pickup_time=order_dict["pickup_time"],
                delivery_time=order_dict["delivery_time"],
                customer_notes=order_dict["customer_notes"],
                restaurant_notes=order_dict["restaurant_notes"],
                card_number=order_dict["card_number"],
            )

            db.session.add(new_order)
            db.session.commit()

            # add the items to the order
            for item in order_dict["items"]:
                order_item = OrderItem(
                    menu_id=item["menu_id"],
                    price=item["price"],
                    quantity=item["quantity"],
                    order_id=new_order.id,
                )

                db.session.add(order_item)
                db.session.commit()


if __name__ == "__main__":
    print("Initializing database, please wait...")
    initialize_database()
    print("Database initialized successfully.")
