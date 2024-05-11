from flask_restful import Resource, request
from .productiondbconfig import establish_connection

class LogActivityApiEndpoint(Resource):
    """
        Api endpoint for logging an activity into the activity log.

        Parameters: 
            shift_id: ID of user clocking in
            type: type of activity
            time: timestamp for activity log
            loc_id: location of the activity
        Returns:
            None
    """
    def post(self):
        # Parse request data
        data = request.get_json()['body']
        try:
            with establish_connection() as connection:
                cursor = connection.cursor()
                query = """
                        INSERT INTO activities (shift_id, type, time, loc_id)
                        VALUES (%s, %s, %s, %s)
                        """
                param_list = (data["shift_id"], data["type"], data["time"], data["loc_id"])
                cursor.execute(query, param_list)
                connection.commit()
            return {
                'message': 'Addded to activity log successfully'
            }, 200
        except Exception as e:
            return {'message': str(e)}, 500
