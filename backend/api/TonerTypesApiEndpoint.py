from flask_restful import Resource, request
from .productiondbconfig import establish_connection
from flask import jsonify, Response

def jsonify_toner_types(data) -> Response:
    """ Returns a jsonified list of toner types from a list of tuples (database query result)."""
    out = []
    for tuple in data:
        formatted_tuple = {
            "type": tuple[0]
        }
        out.append(formatted_tuple)
    return jsonify(out)

class TonerTypesApiEndpoint(Resource):
    """
        Endpoint for getting list of toner types.

        Parameters: 
            None
        
        Returns:
            Jsonified list of toner types according to jsonify_toner_types
            function above.
    """
    def get(self):
        with establish_connection() as connection:
            cursor = connection.cursor()
            query = """SELECT DISTINCT type FROM toner ORDER BY type;"""
            cursor.execute(query)
            return jsonify_toner_types(cursor.fetchall())
            