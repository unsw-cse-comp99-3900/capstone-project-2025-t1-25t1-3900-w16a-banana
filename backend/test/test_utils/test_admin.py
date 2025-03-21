from ..test_conf import client
from pathlib import Path

resources = Path(__file__).parent.parent / "resources"

class AdminTest():
    def __init__(
        self,
        email: str,
        password: str,
        first_name: str,
        last_name: str
    ):
        self.email = email
        self.password = password
        self.first_name = first_name
        self.last_name = last_name

    def login(self, client):
        return client.post('/auth/login', json={
            'email': self.email,
            'password': self.password,
            'user_type': 'admin'
        })

    def register(self, client):
        return client.post('/admin/register', json={
            'email': self.email,
            'password': self.password,
            'first_name': self.first_name,
            'last_name': self.last_name
        })
    
    def set_token(self, token: str):
        self.token = token
        self.auth_header = {
            "Authorization": self.token
        }

    def get_pending_application(self, client, application_type: str):
        return client.get(
            f'/admin/pending/{application_type}',
            headers=self.auth_header
        )