import os

# Function to generate secret key
def generate_key():
    # Generate a random key
    secret_key = os.urandom(24)
    # Save the key to a file
    with open("secret_key.txt", "wb") as key_file:
        key_file.write(secret_key)

# Function to load the secret key
def load_secret_key():
    try:
        with open("secret_key.txt", "rb") as key_file:
            return key_file.read()
    except FileNotFoundError:
        raise RuntimeError("secret_key.txt not found. Run generate_secret_key.py to generate it.")

if __name__ == "__main__":
    generate_key()
    print("Secret key generated and saved to secret_key.txt.")