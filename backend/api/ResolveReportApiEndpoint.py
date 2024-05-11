from flask_restful import Resource, request
from .productiondbconfig import establish_connection

class ResolveReportApiEndpoint(Resource):
    """
        Api endpoint for marking a report as resolved

        Parameters: 
            report_id: ID of report to resolve
        
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
                        UPDATE reports
                        SET handled = true
                        WHERE id = %s;
                        """
                param_list = (data["report_id"],)
                cursor.execute(query, param_list)
                connection.commit()
            return {
                'message': 'Clocked out successfully'
            }, 200
        except Exception as e:
            return {'message': str(e)}, 500

