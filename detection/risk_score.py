# Risk scoring rules for detected security events.
from core.event import SecurityEvent

# Base score values assigned to specific detection rule names.
RULE_SCORES = {
    "Brute Force Login": 35,
    "Port Scan": 25,
    "Sensitive Port Access": 10,
    "Malware Detected": 70
}

# Additional score based on event severity.
SEVERITY_BONUS = {
    "info": 0,
    "low": 5,
    "medium": 10,
    "high": 20,
    "critical": 30
}


def risk_level(score: int) -> str:
    # Convert a numeric score into a human-readable risk level.
    if score >= 80:
        return "Critical"
    elif score >= 60:
        return "High"
    elif score >= 40:
        return "Medium"
    elif score >= 20:
        return "Low"

    return "Informational"


def calculate_risk(event: SecurityEvent) -> SecurityEvent:
    """
    Calculate the overall risk score for a SecurityEvent.
    """

    score = 0

    # Add score contributions from each matched alert.
    for alert in event.alerts:
        score += RULE_SCORES.get(alert.rule, 0)

    # Add a severity-based bonus.
    score += SEVERITY_BONUS.get(event.severity, 0)

    # Add extra risk if the connection involves a sensitive port.
    if event.port in [21, 22, 23, 445, 3389]:
        score += 5

    # Add extra risk if the event appears to be malware-related.
    if event.event_type == "malware":
        score += 15

    # Cap score at 100 to maintain a bounded risk scale.
    score = min(score, 100)

    # Persist the computed score and derived level back to the event.
    event.set_risk(score, risk_level(score))

    return event