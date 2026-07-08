from datetime import datetime
from parser.extracter import (
    detect_event,
    extract_ip,
    extract_user,
    extract_port,
    extract_proto
)
from core.event import SecurityEvent


SEVERITY_MAP = {
    "failed_login": "medium",
    "successful_login": "low",
    "network_connection": "low",
    "port_scan": "high",
    "malware": "critical",
    "unknown": "info"
}


def normal_log(raw_log: str) -> SecurityEvent:

    # Extract information from raw log
    event_type = detect_event(raw_log)

    source_ip, destination_ip = extract_ip(raw_log)

    username = extract_user(raw_log)

    port = extract_port(raw_log)

    protocol = extract_proto(raw_log)

    severity = SEVERITY_MAP.get(event_type, "info")

    timestamp = datetime.now().isoformat()

    # Create SecurityEvent object
    event = SecurityEvent(
        timestamp=timestamp,
        event_type=event_type,
        severity=severity,
        source_ip=source_ip,
        destination_ip=destination_ip,
        username=username,
        port=port,
        protocol=protocol,
        raw_log=raw_log
    )

    return event