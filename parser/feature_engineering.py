# Feature engineering utilities for enriching events with numeric ML-ready values.
from datetime import datetime
import ipaddress
from core.event import SecurityEvent

SEVERITY_SCORE = {
    "info": 0,
    "low": 1,
    "medium": 2,
    "high": 3,
    "critical": 4
}

EVENT_MAP = {
    "unknown": 0,
    "successful_login": 1,
    "failed_login": 2,
    "network_connection": 3,
    "port_scan": 4,
    "malware": 5
}

PROTOCOL_MAP = {
    "TCP": 1,
    "UDP": 2,
    "ICMP": 3
}


def extract_hour(timestamp):
    # Return the hour of day from the ISO timestamp.
    dt = datetime.fromisoformat(timestamp)
    return dt.hour


def extract_day_of_week(timestamp):
    # Return the weekday number from the ISO timestamp.
    dt = datetime.fromisoformat(timestamp)
    return dt.weekday()


def is_night(timestamp):
    # Represent whether the event occurred during night hours.
    hour = extract_hour(timestamp)
    return int(hour >= 18 or hour <= 6)


def severity_score(severity):
    # Map textual severity to a numeric score.
    return SEVERITY_SCORE.get(severity, 0)


def event_code(event_type):
    # Map event types to numeric codes for modeling.
    return EVENT_MAP.get(event_type, 0)


def protocol_code(protocol):
    # Map transport protocol strings to numeric values.
    if protocol is None:
        return 0
    return PROTOCOL_MAP.get(protocol.upper(), 0)


def is_private_ip(ip):
    # Determine whether an IP address is private.
    if ip is None:
        return 0

    try:
        return int(ipaddress.ip_address(ip).is_private)
    except ValueError:
        return 0


def engineer_features(event: SecurityEvent) -> SecurityEvent:
    """
    Generate ML features from a SecurityEvent.
    """

    # Build a dictionary of numeric features to attach to the event.
    features = {
        "hour": extract_hour(event.timestamp),
        "day_of_week": extract_day_of_week(event.timestamp),
        "is_night": is_night(event.timestamp),

        "severity_score": severity_score(event.severity),
        "event_code": event_code(event.event_type),

        "port": event.port or 0,
        "protocol": protocol_code(event.protocol),

        "source_private": is_private_ip(event.source_ip),
        "destination_private": is_private_ip(event.destination_ip)
    }

    # Attach the computed features back onto the event object.
    event.add_features(features)

    return event