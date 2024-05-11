import unittest
from backend.authentication.auth import auth_app

class UserRegistrationTestCase(unittest.TestCase):

    def setUp(self):
        # Create a test client
        self.app = auth_app.test_client()

        # Propagate exceptions to the test client
        self.app.testing = True
    def test_user_registration(self):

        user = {
            "first_name": "John",
            "last_name": "Osman",
            "email_address": "jphn.osman@gmail.com",
            "password": "john@env"
        }
        response = self.app.post('/register', json=user)

        # Check if the status code is 201
        self.assertEqual(response.status_code, 201)

        print("-------------------------------------------------------")
        print(response.json)
        print("-------------------------------------------------------")






if __name__ == "__main__":
    unittest.main()