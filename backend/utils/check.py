# perform some simple checks on the phone number, postcode, and state
from db_model import State
import re

def is_valid_phone(phone):
    return phone.startswith("04") and len(phone) == 10 and phone.isdigit()

def is_valid_postcode(postcode):
    return len(postcode) == 4 and postcode.isdigit()

def is_valid_state(state):
    try:
        State(state)
        return True
    except ValueError:
        return False

def is_valid_license_number(license_number):
    return license_number.isdigit()

def is_valid_abn(abn):
    return abn.isdigit() and len(abn) == 11

def is_password_safe(password: str) -> tuple[bool, str]:
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