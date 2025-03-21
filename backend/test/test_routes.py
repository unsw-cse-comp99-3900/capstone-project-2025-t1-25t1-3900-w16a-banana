from .test_conf import client
from .test_utils.test_admin import *
from .test_utils.test_restaurant import *
from .test_utils.test_customer import *

from .test_data.admin import *
from .test_data.restaurant import *
from .test_data.customer import *
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

#Test for restaurant register
def test_03_customer_register_login(client):
    # Check if the register was successful
    response = customer1.register(client)
    assert response.status_code == 200
    response = customer2.register(client)
    assert response.status_code == 200

    # Same email register fails
    response = customer_fail_same_email.register(client)
    assert response.status_code == 400

    # Login should be successful. Get the token
    response = customer1.login(client)
    assert response.status_code == 200
    assert 'token' in response.get_json()

    
# Test to see pending restaurants
def test_04_check_pending_restaurant(client):
    # Get all pending applications of the restaurant
    response = admin1.get_pending_application(client, 'restaurant')

    # Check the response
    assert response.status_code == 200
    assert response.get_json()[0]['email'] == restaurant1.email
    assert response.get_json()[0]['registration_status'] == 'PENDING'

    # Approve 
    response = admin1.pending_application_action(client, 'restaurant', restaurant1.get_id(), 'approve')
    assert response.status_code == 200

def test_05_restaurant_menu(client):
    # Create new menu category
    response = restaurant1.category_create(client, 'category1')
    assert response.status_code == 200
    # Update Name
    response = restaurant1.category_update(
        client,
        response.get_json()['category_id'],
        'category_1'
    )
    assert response.status_code == 200

    # Create new
    response = restaurant1.category_create(client, 'category1')
    assert response.status_code == 200
    # Update to duplicate name fails
    response = restaurant1.category_update(
        client,
        response.get_json()['category_id'],
        'category_1'
    )
    assert response.status_code == 200
