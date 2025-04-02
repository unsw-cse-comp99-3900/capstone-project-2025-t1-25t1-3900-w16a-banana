"""Admin Test Object"""
class AdminTest():
    """Admin Test Object"""
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
        self.token = None
        self.auth_header = None
        self.id = None

    def login(self, client):
        """POST /auth/login"""
        res = client.post('/auth/login', json={
            'email': self.email,
            'password': self.password,
            'user_type': 'admin'
        })

        if res.status_code == 200:
            self.token = res.get_json()['token']
            self.auth_header = {
                "Authorization": self.token
            }
            self.id = res.get_json()['id']

        return res

    def register(self, client):
        """POST /admin/register"""
        return client.post('/admin/register', json={
            'email': self.email,
            'password': self.password,
            'first_name': self.first_name,
            'last_name': self.last_name
        })

    def get_id(self) -> int:
        """GET ID of Driver"""
        return self.id

    def get_pending_application(self, client, application_type: str):
        """GET /admin/pending/{application_type}"""
        return client.get(
            f'/admin/pending/{application_type}',
            headers=self.auth_header
        )

    def pending_application_action(self, client, application_type: str, user_id: int, action: str):
        """POST /admin/{application_type}/{user_id}/{action}"""
        return client.post(
            f'/admin/{application_type}/{user_id}/{action}',
            headers=self.auth_header
        )
