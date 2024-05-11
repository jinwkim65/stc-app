from flask_restful import Resource, request
from flask import jsonify, Response
from .productiondbconfig import establish_connection

def jsonify_rows(data) -> Response:
    """ Returns a jsonified output from a list of tuples (database query result).
        Shift:
            id (int)
            activities (list)
        
        Activity:
            type
            time
            location
    """
    shifts = {}
    
    for id, type, time, loc in data:
        if id not in shifts:
            shifts[id] = {
                "id": id,
                "activities": []
            }
        
        activity = {
            "type": type,
            "time": time,
            "location": loc
        }
        shifts[id]["activities"].append(activity)
    
    return jsonify(list(shifts.values()))

class ShiftReportApiEndpoint(Resource):
    """
        Function for getting a shift report for a given user id.

        Parameters: 
            user_id: user id to get shift report on
        
        Returns:
            Jsonified shift report as formatted above.
    """
    def get(self):
        user_id = request.args.get('user_id')
        try:
            with establish_connection() as connection:
                cursor = connection.cursor()
                query = """
                        SELECT a.shift_id, a.type, a.time, l.name
                        FROM activities a
                        LEFT JOIN shifts s on a.shift_id = s.id
                        LEFT JOIN location l on a.loc_id = l.id
                        WHERE s.user_id = %s
                        ORDER BY a.shift_id, a.time
                        """
                param_list = (user_id,)
                cursor.execute(query, param_list)
                response = jsonify_rows(cursor.fetchall())
                response.status_code = 200
                return response
        except Exception as e:
            return {'message': str(e)}, 500