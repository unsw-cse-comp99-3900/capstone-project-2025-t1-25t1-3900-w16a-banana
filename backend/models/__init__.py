# database models definition here

import enum
from datetime import datetime

from utils.db import db 

# a basic model to extend from
class BaseModel(db.Model):
    __abstract__ = True

    # a dict method
    def dict(self):
        result_dict = {}

        for col in self.__table__.columns:
            val = getattr(self, col.name)

            # ignore password
            if col.name == 'password':
                continue
            elif col.name == "created_at" or col.name == "updated_at":
                val = val.strftime("%Y-%m-%d %H:%M:%S")
            elif isinstance(val, enum.Enum):
                val = val.value 

            result_dict[col.name] = val
        
        return result_dict

# for the state
class State(enum.Enum):
    ACT = "ACT"
    NSW = "NSW"
    NT = "NT"
    QLD = "QLD"
    SA = "SA"
    TAS = "TAS"
    VIC = "VIC"
    WA = "WA"


# customer, driver, restaurant, admin are 4 separate tables
class Customer(BaseModel):
    __tablename__ = 'customers'

    customer_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)

    # for the delivery
    # australian phone is 04xx xxx xxx
    phone = db.Column(db.String(10), nullable=False)

    # the address is more detailed
    # address, suburb, state, postcode
    address = db.Column(db.String(255), nullable=False)
    suburb = db.Column(db.String(50), nullable=False)
    state = db.Column(db.Enum(State), nullable=False, default=State.NSW)
    postcode = db.Column(db.String(4), nullable=False)

    # login will create token
    token = db.Column(db.String(255), nullable=True, default=None)

    # some timestamps
    created_at = db.Column(db.DateTime, default=datetime.now)

# the driver and restaurant have the registration status
# pending, approved, rejected
class RegistrationStatus(enum.Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"


# driver table
class Driver(BaseModel):
    __tablename__ = 'drivers'

    driver_id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(10), nullable=False)

    # driver should upload first name, last name
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)

    # the driver should have the driver license number
    license_number = db.Column(db.String(50), nullable=False)
    
    # the driver should have the car plate number
    car_plate = db.Column(db.String(10), nullable=False)

    # the driver should have the driver license image, car image, registration paper
    # these can be pdf or image format
    url_license_image = db.Column(db.String(255), nullable=False)
    url_car_image = db.Column(db.String(255), nullable=False)
    url_registration_paper = db.Column(db.String(255), nullable=False)

    # during registration, the driver application has the status
    registration_status = db.Column(db.Enum(RegistrationStatus), nullable=False, default=RegistrationStatus.PENDING)

    # created at
    created_at = db.Column(db.DateTime, default=datetime.now)


# restaurant table
class Restaurant(BaseModel):
    __tablename__ = 'restaurants'

    restaurant_id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(10), nullable=False)

    # restaurant should have the name, address, suburb, state, postcode
    name = db.Column(db.String(50), nullable=False)
    address = db.Column(db.String(255), nullable=False)
    suburb = db.Column(db.String(50), nullable=False)
    state = db.Column(db.Enum(State), nullable=False, default=State.NSW)
    postcode = db.Column(db.String(4), nullable=False)

    # the restaurant should have ABN, ABN is 11 digits
    abn = db.Column(db.String(11), nullable=False)

    # the restaurant can upload 3 images for the restaurant
    url_img1 = db.Column(db.String(255), nullable=False)
    url_img2 = db.Column(db.String(255), nullable=False)
    url_img3 = db.Column(db.String(255), nullable=False)

    # shop description
    description = db.Column(db.String(255), nullable=False)

    # during registration, the restaurant application has the status
    registration_status = db.Column(db.Enum(RegistrationStatus), nullable=False, default=RegistrationStatus.PENDING)

    # login will create token
    token = db.Column(db.String(255), nullable=True, default=None)

    # created at
    created_at = db.Column(db.DateTime, default=datetime.now)


# admin table
class Admin(BaseModel):
    __tablename__ = 'admins'

    admin_id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)

    # token for the admin
    token = db.Column(db.String(255), nullable=True, default=None)

    # admin should have the first name, last name
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)

