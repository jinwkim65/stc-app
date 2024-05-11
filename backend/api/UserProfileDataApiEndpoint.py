from flask_restful import Resource, request
from .productiondbconfig import establish_connection


class UserProfileDataApiEndpoint(Resource):
    """
        Function for getting user profile data for a given user id.

        Parameters: 
            user_id: user id to get profile data on
        
        Returns:
            Jsonified user profile data as formatted above.
    """
    def get(self):
        user_id = request.args.get('user_id')
        try:
            with establish_connection() as connection:
                cursor = connection.cursor()
                query = """
                        SELECT u.first_name, u.last_name
                        FROM users u
                        WHERE u.id = %s
                        """
                param_list = (user_id,)
                cursor.execute(query, param_list)
                result = cursor.fetchone()
                return {
                    "first_name": result[0],
                    "last_name": result[1]
                }, 200
        except Exception as e:
            return {'message': str(e)}, 500