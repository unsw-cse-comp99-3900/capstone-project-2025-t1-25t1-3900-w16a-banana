# perform some simple checks on the phone number, postcode, and state
from models import State

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