# about the menu:
# each restaurant own one menu
# this menu is separated into several categories
# each category contains several items
# each item: name, description, price, one image, special notes
class MenuCategory(BaseModel):
    __tablename__ = 'menu_categories'

    category_id = db.Column(db.Integer, primary_key=True)
    restaurant_id = db.Column(db.Integer, db.ForeignKey('restaurants.restaurant_id'), nullable=False)
    name = db.Column(db.String(50), nullable=False)


class MenuItem(BaseModel):
    __tablename__ = 'menu_items'

    item_id = db.Column(db.Integer, primary_key=True)
    category_id = db.Column(db.Integer, db.ForeignKey('menu_categories.category_id'), nullable=False)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(255), nullable=False)
    price = db.Column(db.Float, nullable=False)

    # one item has one image
    url_img = db.Column(db.String(255), nullable=False)

    # the item may be available or not
    is_available = db.Column(db.Boolean, nullable=False, default=True)


# for the order
# one customer can make multiple orders
# one order can contain multiple items
# enum for the order status
class OrderStatus(enum.Enum):
    PENDING = "PENDING"
    CONFIRMED = "CONFIRMED"
    DELIVERING = "DELIVERING"
    DELIVERED = "DELIVERED"
    CANCELLED = "CANCELLED"


class CustomerOrder(BaseModel):
    __tablename__ = 'customer_orders'

    order_id = db.Column(db.Integer, primary_key=True)

    # the order relates to one customer, one driver, and one restaurant
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.customer_id'), nullable=False)
    driver_id = db.Column(db.Integer, db.ForeignKey('drivers.driver_id'), nullable=True)
    restaurant_id = db.Column(db.Integer, db.ForeignKey('restaurants.restaurant_id'), nullable=False)
    
    # order stataus
    order_status = db.Column(db.Enum(OrderStatus), nullable=False, default=OrderStatus.PENDING)
    
    # the order should have the delivery address, suburb, state, postcode
    address = db.Column(db.String(255), nullable=False)
    suburb = db.Column(db.String(50), nullable=False)
    state = db.Column(db.Enum(State), nullable=False, default=State.NSW)
    postcode = db.Column(db.String(4), nullable=False)

    # the order price: order price, delivery fee, total price
    order_price = db.Column(db.Float, nullable=False)
    delivery_fee = db.Column(db.Float, nullable=False)
    total_price = db.Column(db.Float, nullable=False)

    # the order should have order time, pickup time, delivery time
    order_time = db.Column(db.DateTime, default=datetime.now)
    pickup_time = db.Column(db.DateTime, nullable=True)
    delivery_time = db.Column(db.DateTime, nullable=True)

    # the customer or the restaurant can leave some notes
    customer_notes = db.Column(db.String(255), nullable=True)
    restaurant_notes = db.Column(db.String(255), nullable=True)

    # the customer payment (a fake payment record)
    card_number = db.Column(db.String(16), nullable=False)


# each order contains many items, here we define one order to be one restaurant
class OrderItem(BaseModel):
    __tablename__ = 'order_items'

    order_item_id = db.Column(db.Integer, primary_key=True)
    
    order_id = db.Column(db.Integer, db.ForeignKey('customer_orders.order_id'), nullable=False)
    item_id = db.Column(db.Integer, db.ForeignKey('menu_items.item_id'), nullable=False)
    
    # the item price may be changed, so here needs to save the price when the order is made
    price = db.Column(db.Float, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)


# after the order, the customer can leave one review for the driver,
# and one review for the restaurant,
# the driver and restaurant can leave one comment under that
# and the review is allowed to be updated
# and the review can attach 1 images.
# here, one review table for two parties
class ReviewTarget(enum.Enum):
    DRIVER = "DRIVER"
    RESTAURANT = "RESTAURANT"


class Review(BaseModel):
    __tablename__ = 'reviews'

    review_id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('customer_orders.order_id'), nullable=False)
    target = db.Column(db.Enum(ReviewTarget), nullable=False)

    # the review can have rating 1 - 5, some text, and maximum 1 images
    rating = db.Column(db.Integer, nullable=False)
    review_text = db.Column(db.String(255), nullable=False)
    url_img = db.Column(db.String(255), nullable=True)

    # created at and updated at
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)


# more works: chat system table (maybe in sprint 2, 3)
