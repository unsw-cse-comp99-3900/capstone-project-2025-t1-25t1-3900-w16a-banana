"""Test Restaurant Object"""
from .test_user import UserTest

class RestaurantTest(UserTest):
    """Test Restaurant Object"""
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
        super().__init__(
            email=email, password=password
        )
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

        self.menu_categories = []
        self.menu_items = []

    def register(self, client):
        """POST /restaurant/register"""
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

    def categories_get(self, client):
        """GET /restaurant-menu/categories"""
        return client.post(
            '/restaurant-menu/categoriesw',
            headers = self.headers
        )

    def category_create(self, client, name: str):
        """POST /restaurant-menu/categories"""
        res = client.post(
            '/restaurant-menu/category/new',
            json={"name": name},
            headers = self.headers
        )

        if res.status_code == 200:
            self.menu_categories.append({
                'id': res.get_json()['id'],
                'restaurant_id': self.id,
                'name': name
            })
        return res

    def category_update(self, client, category_id: int, new_name: str):
        """PUT /restaurant-menu/category/{id}"""
        res = client.put(
            f'/restaurant-menu/category/{category_id}',
            json={'name': new_name},
            headers = self.headers
        )

        if res.status_code == 200:
            for cat in self.menu_categories:
                if cat['id'] == category_id:
                    cat['name'] = new_name
        return res

    def category_delete(self, client, category_id: int):
        """DELETE /restaurant-menu/category/{category_id}"""
        res = client.delete(
            f'/restaurant-menu/category/{category_id}',
            headers = self.headers
        )

        if res.status_code == 200:
            for cat in self.menu_categories:
                if cat['id'] == category_id:
                    self.menu_categories.remove(cat)
        return res

    def item_create(
        self,
        client,
        name: str,
        description: str,
        price: float,
        is_available: bool,
        img: bytes,
        category_id: int
    ):
        """POST /restaurant-menu/item/new/{category_id}"""
        res = client.post(
            f'/restaurant-menu/item/new/{category_id}',
            headers = self.headers,
            content_type = 'multipart/form-data',
            data = {'img': img},
            query_string = {
                'name': name,
                'description': description,
                'price': price,
                'is_available': 'true' if is_available else 'false'            }
        )

        if res.status_code == 200:
            self.menu_items.append(res.get_json())
        return res

    # TODO: Function for item update
    def items_get(self, client):
        """GET /restaurant-menu/items"""
        return client.get(
            '/restaurant-menu/items',
            headers = self.headers,
        )

    def orders_get(self, client, order_type: str):
        """GET /restaurant-order/orders/{type}"""
        return client.get(
            f'/restaurant-order/orders/{order_type}',
            headers = self.headers
        )

    def order_action(self, client, action: str, order_id):
        """POST /restaurant-order/orders/{action}/{order_id}"""
        return client.post(
            f'/restaurant-order/orders/{action}/{order_id}',
            headers = self.headers
        )
