from flask_restful import Resource
from flask import jsonify, Response
from .productiondbconfig import establish_connection

def jsonify_rows(data) -> Response:
    """ Returns a jsonified list of task rows from a list of tuples (database query result)."""
    out = []
    roles = {
    1: "Head Coord",
    2: "Coord",
    3: "Veteran CT",
    4: "New CT",
    5: "Working Remote",
    6: "Not Working"
    }
    for tuple in data:
        formatted_tuple = {
            "id": tuple[0],
            "first": tuple[1],
            "last": tuple[2],
            "role": roles[tuple[3]],
            "email": tuple[4],
            "tasks": tuple[5]
        }
        out.append(formatted_tuple)
    return jsonify(out)

class UsersApiEndpoint(Resource):
    """
        Function for getting for users.

        Parameters: 
            None
        
        Returns:
            Jsonified task list as formatted above.
    """
    def get(self):
        try:
            with establish_connection() as connection:
                cursor = connection.cursor()
                query = """
                        SELECT u.id, u.first_name, u.last_name, u.role, u.email, COUNT(t.id) AS uncompleted_tasks
                        FROM users u
                        LEFT JOIN task t ON u.id = t.employee_id
                        WHERE t.completed IS NULL
                        GROUP BY u.id, u.first_name, u.last_name, u.role, u.email
                        ORDER BY u.role;
                        """
                cursor.execute(query)
                response = jsonify_rows(cursor.fetchall())
                response.status_code = 200
                return response
        except Exception as e:
            return {'message': str(e)}, 500