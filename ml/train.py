import os
import joblib

from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix
)

from ml.dataset import load_dataset


def train_model():

    print("Loading dataset...")

    X, y = load_dataset()

    print(f"Dataset size: {len(X)} samples")

    # Split dataset
    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=42,
        stratify=y
    )

    print(f"Training samples: {len(X_train)}")
    print(f"Testing samples : {len(X_test)}")

    # Build Random Forest
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        random_state=42,
        n_jobs=-1
    )

    print("\nTraining model...")
    model.fit(X_train, y_train)

    print("Training complete!")

    # Predictions
    predictions = model.predict(X_test)

    # Evaluation
    accuracy = accuracy_score(y_test, predictions)

    print("\n========== RESULTS ==========")
    print(f"Accuracy : {accuracy:.4f}")

    print("\nClassification Report")
    print(classification_report(y_test, predictions))

    print("\nConfusion Matrix")
    print(confusion_matrix(y_test, predictions))

    # Feature Importance
    print("\nFeature Importance")

    importance = sorted(
        zip(X.columns, model.feature_importances_),
        key=lambda x: x[1],
        reverse=True
    )

    for feature, score in importance:
        print(f"{feature:25} {score:.4f}")

    # Save model
    os.makedirs("ml/models", exist_ok=True)

    model_path = "ml/models/random_forest.pkl"

    joblib.dump(
    {
        "model": model,
        "feature_names": list(X.columns)
    },
    "ml/models/random_forest.pkl"
    )

    print(f"\nModel saved to: {model_path}")

    return model


if __name__ == "__main__":
    train_model()