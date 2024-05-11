from psycopg2 import connect
from dotenv import load_dotenv
import os

DB = "stcdb"
HOST = "ep-bold-morning-a5urtgao.us-east-2.aws.neon.tech"
PORT = "5432"
USER = "fisher.marks"

def establish_connection():
    load_dotenv()
    PASSWORD = os.getenv("DB_PASSWORD")
    connection = connect(
        database=DB,
        host=HOST,
        port=PORT,
        user=USER,
        password=PASSWORD
    )
    return connection



