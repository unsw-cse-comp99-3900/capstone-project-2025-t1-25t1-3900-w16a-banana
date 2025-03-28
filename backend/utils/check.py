"""Perform some simple checks on the phone number, postcode, and state""" 
import re
from db_model.db_enum import State, OrderStatus

def is_valid_order_status(status: str) -> bool:
    """Returns boolean of whether the status is valid or not"""
    try:
        OrderStatus(status)
        return True
    except ValueError:
        return False

def is_valid_card_format(s: str) -> bool:
    """
    Returns boolean whether given string is valid card format.
    4 digit followed/not followed by dash(-); forming total 16 digit.
    1234-5678-9123-4567
    """
    pattern = r"^\d{4}(-?\d{4}){3}$"
    return bool(re.fullmatch(pattern, s))


def is_valid_phone(phone: str) -> bool:
    """Return boolean about whether given string is valid phone"""
    return phone.startswith("0")\
        and len(phone) == 10\
        and phone[1] in '23478'\
        and phone.isdigit()

def is_valid_postcode(postcode: str) -> bool:
    """Return boolean about whether given string is valid postcode"""
    return len(postcode) == 4 and postcode.isdigit()

def is_valid_state(state: str) -> bool:
    """Return boolean about whether given string is valid state"""
    try:
        State(state)
        return True
    except ValueError:
        return False

def is_valid_license_number(license_number: str) -> bool:
    """Return boolean about whether given string is valid license number"""
    return license_number.isdigit()

def is_valid_abn(abn: str):
    """Return boolean about whether given string is valid abn"""
    return abn.isdigit() and len(abn) == 11

def is_password_safe(password: str) -> tuple[bool, str]:
    """
    Return boolean and description about whether given string is safe password.
    Must be at least of length 8.
    Must contain at least one upper, lower case, number, and special character
    """
    if len(password) < 8:
        return False, "Password must have at least 8 characters."
    if not re.search(r"[A-Z]", password):
        return False, "Password must contain at least one uppercase letter."
    if not re.search(r"[a-z]", password):
        return False, "Password must contain at least one lowercase letter."
    if not re.search(r"\d", password):
        return False, "Password must contain at least one number."
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        return False, "Password must contain at least one special character."
    if password.lower() in ["password", "12345678", "qwerty", "admin", "letmein"]:
        return False, "Password is too common."
    return True, "Password is safe"
