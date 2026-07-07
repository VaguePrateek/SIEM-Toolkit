from datetime import datetime
from parser.extracter import *

Severity_map = {
    "failed_login": "medium",
    "successful_login": "low",
    "network_connection" : "low",
    "port_scan": "high",
    "malware": "critical",
    "unknown": "info"
}

def normal_log(raw_log:str):
    event = detect_event(raw_log)
    source_ip, destination_ip = extract_ip(raw_log)
    normalized = {
        "timestamp": datetime.now().isoformat(),
        "event_type": event,
        "severity": Severity_map.get(event, "info"),
        "source_ip": source_ip,
        "destination_ip": destination_ip,
        "username": extract_user(raw_log),
        "port": extract_port(raw_log),
        "protocol": extract_proto(raw_log),
        "raw_log": raw_log
    }

    return normalized