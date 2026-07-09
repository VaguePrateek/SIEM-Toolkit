# Repository layer for loading and storing events in the SIEM database.
from storage.database import get_connection
from core.event import SecurityEvent
import json

def load_events():
    # Open a database connection.
    conn = get_connection()
    cursor = conn.cursor()

    # Retrieve all stored events from the events table.
    cursor.execute("SELECT * FROM events")
    rows = cursor.fetchall()
    conn.close()

    # Convert database rows into a list of dictionaries.
    events = []
    for row in rows:
        events.append({
            "timestamp": row[1],
            "event_type": row[2],
            "severity": row[3],
            "features": json.loads(row[9]) if row[9] else {},
            "alerts": json.loads(row[10]) if row[10] else [],
            "prediction": json.loads(row[11]) if row[11] else {}
        })
    return events


def save_event(event: SecurityEvent):
    # Persist a SecurityEvent into the database.
    conn = get_connection()
    cursor = conn.cursor()

    # Insert the event data into the events table.
    cursor.execute("""
INSERT INTO events (
    timestamp,
    event_type,
    severity,
    source_ip,
    destination_ip,
    username,
    port,
    protocol,
    features_json,
    alerts_json,
    ml_prediction_json,
    raw_log,
    risk_score,
    risk_level
)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
""", (
    (
    event.timestamp,
    event.event_type,
    event.severity,
    event.source_ip,
    event.destination_ip,
    event.username,
    event.port,
    event.protocol,
    json.dumps(event.features),
    json.dumps(event.to_dict()["alerts"]),
    json.dumps(event.ml_prediction),
    event.raw_log,
    event.risk_score,
    event.risk_level
)
))

    # Commit and close the database connection.
    conn.commit()
    conn.close()