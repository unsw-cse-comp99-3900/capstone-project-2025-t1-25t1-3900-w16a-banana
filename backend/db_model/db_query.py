"""DB Query functions"""
from collections import defaultdict
from typing import Optional, List, Union

from sqlalchemy import or_, and_
from db_model import (
    Admin,
    Customer,
    Restaurant,
    Driver,
    MenuCategory,
    MenuItem,
    CartItem,
    Chat,
    Order,
    OrderItem,
    Favourites,
    RestaurantReview,
    DriverReview
)
from .db_enum import ChatSupportUserType, OrderStatus

#--------------------------------------------------------#
#---------------Functions related to Users---------------#
#--------------------------------------------------------#
def get_user_by_token(token: str) -> Optional[Union[Admin, Customer, Driver, Restaurant]]:
    """Find Any User with matching token."""
    for user_db in [Admin, Customer, Driver, Restaurant]:
        user = user_db.query.filter_by(token=token).first()
        if user:
            return user
    return None

def get_user_by_type_and_id(
        user_type: str, user_id: int
) -> Optional[Union[Admin, Customer, Driver, Restaurant]]:
    """Find User of given type and id"""
    if user_type.upper() == 'ADMIN':
        return Admin.query.filter_by(id = user_id).first()
    elif user_type.upper() == 'CUSTOMER':
        return Customer.query.filter_by(id = user_id).first()
    elif user_type.upper() == 'DRIVER':
        return Driver.query.filter_by(id = user_id).first()
    elif user_type.upper() == 'RESTAURANT':
        return Restaurant.query.filter_by(id = user_id).first()
    else:
        return None

def get_admin_by_token(token: str) -> Optional[Admin]:
    """Find Admin with given token"""
    return Admin.query.filter_by(token=token).first()

def get_customer_by_token(token: str) -> Optional[Customer]:
    """Find Customer with given token"""
    return Customer.query.filter_by(token=token).first()

def get_driver_by_token(token: str) -> Optional[Driver]:
    """Find Driver with given token"""
    return Driver.query.filter_by(token=token).first()

def get_restaurant_by_token(token: str) -> Optional[Restaurant]:
    """Find Restaurant with given token"""
    return Restaurant.query.filter_by(token=token).first()

#--------------------------------------------------------#
#---------------Functions related to Admin---------------#
#--------------------------------------------------------#
def filter_admins(**kwargs) -> List[Admin]:
    """
    Dynamically filters admin users based on provided fields.

    Supported fields:
        - id
        - email
        - first_name
        - last_name
        - token
    """
    filters = []
    for field in ['id', 'email', 'first_name', 'last_name', 'token']:
        value = kwargs.get(field)
        if value is not None:
            filters.append(getattr(Admin, field) == value)

    return Admin.query.filter(and_(*filters)).all()

#--------------------------------------------------------#
#-------------Functions related to Restaurant-------------#
#--------------------------------------------------------#
def filter_restaurants(**kwargs) -> List[Restaurant]:
    """
    Dynamically filters restaurants based on provided fields.

    Supported fields:
        - id
        - email
        - phone
        - name
        - abn
        - suburb
        - state
        - postcode
        - registration_status
        - token
    """
    filters = []
    for field in [
        'id', 'email', 'phone', 'name', 'abn', 'suburb',
        'state', 'postcode', 'registration_status', 'token'
    ]:
        value = kwargs.get(field)
        if value is not None:
            filters.append(getattr(Restaurant, field) == value)

    return Restaurant.query.filter(and_(*filters)).all()

def get_restaurant_by_menu(menu_id: int) -> Optional[Restaurant]:
    """Get the restaurant that owns given menu"""
    return (
        Restaurant.query
        .join(MenuCategory, Restaurant.id == MenuCategory.restaurant_id)
        .join(MenuItem, MenuCategory.id == MenuItem.category_id)
        .filter(MenuItem.id == menu_id)
        .first()
    )

