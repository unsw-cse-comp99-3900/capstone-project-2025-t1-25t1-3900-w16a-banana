from ..test_utils.test_restaurant import *
from pathlib import Path

resources = Path(__file__).parent.parent / "resources"

restaurant1 = RestaurantTest(
    email = 'sydneyeats@example.com',
    password = 'Abcd1234!',
    phone = '0412345678',
    name = 'Sydney Eats',
    address = '10 Street',
    suburb = 'Sydney',
    state = 'NSW',
    postcode = '2000',
    abn = '01234567891',
    description = "Sydney's best restaurant",
    image1 = (resources / 'restaurant_img1.jpg').open("rb"),
    image2 = (resources / 'restaurant_img2.jpg').open("rb"),
    image3 = (resources / 'restaurant_img3.jpg').open("rb")
)

restaurant2 = RestaurantTest(
    email = 'harbourgrill@example.com',
    password = 'Abcd1234!',
    phone = '0412349876',
    name = 'Harbour Grill',
    address = '10 Street',
    suburb = 'Sydney',
    state = 'NSW',
    postcode = '2000',
    abn = '01234567899',
    description = "Sydney's best restaurant",
    image1 = (resources / 'restaurant_img1.jpg').open("rb"),
    image2 = (resources / 'restaurant_img2.jpg').open("rb"),
    image3 = (resources / 'restaurant_img3.jpg').open("rb")
)

restaurant_fail_same_email = RestaurantTest(
    email = 'sydneyeats@example.com',
    password = 'Abcd1234!',
    phone = '0412345677',
    name = 'Parramatta Eats',
    address = '10 Street',
    suburb = 'Parramatta',
    state = 'NSW',
    postcode = '2124',
    abn = '01234567890',
    description = "Parramatta's best restaurant",
    image1 = (resources / 'restaurant_img1.jpg').open("rb"),
    image2 = (resources / 'restaurant_img2.jpg').open("rb"),
    image3 = (resources / 'restaurant_img3.jpg').open("rb")
)