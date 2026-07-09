from storage.database import get_connection


def create_tables():

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS events (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            timestamp TEXT,
            event_type TEXT,
            severity TEXT,

            source_ip TEXT,
            destination_ip TEXT,

            username TEXT,

            port INTEGER,
            protocol TEXT,
                   
            features_json TEXT,
            alerts_json TEXT,
            ml_prediction_json TEXT,

            raw_log TEXT,

            risk_score INTEGER,
            risk_level TEXT
        )
    """)

    conn.commit()
    conn.close()