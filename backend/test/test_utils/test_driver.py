from ..test_conf import client
from werkzeug.datastructures import FileStorage


class DriverTest:
    def __init__(
        self,
        email: str,
        password: str,
        phone: str,
        first_name: str,
        last_name: str,
        license_number: str,
        car_plate: str,
        license_image: FileStorage,
        registration_paper: FileStorage,
    ):
        self.email = email
        self.password = password
        self.phone = phone
        self.first_name = first_name
        self.last_name = last_name
        self.license_number = license_number
        self.car_plate = car_plate
        self.license_image = license_image
        self.registration_paper = registration_paper

    def register(self, client):
        """POST /driver/register"""
        return client.post(
            '/driver/register',
            content_type='multipart/form-data',
            data={
                'email': self.email,
                'password': self.password,
                'phone': self.phone,
                'first_name': self.first_name,
                'last_name': self.last_name,
                'license_number': self.license_number,
                'car_plate': self.car_plate,
                'license_image': self.license_image,
                'registration_paper': self.registration_paper,
            }
        )

    def login(self, client):
        """POST /auth/login for driver"""
        res = client.post('/auth/login', json={
            'email': self.email,
            'password': self.password,
            'user_type': 'driver'
        })
        if res.status_code == 200:
            self.token = res.get_json()['token']
            self.headers = {
                "Authorization": self.token
            }
            self.id = res.get_json()['driver_id']
        return res

    def get_id(self) -> int:
        """Get customer ID"""
        return self.id
    
    def get_available_orders(self, client):
        """GET /driver-order/orders/available"""
        return client.get(
            '/driver-order/orders/available',
            headers = self.headers
        )
    
    def accept_order(self, client, order_id: int):
        """POST /driver-order/order/accept/<int:order_id>"""
        return client.post(
            f'/driver-order/order/accept/{order_id}',
            headers = self.headers
        )
    
    def pickup_order(self, client, order_id: int):
        """POST /driver-order/order/pickup/<int:order_id>"""
        return client.post(
            f'/driver-order/order/pickup/{order_id}',
            headers = self.headers
        )
    
    def complete_order(self, client, order_id: int):
        """POST /driver-order/order/complete/<int:order_id>"""
        return client.post(
            f'/driver-order/order/complete/{order_id}',
            headers = self.headers
        )
    
