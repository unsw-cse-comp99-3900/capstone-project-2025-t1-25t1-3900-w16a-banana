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

    def login(self, client):
        """POST /customer/register"""
        res = client.post('/auth/login', json={
            'email': self.email,
            'password': self.password,
            'user_type': 'customer'
        })
        if res.status_code == 200:
            self.token = res.get_json()['token']
            self.headers = {
                "Authorization": self.token
            }
            self.id = res.get_json()['customer_id']
        return res

    def get_id(self) -> int:
        """Get customer ID"""
        return self.id
    

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
        card_number: str
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
                'card_number': card_number
            }
        )
        return res
    
    def orders_get(self, client):
        return client.get(
            '/customer-order/orders',
            headers = self.headers
        )
