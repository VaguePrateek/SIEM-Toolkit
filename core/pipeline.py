# Import the parser, feature engineering, detection, and risk scoring stages.
from parser.normalizer import normal_log
from parser.feature_engineering import engineer_features
from detection.rules import run_rules
from detection.risk_score import calculate_risk


def process_log(raw_log):
    # Convert raw log text into a structured event object.
    event = normal_log(raw_log)

    # Add feature values used for detection and analytics.
    event = engineer_features(event)

    # Execute detection rules against the event.
    event = run_rules(event)

    # Calculate risk score and assign a risk level.
    event = calculate_risk(event)

    # Return the enriched and scored event.
    return event