"""Test Object for Driver"""
from werkzeug.datastructures import FileStorage
from .test_user import UserTest

class DriverTest(UserTest):
    """
    Class for testing Driver
    Features:
        - login
        - register
        - get_id
        - get_available_orders
        - pickup_order
        - accept_order
        - complete_order
    """
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
        super().__init__(
            email=email, password=password
        )
        self.phone = phone
        self.first_name = first_name
        self.last_name = last_name
        self.license_number = license_number
        self.car_plate = car_plate
        self.license_image = license_image
        self.registration_paper = registration_paper

    def get_username(self) -> str:
        """Get Username"""
        return f'{self.first_name} {self.last_name}'

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
