from ..test_utils.test_customer import *
from pathlib import Path

resources = Path(__file__).parent.parent / "resources"

customer1 = CustomerTest(
    username = 'John Doe',
    email = 'john@example.com',
    password = 'Abcd1234!',
    phone = '0412345671',
    address = '10 Street',
    suburb = 'Sydney',
    state = 'NSW',
    postcode = '2000',
    profile_image = (resources / "profile_image_man.png").open("rb")
)

customer2 = CustomerTest(
    username = 'Jane Smith',
    email = 'jane@example.com',
    password = 'Abcd1234!',
    phone = '0412345672',
    address = '10 Street',
    suburb = 'Sydney',
    state = 'NSW',
    postcode = '2000',
    profile_image = (resources / "profile_image_woman.png").open("rb")
)

customer_fail_same_email = CustomerTest(
    username = 'Janey Smith',
    email = 'jane@example.com',
    password = 'Abcd1234!',
    phone = '0412345673',
    address = '10 Street',
    suburb = 'Sydney',
    state = 'NSW',
    postcode = '2000',
    profile_image = (resources / "profile_image_woman.png").open("rb")
)