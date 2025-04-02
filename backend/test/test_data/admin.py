"""Test data for Admin related APIs"""
from ..test_utils.test_admin import AdminTest

admin1 = AdminTest(
    email = 'admin@example.com',
    password = 'Abcd1234!',
    first_name = 'Tom',
    last_name = 'Smith'
)

admin_same_email = AdminTest(
    email = 'admin@example.com',
    password = 'Abcd1234!',
    first_name = 'John',
    last_name = 'Doe'
)

admin_weak_password = AdminTest(
    email = 'admin@example.com',
    password = 'Abcd1234',
    first_name = 'John',
    last_name = 'Doe'
)
