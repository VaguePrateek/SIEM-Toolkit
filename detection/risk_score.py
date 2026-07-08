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


def calculate_risk(normalized_log, alerts):
    score = 0

    # Rule-based score
    for alert in alerts:
        score += RULE_SCORES.get(alert["rule"], 0)

    # Severity score
    score += SEVERITY_BONUS.get(normalized_log["severity"], 0)

    # Sensitive ports
    if normalized_log["port"] in [21, 22, 23, 445, 3389]:
        score += 5

    # Malware bonus
    if normalized_log["event_type"] == "malware":
        score += 15

    return min(score, 100)


def risk_level(score):
    if score >= 80:
        return "Critical"
    elif score >= 60:
        return "High"
    elif score >= 40:
        return "Medium"
    elif score >= 20:
        return "Low"
    return "Informational"


def build_event(normalized_log, features, alerts):
    """
    Build one complete SIEM event.
    """

    score = calculate_risk(normalized_log, alerts)

    event = {
        "log": normalized_log,
        "features": features,
        "alerts": alerts,
        "risk": {
            "score": score,
            "level": risk_level(score)
        }
    }

    return event