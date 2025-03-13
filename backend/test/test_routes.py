from test.test_conf import client
from pathlib import Path

resources = Path(__file__).parent / "resources"

# Test for admin register
def test_admin_register(client):
    response = client.post('/admin/register', json={
        "email": "admin@example.com",
        "password": "SafePass12!@!",
        "first_name": "John",
        "last_name": "Doe"
    })

    assert response.status_code == 200

    # Sign up using same email fails
    response = client.post('/admin/register', json={
        "email": "admin@example.com",
        "password": "SafePass12!@!",
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

#Test for restaurant register
def test_restaurant_register(client):
    data = {
        "email": "admin@example.com",
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