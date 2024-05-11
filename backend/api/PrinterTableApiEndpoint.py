from flask_restful import Resource, request
from flask import jsonify, Response
from .productiondbconfig import establish_connection

def jsonify_printer_rows(data) -> Response:
    """ Returns a jsonified list of inventory table rows from a list of tuples (database query result)."""
    out = []
    for tuple in data:
        formatted_tuple = {
            "id": tuple[0],
            "loc": tuple[1],
            "status": tuple[2],
            "zone": tuple[3],
            "toner_percentage":{
                "black": tuple[4],
                "cyan": tuple[5],
                "magenta": tuple[6],
                "yellow": tuple[7]
            },
            "model": tuple[8],
            "kyocera_serial": tuple[9]
        }
        out.append(formatted_tuple)
    return jsonify(out)

class PrinterTableApiEndpoint(Resource):
    def get(self):
        try:
            with establish_connection() as connection:
                cursor = connection.cursor()
                query = """SELECT p.id,
                                p.name, 
                                status,  
                                zone,
                                k_level, 
                                c_level, 
                                m_level, 
                                y_level, 
                                model, 
                                kyo_num
                        FROM printer p
                        LEFT JOIN location l on p.loc_id = l.id
                        GROUP BY p.id, p.name, status, zone, model, kyo_num
                        ORDER BY zone, p.name
                        """
                cursor.execute(query)
                response = jsonify_printer_rows(cursor.fetchall())
                response.status_code = 200
                return response
        except Exception as e:
            return {'message': str(e)}, 500