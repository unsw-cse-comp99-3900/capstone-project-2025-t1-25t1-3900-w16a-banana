from .test_conf import client
from .test_utils.test_admin import *
from .test_utils.test_restaurant import *

from .test_data.test_data_admin import *
from .test_data.test_data_restaurant import *
from pathlib import Path

resources = Path(__file__).parent / "resources"

# Test for admin register
def test_01_admin_register_login(client):

    response = admin1.register(client)
    assert response.status_code == 200

    # Sign up using same email fails
    response = admin_same_email.register(client)
    assert response.status_code == 400
    
    # Sign up with weak password fails
    response = admin_weak_password.register(client)
    assert response.status_code == 400

    # Get the toekn by loggin in with admin account
    response = admin1.login(client)
    assert response.status_code == 200
    assert 'token' in response.get_json()
    
    # Set the token information
    admin1.set_token(response.get_json()['token'])

#Test for restaurant register
def test_02_restaurant_register_login(client):
    # Check if the register was successful
    response = restaurant1.register(client)
    assert response.status_code == 200
    response = restaurant2.register(client)
    assert response.status_code == 200

    # Same email register fails
    response = restaurant_fail_same_email.register(client)
    assert response.status_code == 400

    # Login should be successful. Get the token
    response = restaurant1.login(client)
    assert response.status_code == 200
    assert 'token' in response.get_json()

    # Set the token information
    restaurant1.set_token(response.get_json()['token'])
    
# Test to see pending restaurants
def test_03_check_pending_restaurant(client):
    # Get all pending applications of the restaurant
    response = admin1.get_pending_application(client, 'restaurant')

    # Check the response
    assert response.status_code == 200
    assert response.get_json()[0]['email'] == restaurant1.email
    assert response.get_json()[0]['registration_status'] == 'PENDING'

