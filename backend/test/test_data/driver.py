"""Test Data for Driver Test"""
from pathlib import Path
from ..test_utils.test_driver import DriverTest

resources = Path(__file__).parent.parent / "resources"

driver1 = DriverTest(
    email = 'alex@example.com',
    password = 'Abcd1234!',
    phone = '0455556666',
    first_name = 'Alex',
    last_name = 'Johnson',
    license_number = '00000000',
    car_plate = 'PLATE1',
    license_image = (resources / "license_image.png").open("rb"),
    registration_paper = (resources / "registration_paper.png").open("rb")
)

driver2 = DriverTest(
    email = 'sophia@example.com',
    password = 'Abcd1234!',
    phone = '0455557777',
    first_name = 'Sophia',
    last_name = 'Wilson',
    license_number = '00000001',
    car_plate = 'PLATE2',
    license_image = (resources / "license_image.png").open("rb"),
    registration_paper = (resources / "registration_paper.png").open("rb")
)

driver_same_email = DriverTest(
    email = 'alex@example.com',
    password = 'Abcd1234!',
    phone = '0455557777',
    first_name = 'Sophia',
    last_name = 'Wilson',
    license_number = '00000001',
    car_plate = 'PLATE2',
    license_image = (resources / "license_image.png").open("rb"),
    registration_paper = (resources / "registration_paper.png").open("rb")
)

driver_weak_password = DriverTest(
    email = 'alex1@example.com',
    password = 'Abcd1234',
    phone = '0455557777',
    first_name = 'Sophia',
    last_name = 'Wilson',
    license_number = '00000001',
    car_plate = 'PLATE2',
    license_image = (resources / "license_image.png").open("rb"),
    registration_paper = (resources / "registration_paper.png").open("rb")
)
