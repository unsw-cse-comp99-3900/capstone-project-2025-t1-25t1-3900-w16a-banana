import pytest
from test.test_conf import client



# Test for admin register
def test_admin_register(client):
    response = client.post('/admin/register', json={
        "email": "admin@example.com",
        "password": "SafePass12!@!",
        "first_name": "John",
        "last_name": "Doe"
    })

    assert response.status_code == 200