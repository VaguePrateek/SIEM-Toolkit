import joblib
import pandas as pd


# Load model only once
saved = joblib.load("ml/models/random_forest.pkl")

model = saved["model"]
feature_names = saved["feature_names"]


def predict_event(event):
    """
    Predict whether an event is malicious.
    Updates the SecurityEvent object.
    """

    # Build feature vector
    data = {}

    for feature in feature_names:
        data[feature] = event.features.get(feature, 0)

    X = pd.DataFrame([data])

    # Prediction
    prediction = int(model.predict(X)[0])

    # Confidence
    probabilities = model.predict_proba(X)[0]

    confidence = float(max(probabilities))

    event.ml_prediction = {
        "prediction": prediction,
        "confidence": round(confidence, 4),
        "model": "RandomForest"
    }

    return event