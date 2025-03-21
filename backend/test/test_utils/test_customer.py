from ..test_conf import client
from werkzeug.datastructures import FileStorage


class CustomerTest:
    def __init__(
        self,
        username: str,
        email: str,
        password: str,
        phone: str,
        address: str,
        suburb: str,
        state: str,
        postcode: str,
        profile_image: FileStorage = None
    ):
        self.username = username
        self.email = email
        self.password = password
        self.phone = phone
        self.address = address
        self.suburb = suburb
        self.state = state
        self.postcode = postcode
        self.profile_image = profile_image

    def register(self, client):
        """Register a new customer via multipart form"""
        return client.post(
            '/customer/register',
            json={
                'username': self.username,
                'email': self.email,
                'password': self.password,
                'phone': self.phone,
                'address': self.address,
                'suburb': self.suburb,
                'state': self.state,
                'postcode': self.postcode,
            }
        )

    def login(self, client):
        """Login the customer"""
        res = client.post('/auth/login', json={
            'email': self.email,
            'password': self.password,
            'user_type': 'customer'
        })
        if res.status_code == 200:
            self.token = res.get_json()['token']
            self.auth_header = {
                "Authorization": self.token
            }
            self.id = res.get_json()['customer_id']
        return res

    def get_id(self) -> int:
        return self.id
