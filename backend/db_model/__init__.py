"""This is a module that contains DB Schema Model"""
from enum import Enum
from datetime import datetime
from sqlalchemy import CheckConstraint, UniqueConstraint

from utils.db import db
from .db_enum import State, RegistrationStatus, OrderStatus, ChatSupportUserType

class BaseModel(db.Model):
    """Base Class that Every Schema is built upon"""
    __abstract__ = True

    def dict(self):
        """Make a dictionary of itself (for JSON serialisability)"""
        result_dict = {}

        for col in self.__table__.columns:
            val = getattr(self, col.name)

            # ignore password
            if col.name == 'password':
                continue
            elif (col.name == "created_at"\
                or col.name == "updated_at"\
                or 'time' in col.name)\
                and val:
                val = val.strftime("%Y-%m-%d %H:%M:%S")
            elif isinstance(val, Enum):
                val = val.value
            result_dict[col.name] = val
        return result_dict

# customer, driver, restaurant, admin are 4 separate tables
class Admin(BaseModel):
    """
    Class for Admin DB.
    """
    __tablename__ = 'admins'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)

    # token for the admin
    token = db.Column(db.String(255), nullable=True, default=None)

    # admin should have the first name, last name
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)

    # profile page
    url_profile_image = db.Column(db.String(255), nullable=False, default="uploads/admin.png")

    # role
    role = db.Column(db.String, default="admin")

class Customer(BaseModel):
    """
    Class for Customer DB.
    Contains id, username, email, password, phone, address,
    suburb, state, postcode, token, url_profile_image, created_at
    """
    __tablename__ = 'customers'
    id = db.Column(db.Integer, primary_key=True)

    # Basic Info
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(10), nullable=False)
    role = db.Column(db.String, default="customer")

    # Address: address, suburb, state, postcode
    address = db.Column(db.String(255), nullable=False)
    suburb = db.Column(db.String(50), nullable=False)
    state = db.Column(db.Enum(State), nullable=False, default=State.NSW)
    postcode = db.Column(db.String(4), nullable=False)

    # login will create token
    token = db.Column(db.String(255), nullable=True, default=None)

    # Customer Profile Image URL
    url_profile_image = db.Column(db.String(255), nullable=False, default="uploads/customer.png")

    # User Register Time
    created_at = db.Column(db.DateTime, default=datetime.now)

    # role
    role = db.Column(db.String, default="customer")

# driver table
class Driver(BaseModel):
    """
    Class for Driver DB.
    """
    __tablename__ = 'drivers'

    id = db.Column(db.Integer, primary_key=True)
    # Basic Info
    email = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(10), nullable=False)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)

    # License Number and Car plate
    license_number = db.Column(db.String(50), nullable=False)
    car_plate = db.Column(db.String(6), nullable=False)

    # the driver should have the driver license image, registration paper
    # these can be pdf or image format
    url_license_image = db.Column(db.String(255), nullable=False)
    url_registration_paper = db.Column(db.String(255), nullable=False)

    # the driver can have a profile
    url_profile_image = db.Column(db.String(255), nullable=False, default="uploads/driver.png")

    # during registration, the driver application has the status
    registration_status = db.Column(
        db.Enum(RegistrationStatus),
        nullable=False,
        default=RegistrationStatus.PENDING
    )

    # created at
    created_at = db.Column(db.DateTime, default=datetime.now)

    # driver login will also create token
    token = db.Column(db.String(255), nullable=True, default=None)

    # role
    role = db.Column(db.String, default="driver")

# restaurant table
class Restaurant(BaseModel):
    """
    Class for Restaurant DB.
    """
    __tablename__ = 'restaurants'

    id = db.Column(db.Integer, primary_key=True)
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
    registration_status = db.Column(
        db.Enum(RegistrationStatus),
        nullable=False,
        default=RegistrationStatus.PENDING
    )

    # profile image
    url_profile_image = db.Column(db.String(255), nullable=False, default="uploads/manager.png")

    # login will create token
    token = db.Column(db.String(255), nullable=True, default=None)

    # created at
    created_at = db.Column(db.DateTime, default=datetime.now)

    # role
    role = db.Column(db.String, default="restaurant")

class MenuCategory(BaseModel):
    """
    Class for Menu Category DB.
    Every menu items will be contained in a menu category
    Consists of id, restaurant id and its name
    """
    __tablename__ = 'menu_categories'

    id = db.Column(db.Integer, primary_key=True)
    restaurant_id = db.Column(
        db.Integer,
        db.ForeignKey('restaurants.id'),
        nullable=False
    )
    name = db.Column(db.String(50), nullable=False)

class MenuItem(BaseModel):
    """
    Class for Menut Item DB.
    Each Menu Item must belong to certain category.
    """
    __tablename__ = 'menu_items'

    id = db.Column(db.Integer, primary_key=True)
    category_id = db.Column(
        db.Integer,
        db.ForeignKey('menu_categories.id'),
        nullable=False
    )
    # Basic information
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(255), nullable=False)
    price = db.Column(db.Float, nullable=False)
    url_img = db.Column(db.String(255), nullable=False)

    # the item may be available or not
    is_available = db.Column(db.Boolean, nullable=False, default=True)

