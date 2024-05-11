from flask_restful import Resource
from flask import jsonify, Response
from .productiondbconfig import establish_connection

def jsonify_printer_rows(data) -> Response:
    """ Returns a jsonified list of printer rows from a list of tuples (database query result)."""
    out = []
    for tuple in data:
        formatted_tuple = {
            "id": tuple[0],
            "loc": tuple[1], #name
            "addr": tuple[2] + ', New Haven, CT'
        }
        out.append(formatted_tuple)
    return jsonify(out)

class PrinterLocationApiEndpoint(Resource):
    """
        Endpoint for getting printer locations for map dashboard.

        Parameters: 
            None
        
        Returns:
            Jsonified list of printer tuples formatted according to
            jsonify_printer_rows function above.
    """
    def get(self):
        try:
            with establish_connection() as connection:
                cursor = connection.cursor()
                query = """
                        SELECT l.id, l.name, l.addr
                        FROM location l
                        """
                cursor.execute(query)
                response = jsonify_printer_rows(cursor.fetchall())
                response.status_code = 200
                return response
        except Exception as e:
            return {'message': str(e)}, 500