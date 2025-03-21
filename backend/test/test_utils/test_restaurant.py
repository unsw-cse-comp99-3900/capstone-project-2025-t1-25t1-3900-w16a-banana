from ..test_conf import client
from pathlib import Path

class RestaurantTest():
    def __init__(
        self,
        email: str,
        password: str,
        phone: str,
        name: str,
        address: str,
        suburb: str,
        state: str,
        postcode: str,
        abn: str,
        description: str,
        image1: bytes,
        image2: bytes,
        image3: bytes
    ):
        self.email = email
        self.password = password
        self.phone = phone
        self.name = name
        self.address = address
        self.suburb = suburb
        self.state = state
        self.postcode = postcode
        self.abn = abn
        self.description = description
        self.image1 = image1
        self.image2 = image2
        self.image3 = image3

    def login(self, client):
        return client.post('/auth/login', json={
            'email': self.email,
            'password': self.password,
            'user_type': 'restaurant'
        })

    def register(self, client):
        return client.post(
            '/restaurant/register',
            content_type='multipart/form-data',
            data={
                "email": self.email,
                "password": self.password,
                "phone": self.phone,
                "name": self.name,
                "address": self.address,
                "suburb": self.suburb,
                "state": self.state,
                "postcode": self.postcode,
                "abn": self.abn,
                "description": self.description,
                'image1': self.image1,
                'image2': self.image2,
                'image3': self.image3
            }
        )
    
    def set_token(self, token: str):
        self.token = token