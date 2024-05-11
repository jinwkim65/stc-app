from flask_restful import Resource
from flask import jsonify, Response
from .productiondbconfig import establish_connection

def jsonify_printer_rows(data) -> Response:
    """ Returns a jsonified list of inventory table rows from a list of tuples (database query result)."""
    out = []
    for tuple in data:
        formatted_tuple = {
            "id": tuple[0],
            "loc": tuple[1],
            "paper": tuple[2] / 10, #stored as smallint instead of dec
            "zone": tuple[3],
            "toner_type": tuple[4],
            "waste_toner": tuple[5],
            "black_toner": tuple[6],
            "cyan_toner": tuple[7],
            "magenta_toner": tuple[8],
            "yellow_toner": tuple[9],
            "keyboards": tuple[10],
            "mice": tuple[11],
            "addr": tuple[12]
        }
        out.append(formatted_tuple)
    return jsonify(out)

class InventoryTableApiEndpoint(Resource):
    """
        Endpoint for getting info for main inventory table.

        Parameters: 
            None
        
        Returns:
            Jsonified list of inventory table rows formatted according to
            jsonified_printer_rows function.
    """
    def get(self):
        try:
            with establish_connection() as connection:
                cursor = connection.cursor()
                query = """SELECT l.id,
                                l.name, 
                                paper, 
                                zone, 
                                (
                                    SELECT string_agg(DISTINCT t.type, ', ')
                                    FROM toner_inventory ti
                                    JOIN toner t ON t.id = ti.toner_id
                                    WHERE ti.loc_id = l.id AND ti.quantity > 0
                                ) as toner_type,
                                SUM(CASE WHEN t.color = 4 THEN ti.quantity ELSE 0 END) as waste_toner, 
                                SUM(CASE WHEN t.color = 0 THEN ti.quantity ELSE 0 END) as black,
                                SUM(CASE WHEN t.color = 1 THEN ti.quantity ELSE 0 END) as cyan,
                                SUM(CASE WHEN t.color = 2 THEN ti.quantity ELSE 0 END) as magenta,
                                SUM(CASE WHEN t.color = 3 THEN ti.quantity ELSE 0 END) as yellow, 
                                keyboards,
                                mice,
                                l.addr
                        FROM location l
                        LEFT JOIN printer p ON p.loc_id = l.id
                        LEFT JOIN toner_inventory ti ON l.id = ti.loc_id
                        LEFT JOIN toner t ON t.id = ti.toner_id
                        GROUP BY l.id, l.name, paper, zone, keyboards, mice, l.addr
                        ORDER BY zone, l.name
                        """
                cursor.execute(query)
                response = jsonify_printer_rows(cursor.fetchall())
                response.status_code = 200
                return response
        except Exception as e:
            return {'message': str(e)}, 500