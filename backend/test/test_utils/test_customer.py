"""Test Object For Customer"""
from werkzeug.datastructures import FileStorage

from .test_user import UserTest

class CustomerTest(UserTest):
    """
    Class for testing Customer
    Features:
        - login
        - register
        - cart update
        - cart get
        - order_new
        - order_get
    """
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
        super().__init__(
            email=email, password=password
        )
        self.username = username
        self.phone = phone
        self.address = address
        self.suburb = suburb
        self.state = state
        self.postcode = postcode
        self.profile_image = profile_image

        self.cart = []

    def register(self, client):
        """POST /customer/register"""
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

    def get_username(self) -> str:
        """Get Username"""
        return self.username

    def cart_update(
        self,
        client,
        menu_id: int,
        quantity: int
    ):
        """PUT /customer-order/cart"""
        res = client.put(
            '/customer-order/cart',
            headers = self.headers,
            json = {
                'menu_id': menu_id,
                'quantity': quantity
            }
        )
        return res

    def cart_get(self, client):
        """GET /customer-order/cart"""
        return client.get('/customer-order/cart', headers = self.headers)

    def order_new(
        self,
        client,
        restaurant_id: int,
        address: str,
        suburb: str,
        state: str,
        postcode: str,
        customer_notes: str,
        card_number: str,
        order_price: float,
        delivery_fee: float,
        total_price: float
    ):
        """POST /customer-order/order"""
        res = client.post(
            '/customer-order/order',
            headers = self.headers,
            json={
                'restaurant_id': restaurant_id,
                'address': address,
                'suburb': suburb,
                'state': state,
                'postcode': postcode,
                'customer_notes': customer_notes,
                'card_number': card_number,
                'order_price': order_price,
                'delivery_fee': delivery_fee,
                'total_price': total_price
            }
        )
        return res

    def orders_get(self, client):
        """GET /customer-order/orders"""
        return client.get(
            '/customer-order/orders',
            headers = self.headers
        )