class CartItem(BaseModel):
    """
    Class for Cart Item DB. Items that customer put into the cart.
    One (Customer) <-> Many (Cart Items)
    """
    __tablename__ = "cart_items"

    # Customer whom the cart belongs
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), primary_key=True)

    # Item that is in the cart
    menu_id = db.Column(db.Integer, db.ForeignKey('menu_items.id'), primary_key=True)
    quantity = db.Column(db.Integer, nullable=False)

    # Make sure that quantity is greater than 0.
    __table_args__ = (
        CheckConstraint("quantity > 0", name="quantity_positive"),
        UniqueConstraint("customer_id", "menu_id", name="Unique Item In Cart")
    )

class Order(BaseModel):
    """
    Class for Order DB.
    This contains all the relevant information about order,
    including: Customer, Restaurant, Driver involved,
    address, order price, delivery fee, order time and notes.
    """
    __tablename__ = 'orders'

    id = db.Column(db.Integer, primary_key=True)

    # the order relates to one customer, one driver, and one restaurant
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=False)
    driver_id = db.Column(db.Integer, db.ForeignKey('drivers.id'), nullable=True)
    restaurant_id = db.Column(
        db.Integer,
        db.ForeignKey('restaurants.id'),
        nullable=False
    )

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
    pickup_time = db.Column(db.DateTime, nullable=True, default=None)
    delivery_time = db.Column(db.DateTime, nullable=True, default=None)

    # the customer or the restaurant can leave some notes
    customer_notes = db.Column(db.String(255), nullable=True)
    restaurant_notes = db.Column(db.String(255), nullable=True)

    # the customer payment (a fake payment record)
    card_number = db.Column(db.String(16), nullable=False)

# each order contains many items, here we define one order to be one restaurant
class OrderItem(BaseModel):
    """
    Class for Order Item DB. Refers to Order
    One (Order) <-> Many (Order Item)
    """
    __tablename__ = 'order_items'

    id = db.Column(db.Integer, primary_key=True)

    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    menu_id = db.Column(db.Integer, db.ForeignKey('menu_items.id'), nullable=False)

    # the item price may be changed, so here needs to save the price when the order is made
    price = db.Column(db.Float, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)

class RestaurantReview(BaseModel):
    """
    Class for Restaurant Review DB.
    After the order, the customer can leave one review for the restaurant.
    A restaurant can leave one comment under that.
    A review is allowed to be updated. A review can have 1 image.
    """
    __tablename__ = 'restaurant_reviews'

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    restaurant_id = db.Column(
        db.Integer,
        db.ForeignKey('restaurants.id'),
        nullable=False
    )

    # the review can have rating 1 - 5, some text, and maximum 1 images
    rating = db.Column(db.Integer, nullable=False)
    review_text = db.Column(db.String(255), nullable=False)
    url_img = db.Column(db.String(255), nullable=True)

    # created at and updated at
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)

    __table_args__ = (
        CheckConstraint('rating >= 1 AND rating <= 5', name='check_rating_range'),
    )

class DriverReview(BaseModel):
    """
    Class for Driver Review DB.
    After the order, the customer can leave one review for the Driver.
    A Driver can leave one comment under that.
    A review is allowed to be updated. A review can have 1 image.
    """
    __tablename__ = 'driver_reviews'

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    driver_id = db.Column(
        db.Integer,
        db.ForeignKey('drivers.id'),
        nullable=False
    )

    # the review can have rating 1 - 5, some text, and maximum 1 images
    rating = db.Column(db.Integer, nullable=False)
    review_text = db.Column(db.String(255), nullable=False)
    url_img = db.Column(db.String(255), nullable=True)

    # created at and updated at
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)

    __table_args__ = (
        CheckConstraint('rating >= 1 AND rating <= 5', name='check_rating_range'),
    )

class Chat(BaseModel):
    """
    Class of Chat DB.
    The type of sender, receiver, and their id must be specified.
    """
    __tablename__ = 'chat'
    id = db.Column(db.Integer, primary_key=True)
    from_type = db.Column(db.Enum(ChatSupportUserType), nullable=True)
    to_type = db.Column(db.Enum(ChatSupportUserType), nullable=True)
    from_id = db.Column(db.Integer, nullable=True)
    to_id = db.Column(db.Integer, nullable=True)

    message = db.Column(db.String(500), nullable=False)
    time = db.Column(db.DateTime, default=datetime.now)

# TODO: More works to be added
class Favourites(BaseModel):
    """
    Class of Favourites restaurant DB
    Customer <-> Favourites (Many)
    """
    __tablename__ = 'favourites'
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=False)
    restaurant_id = db.Column(db.Integer, db.ForeignKey('restaurants.id'), nullable=False)
