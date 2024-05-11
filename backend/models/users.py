from backend.api.productiondbconfig import establish_connection


def get_user_by_email(email):
    try:
        with establish_connection() as connection:
            with connection.cursor() as cursor:
                query = """
                        SELECT email FROM users
                        WHERE email = %s
                        """
                cursor.execute(query, (email,))
                current_user = cursor.fetchone()

                if current_user:
                    return True

                return False
    except Exception as e:
        # Handle exceptions appropriately
        print(f"An error occurred: {e}")
        return False



    except Exception as e:
        raise e

def register_user(first_name, last_name, email, hashed_password):
    try:
        with establish_connection() as connection:
            cursor = connection.cursor()
            query = """
                    INSERT INTO users(first_name, last_name, email, password_hash)
                    VALUES (%s, %s, %s, %s)
                    RETURNING *
                    """
            # Execute the query with named parameters
            cursor.execute(query, (first_name, last_name, email, hashed_password,))

            # Fetch the inserted row
            registered_user = cursor.fetchone()

            # Commit the transaction
            connection.commit()

            return registered_user
    except Exception as e:
        # Handle exceptions appropriately
        print("Error occurred while registering user:", e)
        return None  # Indicate registration failure or handle differently as per your application logic



def get_password_hash(email):
    try:
        with establish_connection() as connection:
            with connection.cursor() as cursor:
                query = """
                        SELECT password_hash FROM users
                        WHERE email = %s
                        """
                cursor.execute(query, (email,))
                hashed_pass = cursor.fetchall()

                hashed_pass = str(hashed_pass[0][0])


                if hashed_pass:
                    return hashed_pass

                return
    except Exception as e:
        # Handle exceptions appropriately
        print(f"An error occurred: {e}")
        return False