#--------------------------------------------------------#
#-------------Functions related to Customer-------------#
#--------------------------------------------------------#
def filter_customers(**kwargs) -> List[Customer]:
    """
    Dynamically filters customers based on provided fields.
    
    Usage:
        filter_customers(session, email="abc@example.com")
        filter_customers(session, phone="0412345678", suburb="Sydney")

    Supported fields:
        - email
        - username
        - phone
        - suburb
        - state
        - postcode
        - id
        - token
    """
    filters = []
    for field in ['id', 'email', 'username', 'phone', 'suburb', 'state', 'postcode', 'token']:
        value = kwargs.get(field)
        if value is not None:
            filters.append(getattr(Customer, field) == value)

    return Customer.query.filter(and_(*filters)).all()

#--------------------------------------------------------#
#--------------Functions related to Driver--------------#
#--------------------------------------------------------#
def filter_drivers(**kwargs) -> List[Driver]:
    """
    Dynamically filters drivers based on provided fields.

    Supported fields:
        - id
        - email
        - phone
        - first_name
        - last_name
        - license_number
        - car_plate
        - registration_status
        - token
    """
    filters = []
    for field in [
        'id', 'email', 'phone', 'first_name', 'last_name', 'license_number',
        'car_plate', 'registration_status', 'token'
    ]:
        value = kwargs.get(field)
        if value is not None:
            filters.append(getattr(Driver, field) == value)

    return Driver.query.filter(and_(*filters)).all()

#--------------------------------------------------------#
#-----------Functions related to Customer Cart------------#
#--------------------------------------------------------#
def filter_cart_items( **kwargs) -> List[CartItem]:
    """
    Dynamically filters cart items based on provided fields.

    Supported fields:
        - customer_id
        - menu_id
        - quantity
    """
    filters = []
    for field in ['customer_id', 'menu_id', 'quantity']:
        value = kwargs.get(field)
        if value is not None:
            filters.append(getattr(CartItem, field) == value)

    return CartItem.query.filter(and_(*filters)).all()

#--------------------------------------------------------#
#---------------Functions related to Order---------------#
#--------------------------------------------------------#
def filter_orders(**kwargs) -> List[Order]:
    """
    Dynamically filters orders based on provided fields.

    Supported fields:
        - id
        - customer_id
        - driver_id
        - restaurant_id
        - order_status
        - suburb
        - state
        - postcode
        - order_time
        - pickup_time
        - delivery_time
    """
    filters = []
    for field in [
        'id', 'customer_id', 'driver_id', 'restaurant_id', 'order_status',
        'suburb', 'state', 'postcode', 'order_time', 'pickup_time', 'delivery_time'
    ]:
        value = kwargs.get(field)
        if value is not None:
            filters.append(getattr(Order, field) == value)

    return Order.query.filter(and_(*filters)).all()

def get_orders_waiting_driver() -> List[Order]:
    """Get All Orders that is waiting for driver"""
    return Order.query.filter(
        Order.driver_id.is_(None),
        Order.order_status != OrderStatus.CANCELLED
    ).all()

def get_orders_of_driver_from_order_type(driver_id: int, order_type: str) -> List[Order]:
    """order_type: new, in_progress, delivering, completed, all"""

    if order_type == 'new':
        # require this order must be accepted by the restaurant first, 
        # then it can be shown to the driver.
        # so the order_status can be: RESTAURANT_ACCEPTED, READY_FOR_PICKUP
        return Order.query.filter(
            Order.driver_id.is_(None),
            Order.order_status.in_([
                OrderStatus.RESTAURANT_ACCEPTED,
                OrderStatus.READY_FOR_PICKUP,
            ])
        ).all()
    elif order_type == 'to_pickup':
        # this order belongs to this driver,
        # order status: restaurant_accepted (in cooking), ready_for_pickup (waiting for driver)
        return Order.query.filter(
            Order.driver_id == driver_id,
            Order.order_status.in_([
                OrderStatus.RESTAURANT_ACCEPTED,
                OrderStatus.READY_FOR_PICKUP,
            ])
        ).all()
    elif order_type == 'delivering':
        return Order.query.filter(
            Order.driver_id == driver_id,
            Order.order_status == OrderStatus.PICKED_UP
        ).all()
    elif order_type == 'completed':
        return Order.query.filter(
            Order.driver_id == driver_id,
            Order.order_status == OrderStatus.DELIVERED
        ).all()
    elif order_type == 'all':
        return Order.query.filter(
            Order.driver_id == driver_id
        ).all()
    else:
        # invalid order type
        return []
    
