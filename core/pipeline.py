from parser.normalizer import normal_log
from parser.feature_engineering import engineer_features
from detection.rules import run_rules
from detection.risk_score import calculate_risk


def process_log(raw_log):

    event = normal_log(raw_log)

    event = engineer_features(event)

    event = run_rules(event)

    event = calculate_risk(event)

    return event