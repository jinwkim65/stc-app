from flask_restful import Resource, request
from .productiondbconfig import establish_connection

class TonerPercentApiEndpoint(Resource):
    """
        Function for stocking a particular location with a toner type.

        Parameters: 
            printer_id: ID of the printer being updated
            status: printer status
            k_level: black %
            c_level: cyan %
            m_level: magenta %
            y_level: yellow %
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
                        UPDATE printer
                        SET k_level = %s, c_level = %s, m_level = %s, y_level = %s, status = %s
                        WHERE id = %s;
                        """
                cursor.execute(query, (data["k_level"], data["c_level"], data["m_level"], data["y_level"], data["status"], data["printer_id"]))
                connection.commit()
            return {
                'message': 'Toner stocked successfully'
            }, 200
        except Exception as e:
            return {'message': str(e)}, 500
