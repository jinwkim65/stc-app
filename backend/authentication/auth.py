from flask import request, jsonify, Blueprint
from werkzeug.security import generate_password_hash, check_password_hash
from backend.models.users import get_user_by_email, register_user, get_password_hash
import requests


auth_app = Blueprint('authentication',__name__)


@auth_app.route('/register', methods=['POST', 'GET'])
def register():
    if request.method == 'GET':
        return {'message': 'Heyy Thereee!'}

    # Extract email and password from the request
    first_name = request.json.get('first_name')
    last_name = request.json.get('last_name')
    email_address = request.json.get('email_address')
    password = request.json.get('password')

    # Check if firstName and lastName are given
    if not first_name:
        return jsonify({'messaage':'missing first name'}), 400

    if not last_name:
        return jsonify({'messaage':'missing last name'}), 400


    # Check if email or password is missing
    if not email_address or not password:
        return jsonify({'message': 'email or password missing'}), 400

    # Hash the password
    hashed_password = generate_password_hash(password)

    #check if user exists in database
    exists = get_user_by_email(email=email_address)

    if not exists:

        # Save email and hashed password in the database
        new_user = register_user(first_name, last_name, email_address, hashed_password)

        if new_user:
            return jsonify({'message': 'User registered successfully',
                            'user': new_user}), 201


        else:
            return jsonify({'message': "Failed to create user"})




    else:
        return jsonify({'message': 'User already exists'}), 409



@auth_app.route('/login', methods=['POST', 'GET'])
def login():

    if request.method == 'GET':
        return jsonify({'message': "time to log in buddy"})

    email_address = request.json.get('email_address')
    password = request.json.get('password')


    if not email_address or not password:
        return jsonify({'message': 'email or password missing'}), 400




    # Find the user in the database
    get_user = get_user_by_email(email_address)

    #check password
    users_password_hash = get_password_hash(email_address)



    verify_pass = check_password_hash(users_password_hash, password)

    if get_user and verify_pass==True:
        return jsonify({'message': 'Login successful!! Welcome CT!!'}), 200


    return jsonify({'message': 'Invalid username or password'}), 401



## create dummy sqlite database for testing and development
## create pydantic models to enforce some API rules
