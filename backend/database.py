import mysql.connector
from mysql.connector import Error
import os
from dotenv import load_dotenv

class DatabaseConnection:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(DatabaseConnection, cls).__new__(cls)
            cls._instance._initialize()
        return cls._instance

    def _initialize(self):
        try:
            load_dotenv()
            self.conn = mysql.connector.connect(
                host=os.getenv('DB_HOST'),
                user=os.getenv('DB_USER'),
                password=os.getenv('DB_PASSWORD'),
                database=os.getenv('DB_NAME'),
                port=os.getenv('DB_PORT')
            )
            self.cursor = self.conn.cursor(prepared=True)
            print("Successfully connected to MySQL database")
        except (Exception, Error) as error:
            print("Error while connecting to MySQL:", error)
            raise error

    def execute_query(self, query, values=None):
        try:
            # Reconnect if connection is lost
            if not self.conn.is_connected():
                self._initialize()

            # Execute the query
            if values:
                self.cursor.execute(query, values)
            else:
                self.cursor.execute(query)

            # For SELECT queries, fetch results
            if query.strip().upper().startswith('SELECT'):
                result = self.cursor.fetchall()
                if result is None:
                    return []
                return result

            # For other queries (INSERT, UPDATE, DELETE)
            self.conn.commit()
            return []

        except Error as e:
            print(f"Error executing query: {e}")
            raise e