from collections import defaultdict
from datetime import datetime, timedelta
from core.event import SecurityEvent

# Stores failed login timestamps for each source IP
failed_login_tracker = defaultdict(list)


def detect_failed_login(event: SecurityEvent):

    if event.event_type != "failed_login":
        return

    if event.source_ip is None:
        return

    current_time = datetime.fromisoformat(event.timestamp)

    failed_login_tracker[event.source_ip].append(current_time)

    failed_login_tracker[event.source_ip] = [
        t for t in failed_login_tracker[event.source_ip]
        if current_time - t <= timedelta(seconds=60)
    ]

    if len(failed_login_tracker[event.source_ip]) >= 5:

        event.add_alert(
            rule="Brute Force Login",
            severity="High",
            description="5 or more failed logins within 60 seconds",
            source_ip=event.source_ip
        )


def detect_port_scan(event: SecurityEvent):

    if event.event_type == "port_scan":

        event.add_alert(
            rule="Port Scan",
            severity="High",
            description="Possible reconnaissance activity",
            source_ip=event.source_ip
        )


def detect_malware(event: SecurityEvent):

    if event.event_type == "malware":

        event.add_alert(
            rule="Malware Detected",
            severity="Critical",
            description="Malware indicator found",
            source_ip=event.source_ip
        )


def detect_high_risk_port(event: SecurityEvent):

    dangerous_ports = [21, 22, 23, 445, 3389]

    if event.port in dangerous_ports:

        event.add_alert(
            rule="Sensitive Port Access",
            severity="Medium",
            description=f"Connection on monitored port {event.port}",
             source_ip=event.source_ip,
            port=event.port
        )


def run_rules(event: SecurityEvent) -> SecurityEvent:
    """
    Execute every detection rule.
    """

    rules = [
        detect_failed_login,
        detect_port_scan,
        detect_malware,
        detect_high_risk_port
    ]

    for rule in rules:
        rule(event)

    return event