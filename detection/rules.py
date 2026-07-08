from collections import defaultdict
from datetime import datetime, timedelta

# Stores failed login timestamps for each source IP
failed_login_tracker = defaultdict(list)

# Stores alerts
alerts = []


def detect_failed_login(normalized_log):
    """
    Detect brute-force attacks.
    Rule: 5 failed logins from same IP within 60 seconds.
    """

    if normalized_log["event_type"] != "failed_login":
        return None

    source_ip = normalized_log["source_ip"]

    if source_ip is None:
        return None

    current_time = datetime.fromisoformat(normalized_log["timestamp"])

    failed_login_tracker[source_ip].append(current_time)

    # Keep only last 60 seconds
    failed_login_tracker[source_ip] = [
        t for t in failed_login_tracker[source_ip]
        if current_time - t <= timedelta(seconds=60)
    ]

    if len(failed_login_tracker[source_ip]) >= 5:
        return {
            "rule": "Brute Force Login",
            "severity": "High",
            "source_ip": source_ip,
            "description": "5 or more failed logins within 60 seconds"
        }

    return None


def detect_port_scan(normalized_log):

    if normalized_log["event_type"] == "port_scan":
        return {
            "rule": "Port Scan",
            "severity": "High",
            "source_ip": normalized_log["source_ip"],
            "description": "Possible reconnaissance activity"
        }

    return None


def detect_malware(normalized_log):

    if normalized_log["event_type"] == "malware":
        return {
            "rule": "Malware Detected",
            "severity": "Critical",
            "source_ip": normalized_log["source_ip"],
            "description": "Malware indicator found"
        }

    return None


def detect_high_risk_port(normalized_log):

    dangerous_ports = [21, 22, 23, 3389, 445]

    port = normalized_log["port"]

    if port in dangerous_ports:
        return {
            "rule": "Sensitive Port Access",
            "severity": "Medium",
            "port": port,
            "description": f"Connection on monitored port {port}"
        }

    return None


def run_rules(normalized_log):
    """
    Run every detection rule.
    """

    detections = []

    rules = [
        detect_failed_login,
        detect_port_scan,
        detect_malware,
        detect_high_risk_port
    ]

    for rule in rules:
        alert = rule(normalized_log)

        if alert:
            detections.append(alert)

    return detections