"""Parent Test Object For User"""

class UserTest:
    """
    Class for testing User.
    This will be parent for Admin, Customer, Driver, Restaurant
    Features:
        - login
        - get_me
        - chat_send
        - chat_get
        - chat_get_all
    """
    def __init__(self, email: str, password: str):
        self.email = email
        self.password = password
        self.id = None
        self.token = None
        self.headers = None

    def login(self, client):
        """POST /auth/login for any user type"""
        # Dynamically determine user_type from class name
        class_name = self.__class__.__name__
        user_type = class_name.replace("Test", "").lower()

        res = client.post('/auth/login', json={
            'email': self.email,
            'password': self.password,
            'user_type': user_type
        })

        if res.status_code == 200:
            self.token = res.get_json()['token']
            self.headers = {
                "Authorization": self.token
            }
            self.id = res.get_json()['id']
        return res

    def get_id(self):
        """Return ID of self"""
        return self.id

    def get_headers(self):
        """Get header of itself"""
        return self.headers

    def get_me(self, client):
        """GET /auth/me"""
        return client.get(
            '/auth/me',
            headers = self.headers
        )

    def chat_send(self, client, user_type: str, user_id: int, message: str):
        """POST /chat/send/{user_type}/{user_id}"""
        return client.post(
            f'/chat/send/{user_type}/{user_id}',
            headers = self.headers,
            json = {'message': message}
        )

    def chat_get(self, client, user_type: str, user_id: int):
        """GET /chat/get/{user_type}/{user_id}"""
        return client.get(
            f'/chat/get/{user_type}/{user_id}',
            headers = self.headers
        )

    def chat_get_all(self, client):
        """GET /chat/get/all"""
        return client.get(
            '/chat/get/all',
            headers = self.headers
        )
