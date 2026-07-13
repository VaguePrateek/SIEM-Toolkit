# Repository layer for loading and storing events in the SIEM database.
from storage.database import get_connection
from core.event import SecurityEvent
import json
import sqlite3
from storage.database import get_connection

def get_alert_pages(limit=50):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT COUNT(*)
        FROM events
        WHERE alerts_json IS NOT NULL
          AND alerts_json != '[]'
    """)

    total = cursor.fetchone()[0]

    conn.close()

    pages = (total + limit - 1) // limit

    return total, pages

def get_recent_events(limit=10):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT *
        FROM events
        ORDER BY id DESC
        LIMIT ?
    """, (limit,))

    rows = cursor.fetchall()
    conn.close()

    events = []

    for row in rows:

        events.append({
            "id": row[0],
            "timestamp": row[1],
            "event_type": row[2],
            "severity": row[3],
            "source_ip": row[4],
            "destination_ip": row[5],
            "username": row[6],
            "port": row[7],
            "protocol": row[8],
            "features": json.loads(row[9]) if row[9] else {},
            "alerts": json.loads(row[10]) if row[10] else [],
            "ml_prediction": json.loads(row[11]) if row[11] else {},
            "raw_log": row[12],
            "risk_score": row[13],
            "risk_level": row[14]
        })

    return events

def get_recent_alerts(limit=10):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT
            timestamp,
            alerts_json,
            risk_score,
            risk_level
        FROM events
        WHERE alerts_json IS NOT NULL
          AND alerts_json != '[]'
        ORDER BY id DESC
        LIMIT ?
    """, (limit,))

    rows = cursor.fetchall()
    conn.close()

    alerts = []

    for timestamp, alerts_json, risk_score, risk_level in rows:

        for alert in json.loads(alerts_json):

            alerts.append({

                "timestamp": timestamp,

                "rule": alert["rule"],

                "severity": alert["severity"],

                "source_ip": alert.get("source_ip"),

                "port": alert.get("port"),

                "description": alert["description"],

                "risk_score": risk_score,

                "risk_level": risk_level

            })

    return alerts[:limit]

def get_alerts(page=1, limit=50):
    conn = get_connection()
    cursor = conn.cursor()

    offset = (page - 1) * limit

    cursor.execute("""
        SELECT
            id,
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
        FROM events
        WHERE alerts_json IS NOT NULL
          AND alerts_json != '[]'
        ORDER BY id DESC
        LIMIT ? OFFSET ?
    """, (limit, offset))

    rows = cursor.fetchall()

    conn.close()

    alerts = []

    for row in rows:

        alerts.append({
            "id": row[0],
            "timestamp": row[1],
            "event_type": row[2],
            "severity": row[3],
            "source_ip": row[4],
            "destination_ip": row[5],
            "username": row[6],
            "port": row[7],
            "protocol": row[8],
            "features": json.loads(row[9]) if row[9] else {},
            "alerts": json.loads(row[10]) if row[10] else [],
            "ml_prediction": json.loads(row[11]) if row[11] else {},
            "raw_log": row[12],
            "risk": {
                "score": row[13],
                "level": row[14]
            }
        })

    return alerts

def get_total_events():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM events")
    total = cursor.fetchone()[0]

    conn.close()
    return total


def get_risk_distribution():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT risk_level, COUNT(*)
        FROM events
        GROUP BY risk_level
    """)

    data = {level: count for level, count in cursor.fetchall()}

    conn.close()
    return data

def get_total_pages(limit=50):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM events")

    total = cursor.fetchone()[0]

    conn.close()

    pages = (total + limit - 1) // limit

    return total, pages

def get_event_distribution():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT event_type, COUNT(*)
        FROM events
        GROUP BY event_type
    """)

    data = {event: count for event, count in cursor.fetchall()}

    conn.close()
    return data


def get_alert_count():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT COUNT(*)
        FROM events
        WHERE alerts_json IS NOT NULL
        AND alerts_json != '[]'
    """)

    count = cursor.fetchone()[0]

    conn.close()
    return count

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

def get_top_source_ips(limit=5):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT source_ip, COUNT(*)
        FROM events
        WHERE source_ip IS NOT NULL
        GROUP BY source_ip
        ORDER BY COUNT(*) DESC
        LIMIT ?
    """, (limit,))

    rows = cursor.fetchall()

    conn.close()

    return [
        {"ip": ip, "count": count}
        for ip, count in rows
    ]


def get_events(page=1, limit=50):
    conn = get_connection()
    cursor = conn.cursor()

    offset = (page - 1) * limit

    cursor.execute("""
        SELECT
            id,
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
        FROM events
        ORDER BY id DESC
        LIMIT ? OFFSET ?
    """, (limit, offset))

    rows = cursor.fetchall()
    conn.close()

    events = []

    for row in rows:

        event = {
            "id": row[0],
            "timestamp": row[1],
            "event_type": row[2],
            "severity": row[3],
            "source_ip": row[4],
            "destination_ip": row[5],
            "username": row[6],
            "port": row[7],
            "protocol": row[8],
            "features": json.loads(row[9]) if row[9] else {},
            "alerts": json.loads(row[10]) if row[10] else [],
            "ml_prediction": json.loads(row[11]) if row[11] else {},
            "raw_log": row[12],
            "risk": {
                "score": row[13],
                "level": row[14]
            }
        }

        events.append(event)

    return events

def get_top_ports(limit=5):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT port, COUNT(*)
        FROM events
        WHERE port IS NOT NULL
        GROUP BY port
        ORDER BY COUNT(*) DESC
        LIMIT ?
    """, (limit,))

    rows = cursor.fetchall()

    conn.close()

    return [
        {"port": port, "count": count}
        for port, count in rows
    ]


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