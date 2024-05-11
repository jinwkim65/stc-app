from flask_restful import Resource, request
from .productiondbconfig import establish_connection

class ReportPrinterApiEndpoint(Resource):
    """
        Api endpoint for reporting printer issues.

        Parameters: 
            printer_id: ID of user clocking in
            type: type of activity
            time: timestamp for activity log
            desc: description of report
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
                        INSERT INTO reports (type, printer_id, time, "desc")
                        VALUES (%s, %s, %s, %s)
                        """
                param_list = (data["type"], data["printer_id"], data["time"], data["desc"])
                cursor.execute(query, param_list)
                query = """
                        UPDATE printer
                        SET status = 2
                        WHERE id = %s
                        """
                cursor.execute(query, (data["printer_id"],))
                connection.commit()
            return {
                'message': 'Reported printer successfully'
            }, 200
        except Exception as e:
            return {'message': str(e)}, 500
