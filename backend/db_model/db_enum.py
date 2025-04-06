"""Enum Used For DB"""
from enum import Enum

class ChatSupportUserType(Enum):
    """
    Class of Enum for User type that supports chat.
    - CUSTOMER 
    - RESTAURANT
    - DRIVER
    """
    CUSTOMER = 'CUSTOMER'
    RESTAURANT = 'RESTAURANT'
    DRIVER = 'DRIVER'

class OrderStatus(Enum):
    """
    Class for Enum of Order Status.
    Customer orders item -> PENDING -> Restaurant confirms -> RESTAURANT_ACCEPTED
    -> Restaurant notify food ready -> READY_FOR_PICKUP -> Driver pick up order
    -> PICKED_UP -> Driver completes delivery -> DELIVERED
    """
    PENDING = 'PENDING'
    RESTAURANT_ACCEPTED = 'RESTAURANT_ACCEPTED'
    READY_FOR_PICKUP = 'READY_FOR_PICKUP'
    PICKED_UP = 'PICKED_UP'
    DELIVERED = 'DELIVERED'
    CANCELLED = 'CANCELLED'

class RegistrationStatus(Enum):
    """
    Class for Enum of Registration Status of Driver and Restaurant
    - PENDING
    - APPROVED
    - REJECTED
    """
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"

class State(Enum):
    """Class of Enum with valid Australian States"""
    ACT = "ACT"
    NSW = "NSW"
    NT = "NT"
    QLD = "QLD"
    SA = "SA"
    TAS = "TAS"
    VIC = "VIC"
    WA = "WA"

class UserType(Enum):
    """
    Enum of All User Type
    - ADMIN
    - CUSTOMER
    - RESTAURANT
    - DRIVER
    """
    ADMIN = 'ADMIN'
    CUSTOMER = 'CUSTOMER'
    RESTAURANT = 'RESTAURANT'
    DRIVER = 'DRIVER'
