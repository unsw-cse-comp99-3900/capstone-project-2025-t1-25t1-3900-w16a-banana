"""Admin Test Object"""
from .test_user import UserTest
class AdminTest(UserTest):
    """Admin Test Object"""
    def __init__(
        self,
        email: str,
        password: str,
        first_name: str,
        last_name: str
    ):
        super().__init__(
            email=email, password=password
        )
        self.first_name = first_name
        self.last_name = last_name

    def get_username(self) -> str:
        """Get Username"""
        return f'{self.first_name} {self.last_name}'

    def register(self, client):
        """POST /admin/register"""
        return client.post('/admin/register', json={
            'email': self.email,
            'password': self.password,
            'first_name': self.first_name,
            'last_name': self.last_name
        })

    def get_pending_application(self, client, application_type: str):
        """GET /admin/pending/{application_type}"""
        return client.get(
            f'/admin/pending/{application_type}',
            headers=self.headers
        )

    def pending_application_action(self, client, application_type: str, user_id: int, action: str):
        """POST /admin/{application_type}/{user_id}/{action}"""
        return client.post(
            f'/admin/{application_type}/{user_id}/{action}',
            headers=self.headers
        )
