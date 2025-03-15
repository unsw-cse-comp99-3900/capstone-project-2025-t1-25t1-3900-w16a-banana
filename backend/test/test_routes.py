from .test_conf import client
from pathlib import Path

resources = Path(__file__).parent / "resources"


# Global test configurations
ADMIN_EMAIL = "admin@example.com"
ADMIN_PASSWORD ="SafePass12!@!"
ADMIN_TOKEN = ""

RESTAURANT_EMAIL = "restaurant@example.com"
RESTAURANT_PASSWORD = "SecurePassword12!@"
RESTAURANT_TOKEN = ""

# Test for admin register
def test_01_admin_register_login(client):
    response = client.post('/admin/register', json={
        "email": ADMIN_EMAIL,
        "password": ADMIN_PASSWORD,
        "first_name": "John",
        "last_name": "Doe"
    })

    assert response.status_code == 200

    # Sign up using same email fails
    response = client.post('/admin/register', json={
        "email": ADMIN_EMAIL,
        "password": ADMIN_PASSWORD,
        "first_name": "John",
        "last_name": "Doe"
    })

    assert response.status_code == 400
    
    # Sign up with weak password fails
    response = client.post('/admin/register', json={
        "email": "newadmin@example.com",
        "password": "SafePass12",
        "first_name": "John",
        "last_name": "Doe"
    })

    assert response.status_code == 400

    # Get the toekn by loggin in with admin account
    response = client.post('/auth/login', json={
        'email': ADMIN_EMAIL,
        'password': ADMIN_PASSWORD,
        'user_type': 'admin'
    })

    assert response.status_code == 200
    assert 'token' in response.get_json()

    global ADMIN_TOKEN
    ADMIN_TOKEN = response.get_json()['token']

#Test for restaurant register
def test_02_restaurant_register_login(client):
    data = {
        "email": RESTAURANT_EMAIL,
        "password": RESTAURANT_PASSWORD,
        "phone": "0412345678",
        "name": "A Restaurant",
        "address": "111 Street",
        "suburb": "Kensington",
        "state": "NSW",
        "postcode": "2000",
        "abn": "11111111111",
        "description": "A good restaurant",
        'image1': (resources / "test.png").open("rb"),
        'image2': (resources / "test.png").open("rb"),
        'image3': (resources / "test.png").open("rb")
    }

    # Check if the register was successful
    response = client.post('/restaurant/register', content_type='multipart/form-data', data=data)
    assert response.status_code == 200

    response = client.post('/auth/login', json={
        'email': RESTAURANT_EMAIL,
        'password': RESTAURANT_PASSWORD,
        'user_type': 'restaurant'
    })

    assert response.status_code == 200
    assert 'token' in response.get_json()

    global RESTAURANT_TOKEN
    RESTAURANT_TOKEN = response.get_json()['token']
    
    

# Test to see pending restaurants
def test_03_check_pending_restaurant(client):
    # Token for admin
    admin_headers = {
        "Authorization": ADMIN_TOKEN
    }
    # Get all pending applications of the restaurant
    response = client.get('/admin/pending/restaurant', headers=admin_headers)

    # Check the response
    assert response.status_code == 200
    assert response.get_json()[0]['email'] == RESTAURANT_EMAIL
    assert response.get_json()[0]['registration_status'] == 'PENDING'

