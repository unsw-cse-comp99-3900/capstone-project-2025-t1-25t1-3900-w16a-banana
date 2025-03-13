from test.test_conf import client
import io

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

# #Test for restaurant register
# def test_restaurant_register(client):
#     response = client.post('/restaurant/register', content_type='multipart/form-data' ,data={
#         "email": (None, "admin@example.com"),
#         "password": (None, "SecurePassword12!@"),
#         "phone": (None, "0412345678"),
#         "name": (None, "A Restaurant"),
#         "address": (None, "111 Street"),
#         "suburb": (None, "Kensington"),
#         "state": (None, "NSW"),
#         "postcode": (None, "2000"),
#         "abn": (None, "11111111111"),
#         "description": "A good restaurant",
#         'image1': (io.BytesIO(b"fakeimage1"), 'fakeimage1.png', 'image/png'),
#         'image2': (io.BytesIO(b"fakeimage2"), 'fakeimage2.png', 'image/png'),
#         'image3': (io.BytesIO(b"fakeimage3"), 'fakeimage3.png', 'image/png')
#     })
#     print(response)
#     assert response.status_code == 200