# the order_id is assumed to be valid.
def get_order_by_order_id(order_id: int):
    order = Order.query.get(order_id)

    # obtain the restaurant details, into a dictionary, the driver detail, and the customer detail
    restaurant = Restaurant.query.get(order.restaurant_id)
    customer = Customer.query.get(order.customer_id)
    driver = Driver.query.get(order.driver_id) if order.driver_id else None

    # obtain all the items
    items = OrderItem.query.filter_by(order_id=order_id).all()

    # for each item, also obtain the menu item object
    formatted_items = []
    for item in items:
        result = item.dict()
        menu_item = MenuItem.query.get(item.menu_id)
        result['menu_item'] = menu_item.dict() if menu_item else None
        formatted_items.append(result)
    
    # make the result dictionary
    result = {
        'order': order.dict(),
        'restaurant': restaurant.dict(),
        'customer': customer.dict(),
        'driver': driver.dict() if driver else None,
        'items': formatted_items
    }

    return result

#--------------------------------------------------------#
#------------Functions related to Menu Items------------#
#--------------------------------------------------------#
def filter_menus(**kwargs) -> List[MenuItem]:
    """
    Dynamically filters menu items based on provided fields.

    Supported fields:
        - id
        - category_id
        - name
        - price
        - is_available
    """
    filters = []
    for field in ['id', 'category_id', 'name', 'price', 'is_available']:
        value = kwargs.get(field)
        if value is not None:
            filters.append(getattr(MenuItem, field) == value)

    return MenuItem.query.filter(and_(*filters)).all()

def filter_menu_from_restaurant(
    restaurant_id: int,
    name: Optional[str] = None,
    menu_id: Optional[int] = None,
    is_available: Optional[bool] = None,
    first_only: bool = False
) -> Union[Optional[MenuItem], List[MenuItem]]:
    """
    Filter menu items for a given restaurant based on optional conditions.

    :param restaurant_id: ID of the restaurant (required)
    :param name: Menu item name to filter (optional)
    :param menu_id: Menu item ID to filter (optional)
    :param is_available: Availability filter (optional)
    :param first_only: Whether to return only the first match
    :return: List of MenuItems or a single MenuItem if first_only is True
    """
    query = MenuItem.query.join(MenuCategory).filter(
        MenuCategory.restaurant_id == restaurant_id
    )

    if name:
        query = query.filter(MenuItem.name == name)
    if menu_id:
        query = query.filter(MenuItem.id == menu_id)
    if is_available is not None:
        query = query.filter(MenuItem.is_available == is_available)

    return query.first() if first_only else query.all()

#--------------------------------------------------------#
#-----------Functions related to Menu Category-----------#
#--------------------------------------------------------#
def filter_menu_categories(**kwargs) -> List[MenuCategory]:
    """
    Dynamically filters menu categories based on provided fields.

    Supported fields:
        - id
        - restaurant_id
        - name
    """
    filters = []
    for field in ['id', 'restaurant_id', 'name']:
        value = kwargs.get(field)
        if value is not None:
            filters.append(getattr(MenuCategory, field) == value)

    return MenuCategory.query.filter(and_(*filters)).all()

