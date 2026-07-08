from dataclasses import dataclass, field
from datetime import datetime
from typing import Dict, List, Any



@dataclass
class SecurityEvent:

    # Basic event information
    timestamp: str
    event_type: str
    severity: str

    # Network information
    source_ip: str | None = None
    destination_ip: str | None = None
    port: int | None = None
    protocol: str | None = None

    # User/process information
    username: str | None = None
    process: str | None = None

    # Original log
    raw_log: str | None = None

    # ML features
    features: Dict[str, Any] = field(default_factory=dict)

    # Detection results
    alerts: List[Dict] = field(default_factory=list)

    # Risk information
    risk_score: int = 0
    risk_level: str = "Informational"

    # ML prediction (future)
    ml_prediction: Dict[str, Any] = field(default_factory=dict)


    def add_alert(self, alert):
        self.alerts.append(alert)


    def set_risk(self, score, level):
        self.risk_score = score
        self.risk_level = level


    def add_features(self, features):
        self.features = features


    def to_dict(self):
        return {
            "timestamp": self.timestamp,
            "event_type": self.event_type,
            "severity": self.severity,

            "source_ip": self.source_ip,
            "destination_ip": self.destination_ip,
            "port": self.port,
            "protocol": self.protocol,

            "username": self.username,
            "process": self.process,

            "raw_log": self.raw_log,

            "features": self.features,

            "alerts": self.alerts,

            "risk": {
                "score": self.risk_score,
                "level": self.risk_level
            },

            "ml_prediction": self.ml_prediction
        }