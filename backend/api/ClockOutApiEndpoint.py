from flask_restful import Resource, request
from .productiondbconfig import establish_connection

class ClockOutApiEndpoint(Resource):
    """
        Api endpoint for clocking out of shift.

        Parameters: 
            shift_id: ID of shift to clock out of
            time: timestamp of clock-in
        
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
                        UPDATE shifts
                        SET clock_out = %s
                        WHERE id = %s;
                        """
                param_list = (data["time"], data["shift_id"])
                cursor.execute(query, param_list)
                connection.commit()
            return {
                'message': 'Clocked out successfully'
            }, 200
        except Exception as e:
            return {'message': str(e)}, 500
