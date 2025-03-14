from .test_conf import client
from pathlib import Path

resources = Path(__file__).parent / "resources"

ADMIN_EMAIL = "admin@example.com"
ADMIN_PASSWORD ="SafePass12!@!"
ADMIN_TOKEN = ""

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
def test_02_restaurant_register(client):
    data = {
        "email": "restaurant@example.com",
        "password": "SecurePassword12!@",
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
    response = client.post('/restaurant/register', content_type='multipart/form-data', data=data)
    assert response.status_code == 200

def test_03_check_pending_restaurant(client):
    headers = {
        "Authorization": ADMIN_TOKEN
    }
    print(ADMIN_TOKEN)
    response = client.get('/test/admin')

    print(response.get_json())

    response = client.get('/admin/pending/restaurant', headers=headers)

    print(response.get_json())
    assert response.status_code == 200