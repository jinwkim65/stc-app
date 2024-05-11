from flask_restful import Resource, request
from .productiondbconfig import establish_connection

class AssignTaskApiEndpoint(Resource):
    """
        Api endpoint for assigning tasks.

        Parameters: 
            employee_id: ID of employee receiving assignment
            type: type of task
            time: assigned time
            desc: description of task
            loc_id: location id of task
            report_id: report id
        Returns:
            None
    """
    def post(self):
        # Parse request data
        data = request.get_json()['body']
        map = {
            "Printer Offline": 0,
            "Low Toner": 1,
            "Low Paper": 2,
            "Other": 3
        }
        try:
            with establish_connection() as connection:
                cursor = connection.cursor()
                query = """
                        INSERT INTO task (employee_id, type, assigned, "desc", loc_id)
                        VALUES (%s, %s, %s, %s, %s)
                        """
                param_list = (data["employee_id"], map[data["type"]], data["time"], data["desc"], data["loc_id"])
                cursor.execute(query, param_list)
                query = """
                        UPDATE reports
                        SET handled = true
                        WHERE id = %s
                        """
                cursor.execute(query, (data["report_id"],))
                connection.commit()
            return {
                'message': 'Assigned task successfully'
            }, 200
        except Exception as e:
            return {'message': str(e)}, 500
