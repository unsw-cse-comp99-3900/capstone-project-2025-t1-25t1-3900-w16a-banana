"""Test for APIs"""
from pathlib import Path

from .test_data.admin import (
    admin1, admin_same_email, admin_weak_password
)
from .test_data.restaurant import (
    restaurant1, restaurant2, restaurant_fail_same_email
)
from .test_data.customer import  (
    customer1, customer2, customer_same_email, customer_weak_password
)
from .test_data.driver import (
    driver1, driver2, driver_same_email, driver_weak_password
)

resources = Path(__file__).parent/ "resources"


def test_01_admin_register_login(client):
    """Test for Admin Register and Login"""
    # Normal signup
    response = admin1.register(client)
    assert response.status_code == 200
    # Sign up using same email fails
    response = admin_same_email.register(client)
    assert response.status_code == 400
    # Sign up with weak password fails
    response = admin_weak_password.register(client)
    assert response.status_code == 400
    # Login with admin
    response = admin1.login(client)
    assert response.status_code == 200
    assert 'token' in response.get_json()

def test_01_customer_register_login(client):
    """Test for Customer Register and Login"""
    # Check if the register was successful
    response = customer1.register(client)
    assert response.status_code == 200
    response = customer2.register(client)
    assert response.status_code == 200
    # Same email register fails
    response = customer_same_email.register(client)
    assert response.status_code == 400
    # Weak password customer register should fail
    response = customer_weak_password.register(client)
    assert response.status_code == 400
    # Login should be successful. Get the token
    response = customer1.login(client)
    assert response.status_code == 200
    assert 'token' in response.get_json()


#Test for restaurant register
def test_01_restaurant_register_login(client):
    """Test for Restaurant Register and Login"""
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

# Test for driver register and login
def test_01_driver_register_login(client):
    """Test for Driver Register and Login"""
    # Ordinary Register
    response = driver1.register(client)
    assert response.status_code == 200
    response = driver2.register(client)
    assert response.status_code == 200
    # Duplicate email should fail
    response = driver_same_email.register(client)
    assert response.status_code == 400
    # Weak passowrd should fail to register
    response = driver_weak_password.register(client)
    assert response.status_code == 400
    # Login with driver
    response = driver1.login(client)
    assert response.status_code == 200
    assert 'token' in response.get_json()

# Test to see pending restaurants
def test_02_check_pending_restaurant(client):
    """Test for Admin Cheking Pending Application and Approve it"""
    # Get all pending applications of the restaurant
    response = admin1.get_pending_application(client, 'restaurant')

    # Check the response
    assert response.status_code == 200
    assert response.get_json()[0]['email'] == restaurant1.email
    assert response.get_json()[0]['registration_status'] == 'PENDING'

    # Approve 
    response = admin1.pending_application_action(
        client, 'restaurant', restaurant1.get_id(), 'approve'
    )
    assert response.status_code == 200

def test_03_restaurant_menu(client):
    """Test for Restaurant Category and Menu Creation"""
    # Create new menu category
    response = restaurant1.category_create(client, 'category1')
    assert response.status_code == 200

    cat1_data = response.get_json()

    # Update Name
    response = restaurant1.category_update(
        client,
        cat1_data['id'],
        'category_1'
    )
    assert response.status_code == 200

    # Create new
    response = restaurant1.category_create(client, 'category1')
    assert response.status_code == 200
    # Update to duplicate name fails
    response = restaurant1.category_update(
        client,
        response.get_json()['id'],
        'category_1'
    )
    assert response.status_code == 400

    # Create new menu item
    response = restaurant1.item_create(
        client, 'menu1', 'description', 10.0, True,
        (resources / "test.png").open("rb"), cat1_data['id']
    )
    assert response.status_code == 200

def test_04_customer_order(client):
    """Test for Customer Adding Item to Cart and Placing Order"""
    # Check for the empty cart
    response = customer1.cart_get(client)
    assert response.status_code == 200
    assert len(response.get_json()) == 0

    # Get the first item from the restaurant
    menu_id = restaurant1.items_get(client).get_json()[0]['id']

    # Add to the cart
    response = customer1.cart_update(client, menu_id, 4)
    assert response.status_code == 200

    # Check if successfully added
    response = customer1.cart_get(client)
    assert response.status_code == 200
    assert len(response.get_json()) == 1

    # Update the quantity
    response = customer1.cart_update(client, menu_id, 20)
    assert response.status_code == 200

    # Check if the item is still there and updated.
    response = customer1.cart_get(client)
    assert response.status_code == 200
    assert len(response.get_json()) == 1
    assert response.get_json()[0]['quantity'] == 20

    # Delete item
    response = customer1.cart_update(client, menu_id, 0)
    assert response.status_code == 200

    # Check if the item is still there and updated.
    response = customer1.cart_get(client)
    assert response.status_code == 200
    assert len(response.get_json()) == 0

    # Add to the cart again
    response = customer1.cart_update(client, menu_id, 4)
    assert response.status_code == 200

    # Order the food
    response = customer1.order_new(
        client=client,
        restaurant_id=restaurant1.get_id(),
        address='someaddree',
        suburb='some suburb',
        state='NSW',
        postcode='2000',
        customer_notes='Hello this is note',
        card_number='1234-1234-4567-7890'
    )
    assert response.status_code == 200

    # Cart should be empty now
    response = customer1.cart_get(client)
    assert response.status_code == 200
    assert len(response.get_json()) == 0

def test_05_restaurant_accept(client):
    """Test for Restaurant Accept Order"""
    # Get all the pending orders
    response = restaurant1.orders_get(client, 'pending')
    assert response.status_code == 200
    assert response.get_json()['orders'][0]['order_status'] == 'PENDING'

    order_id = response.get_json()['orders'][0]['id']

    # Accept the order
    response = restaurant1.order_action(client, 'accept', order_id)
    assert response.status_code == 200

    # The order should be active now
    response = restaurant1.orders_get(client, 'active')
    assert response.status_code == 200
    assert response.get_json()['orders'][0]['order_status'] == 'ACCEPTED'

    # Ready for pickup
    response = restaurant1.order_action(client, 'ready', order_id)
    assert response.status_code == 200
    response = restaurant1.orders_get(client, 'active')
    assert response.status_code == 200
    assert response.get_json()['orders'][0]['order_status'] == 'READY_FOR_PICKUP'

def test_06_driver_handling_order(client):
    """Test for Driver Accept, Pickup and Complete Order"""
    response = driver1.get_available_orders(client)
    assert response.status_code == 200

    data = response.get_json()
    assert len(data) == 1
    order = data[0]
    assert order['customer_id'] == customer1.get_id()
    assert order['restaurant_id'] == restaurant1.get_id()


    # Pick up or complete should fail when not accepted by driver
    response = driver1.pickup_order(client, order['id'])
    assert response.status_code == 404
    response = driver1.complete_order(client, order['id'])
    assert response.status_code == 404

    # accept the order
    response = driver1.accept_order(client, order['id'])
    assert response.status_code == 200

    # Accept or complete should fail when not picked up
    response = driver1.accept_order(client, order['id'])
    assert response.status_code == 404
    response = driver1.complete_order(client, order['id'])
    assert response.status_code == 400

    # Pick up the order
    response = driver1.pickup_order(client, order['id'])
    assert response.status_code == 200

    # Complete the order
    response = driver1.complete_order(client, order['id'])
    assert response.status_code == 200
