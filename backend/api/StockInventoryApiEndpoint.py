from flask_restful import Resource, request
from .productiondbconfig import establish_connection

class StockInventoryApiEndpoint(Resource):
    """
        Function for stocking a particular location with a toner type.

        Parameters: 
            loc_id: ID of the location being stocked
            toner_id: ID of the toner being added
            quantity: amount of toner being added
        
        Returns:
            None
    """
    def post(self):
        # Parse request data
        data = request.get_json()['body']
        colors = ["black", "cyan", "magenta", "yellow", "waste"]
        try:
            with establish_connection() as connection:
                cursor = connection.cursor()
                for i in range(len(colors)):
                    query = """
                            WITH t_id AS(
                            SELECT id 
                            FROM TONER
                            WHERE type = %s and color = %s
                            )
                            INSERT INTO toner_inventory (loc_id, toner_id, quantity)
                            SELECT %s, id, %s FROM t_id
                            ON CONFLICT (loc_id, toner_id) DO UPDATE SET quantity = %s;
                            """
                    param_list = (data["toner_counts"]['type'], i, data["loc_id"], 
                                data["toner_counts"][colors[i]], data["toner_counts"][colors[i]])
                    cursor.execute(query, param_list)
                
                query = """
                        UPDATE location
                        SET paper = %s, keyboards = %s, mice = %s
                        WHERE id = %s;
                        """
                cursor.execute(query, (data["paper_count"] * 10, data["equipment"]["keyboards"], data["equipment"]["mice"], data["loc_id"]))
                connection.commit()
            return {
                'message': 'Toner stocked successfully'
            }, 200
        except Exception as e:
            return {'message': str(e)}, 500
