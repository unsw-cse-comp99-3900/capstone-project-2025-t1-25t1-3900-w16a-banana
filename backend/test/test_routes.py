"""Test for APIs"""
from pathlib import Path

from .test_data.admin import (
    admin1, admin_same_email, admin_weak_password
)
from .test_data.restaurant import (
    restaurant1, restaurant2, restaurant_fail_same_email,
    restaurant_wrong_state
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
    response = customer2.login(client)
    assert response.status_code == 200
    assert 'token' in response.get_json()

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
    # Wrong State should fail
    response = restaurant_wrong_state.register(client)
    assert response.status_code == 400
    # Login should be successful. Get the token
    response = restaurant1.login(client)
    assert response.status_code == 200
    assert 'token' in response.get_json()
    response = restaurant2.login(client)
    assert response.status_code == 200
    assert 'token' in response.get_json()

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
    # Login with driver1 and driver2
    response = driver1.login(client)
    assert response.status_code == 200
    assert 'token' in response.get_json()
    response = driver2.login(client)
    assert response.status_code == 200
    assert 'token' in response.get_json()

def test_02_approve_reject_pending_restaurant(client):
    """Test for Admin Cheking Pending Application and Approve it"""
    # Get all pending applications of the restaurant
    response = admin1.get_pending_application(client, 'restaurant')
    assert response.status_code == 200
    pendings = response.get_json()
    assert len(pendings) == 2
    assert pendings[0]['email'] == restaurant1.email
    assert pendings[0]['registration_status'] == 'PENDING'
    # Approve restaurant1
    response = admin1.pending_application_action(
        client, 'restaurant', restaurant1.get_id(), 'approve'
    )
    assert response.status_code == 200
    assert restaurant1.get_me(client).get_json()['registration_status']\
    == 'APPROVED'
    # Reject restaurant2
    assert pendings[1]['email'] == restaurant2.email
    response = admin1.pending_application_action(
        client, 'restaurant', restaurant2.get_id(), 'reject'
    )
    assert response.status_code == 200
    assert restaurant2.get_me(client).get_json()['registration_status']\
    == 'REJECTED'

def test_03_restaurant_menu(client):
    """Test for Restaurant Category and Menu Creation"""
    # Create new menu category
    response = restaurant1.category_create(client, 'category1')
    assert response.status_code == 200
    cat1_data = response.get_json()
    assert restaurant1.category_get(client, cat1_data['id']).get_json()['name'] == 'category1'
    # Update Name
    response = restaurant1.category_update(
        client,
        cat1_data['id'],
        'category_1'
    )
    assert response.status_code == 200
    assert restaurant1.category_get(client, cat1_data['id']).get_json()['name'] == 'category_1'
    # Create category with name that is now free to use
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
    # Check if it is really created
    response = restaurant1.items_get_in_category(client, cat1_data['id'])
    assert response.status_code == 200
    assert len(response.get_json()) == 1
    created_menu = response.get_json()[0]
    assert created_menu['name'] == 'menu1'
    assert created_menu['description'] == 'description'
    assert created_menu['price'] == 10.0
    assert created_menu['is_available'] is True

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
        card_number='1234-1234-4567-7890',
        order_price=10.0,
        delivery_fee=2.0,
        total_price=12.0
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
    assert response.get_json()['orders'][0]['order_status'] == 'RESTAURANT_ACCEPTED'

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

def test_06_chat(client):
    """Test for chatting"""
    # 1. Chat between Customer and Restaurant
    # Customer send chat
    response = customer1.chat_send(
        client, 'restaurant', restaurant1.get_id(), 'customer to restaurant'
    )
    assert response.status_code == 200

    # Chek if restaurant received
    response = restaurant1.chat_get(client, 'customer', customer1.get_id())
    assert response.status_code == 200
    response = response.get_json()
    assert "chats" in response
    assert "user" in response

    # the response contain {user, chats}
    target_user, chat_logs = response["user"], response["chats"]
    assert target_user["role"] == "customer"
    assert target_user["id"] == customer1.get_id()

    assert len(chat_logs) == 1
    assert chat_logs[0]['message_type'] == 'received'
    assert chat_logs[0]['message'] == 'customer to restaurant'

    # Restaurant send chat
    response = restaurant1.chat_send(client, 'customer', customer1.get_id(), 'restaurant to customer')
    assert response.status_code == 200

    # Check if customer received
    response = customer1.chat_get(client, 'restaurant', restaurant1.get_id())
    assert response.status_code == 200
    
    response = response.get_json()
    target_user, chat_logs = response["user"], response["chats"]
    
    assert len(chat_logs) == 2
    assert chat_logs[1]['message_type'] == 'received'
    assert chat_logs[1]['message'] == 'restaurant to customer'

    # 2. Chat between customer and driver
    response = customer1.chat_send(
        client, 'driver', driver1.get_id(), 'customer to driver'
    )
    assert response.status_code == 200
    response = driver1.chat_send(
        client, 'customer', customer1.get_id(), 'driver to customer'
    )
    assert response.status_code == 200
    # 3. Chat between driver and restaurant
    response = restaurant1.chat_send(
        client, 'driver', driver1.get_id(), 'restaurant to driver'
    )
    assert response.status_code == 200
    response = driver1.chat_send(
        client, 'restaurant', restaurant1.get_id(), 'driver to restaurant'
    )
    assert response.status_code == 200
    # 4. Chat between Customers is not allowed.
    response = customer1.chat_send(client, 'customer', customer2.get_id(), 'Failed Message')
    assert response.status_code == 400
    # 5. Chat between Restaurants is not allowed.
    response = restaurant1.chat_send(client, 'restaurant', restaurant2.get_id(), 'Failed Message')
    assert response.status_code == 400
    # 6. Chat between Drivers is not allowed.
    response = driver1.chat_send(client, 'driver', driver2.get_id(), 'Failed Message')
    assert response.status_code == 400
