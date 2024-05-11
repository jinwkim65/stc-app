from flask_restful import Resource, request
from flask import jsonify, Response
from .productiondbconfig import establish_connection

def jsonify_rows(data) -> Response:
    """ Returns a jsonified list of task rows from a list of tuples (database query result)."""
    out = []
    for tuple in data:
        formatted_tuple = {
            "first": tuple[0],
            "last": tuple[1],
            "type": tuple[2],
            "loc": tuple[3],
            "assigned": tuple[4],
            "completed": tuple[5],
            "desc": tuple[6],
            "id": tuple[7]
        }
        out.append(formatted_tuple)
    return jsonify(out)

class UserTasksApiEndpoint(Resource):
    """
        Function for getting upcoming tasks for a user.

        Parameters: 
            user id: id of user to gather tasks for.
        
        Returns:
            Jsonified task list as formatted above.
    """
    def get(self):
        data = request.args.get('employee_id')
        try:
            with establish_connection() as connection:
                cursor = connection.cursor()
                query = """
                        SELECT u.first_name, u.last_name, t.type, l.name, t.assigned, t.completed, t.desc, t.id
                        FROM task t
                        LEFT JOIN users u on t.employee_id = u.id
                        LEFT JOIN location l on t.loc_id = l.id
                        WHERE t.employee_id = %s AND t.completed is NULL
                        ORDER BY t.assigned
                        """
                param_list = (data,)
                cursor.execute(query, param_list)
                response = jsonify_rows(cursor.fetchall())
                response.status_code = 200
                return response
        except Exception as e:
            return {'message': str(e)}, 500