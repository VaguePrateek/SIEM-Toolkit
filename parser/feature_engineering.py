from datetime import datetime
import ipaddress

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
    dt = datetime.fromisoformat(timestamp)
    return dt.hour

def extract_day_of_week(timestamp):
    dt = datetime.fromisoformat(timestamp)
    return dt.weekday()

def is_night(timestamp):
    hour = extract_hour(timestamp)
    return int(hour >= 18 or hour <= 6)

def severity_score(severity):
    return SEVERITY_SCORE.get(severity, 0)

def event_code(event):
    return EVENT_MAP.get(event, 0)

def protocol_code(protocol):
    if protocol is None:
        return 0
    return PROTOCOL_MAP.get(protocol.upper(), 0)

def is_private_ip(ip):
    if ip is None:
        return 0

    try:
        return int(ipaddress.ip_address(ip).is_private)
    except ValueError:
        return 0

def engineer_features(normalized_log):
   
    features = {
        "hour": extract_hour(normalized_log["timestamp"]),
        "day_of_week": extract_day_of_week(normalized_log["timestamp"]),
        "is_night": is_night(normalized_log["timestamp"]),

        "severity_score": severity_score(normalized_log["severity"]),
        "event_code": event_code(normalized_log["event_type"]),

        "port": normalized_log["port"] or 0,
        "protocol": protocol_code(normalized_log["protocol"]),

        "source_private": is_private_ip(normalized_log["source_ip"]),
        "destination_private": is_private_ip(normalized_log["destination_ip"])
    }

    return features