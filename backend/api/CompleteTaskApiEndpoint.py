from flask_restful import Resource, request
from .productiondbconfig import establish_connection

class CompleteTaskApiEndpoint(Resource):
    """
        Api endpoint for marking task as completed

        Parameters: 
            task_id: ID of report to complete
            time: completed time
        
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
                        UPDATE task
                        SET completed = %s
                        WHERE id = %s;
                        """
                param_list = (data["time"], data["task_id"])
                cursor.execute(query, param_list)
                connection.commit()
            return {
                'message': 'Clocked out successfully'
            }, 200
        except Exception as e:
            return {'message': str(e)}, 500

