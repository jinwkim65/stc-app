from flask_restful import Resource, request
from flask import jsonify, Response
from .productiondbconfig import establish_connection

def jsonify_out(data) -> Response:
    out = {"isSTC": data}
    return jsonify(out)

class CheckRoleApiEndpoint(Resource):
    """
        Api endpoint for checking if user is STC employee.

        Parameters: 
            id: netid of user
        Returns:
            1 or 0
    """
    def post(self):
        data = request.get_json()
        try:
            with establish_connection() as connection:
                cursor = connection.cursor()
                query = """
                        SELECT COUNT(*) > 0 AS is_stc
                        FROM users u
                        WHERE u.id = %s;
                        """
                cursor.execute(query, (data['id'],))
                response = jsonify_out(cursor.fetchall())
                response.status_code = 200
                return response
        except Exception as e:
            return {'message': str(e)}, 500