#--------------------------------------------------------#
#---------------Functions related to Chat---------------#
#--------------------------------------------------------#
def get_chats_by_user(user_type: ChatSupportUserType, user_id: int):
    """
    Get all chats involving the user and group them by the other user involved.

    :param user_type: Enum value of ChatSupportUserType (e.g., ChatSupportUserType.Customer)
    :param user_id: Integer user ID
    :return: Dictionary grouped by (other_user_type, other_user_id)
    """
    chats = Chat.query.filter(
        or_(
            (Chat.from_type == user_type) & (Chat.from_id == user_id),
            (Chat.to_type == user_type) & (Chat.to_id == user_id)
        )
    ).order_by(Chat.time.asc()).all()

    grouped_chats = defaultdict(list)

    for chat in chats:
        if chat.from_type == user_type and chat.from_id == user_id:
            other_user = (chat.to_type, chat.to_id)
        else:
            other_user = (chat.from_type, chat.from_id)
        grouped_chats[other_user].append(chat)

    return grouped_chats

def get_chats_between_users(
        user1_type: ChatSupportUserType, user1_id: int,
        user2_type: ChatSupportUserType, user2_id: int
    ) -> List[Chat]:
    """
    Get all chat logs exchanged between two users (in either direction).

    :param user1_type: Enum value of ChatSupportUserType (e.g., ChatSupportUserType.Customer)
    :param user1_id: Integer ID of the first user
    :param user2_type: Enum value of ChatSupportUserType
    :param user2_id: Integer ID of the second user
    :return: List of Chat objects sorted by time
    """
    chats = Chat.query.filter(
        or_(
            and_(Chat.from_type == user1_type, Chat.from_id == user1_id,
                 Chat.to_type == user2_type, Chat.to_id == user2_id),
            and_(Chat.from_type == user2_type, Chat.from_id == user2_id,
                 Chat.to_type == user1_type, Chat.to_id == user1_id)
        )
    ).order_by(Chat.time.asc()).all()
    return chats

#--------------------------------------------------------#
#-------------Functions related to Favourites-------------#
#--------------------------------------------------------#
def filter_favourites(**kwargs) -> List[Favourites]:
    """
    Dynamically filters favourite restaurants.

    Supported fields:
        - id
        - customer_id
        - restaurant_id

    Returns:
        List[Favourites]: List of favourite entries matching the filter
    """
    filters = []
    for field in ['id', 'customer_id', 'restaurant_id']:
        value = kwargs.get(field)
        if value is not None:
            filters.append(getattr(Favourites, field) == value)

    return Favourites.query.filter(and_(*filters)).all()

#--------------------------------------------------------#
#-----------Functions related to Review-----------#
#--------------------------------------------------------#
def filter_restaurant_reviews(**kwargs) -> List[RestaurantReview]:
    """
    Dynamically filters restaurant reviews.

    Supported fields:
        - id
        - order_id
        - customer_id
        - restaurant_id
        - rating
    """
    filters = []
    for field in ['id', 'order_id', 'customer_id', 'restaurant_id', 'rating']:
        value = kwargs.get(field)
        if value is not None:
            filters.append(getattr(RestaurantReview, field) == value)

    return (
        RestaurantReview.query.filter(and_(*filters))
        .order_by(RestaurantReview.updated_at.desc()).all()
    )

def filter_driver_reviews(**kwargs) -> List[DriverReview]:
    """
    Dynamically filters driver reviews.

    Supported fields:
        - id
        - order_id
        - customer_id
        - driver_id
        - rating
    """
    filters = []
    for field in ['id', 'order_id', 'customer_id', 'driver_id', 'rating']:
        value = kwargs.get(field)
        if value is not None:
            filters.append(getattr(DriverReview, field) == value)

    return (
        DriverReview.query.filter(and_(*filters))
        .order_by(DriverReview.updated_at.desc()).all()
    )
