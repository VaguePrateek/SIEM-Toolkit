from core.event import SecurityEvent

RULE_SCORES = {
    "Brute Force Login": 35,
    "Port Scan": 25,
    "Sensitive Port Access": 10,
    "Malware Detected": 70
}

SEVERITY_BONUS = {
    "info": 0,
    "low": 5,
    "medium": 10,
    "high": 20,
    "critical": 30
}


def risk_level(score: int) -> str:
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

    # Score from triggered rules
    for alert in event.alerts:
        score += RULE_SCORES.get(alert.rule, 0)

    # Severity bonus
    score += SEVERITY_BONUS.get(event.severity, 0)

    # Sensitive port bonus
    if event.port in [21, 22, 23, 445, 3389]:
        score += 5

    # Malware bonus
    if event.event_type == "malware":
        score += 15

    score = min(score, 100)

    event.set_risk(score, risk_level(score))

    return event