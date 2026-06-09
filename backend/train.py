import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import cross_val_score
from sklearn.metrics import accuracy_score
import joblib

# Load dataset
df = pd.read_csv("dataset.csv")

# Features and label
X = df.drop("mood", axis=1).values
y = df["mood"].values

# Cross validation — more reliable accuracy measure for small datasets
print("Evaluating model with cross validation...")
model_cv = RandomForestClassifier(n_estimators=200, random_state=42)
cv_scores = cross_val_score(model_cv, X, y, cv=4)
print(f"✓ Cross-validation accuracy: {cv_scores.mean() * 100:.1f}% (+/- {cv_scores.std() * 100:.1f}%)")

# Train final model on ALL data
print("\nTraining final model on full dataset...")
mood_model = RandomForestClassifier(n_estimators=200, random_state=42)
mood_model.fit(X, y)

# Save the model
joblib.dump(mood_model, "mood_model.pkl")
print("✓ Mood model saved to mood_model.pkl")
print(f"✓ Trained on {len(X)} songs")
print(f"✓ Feature count: {X.shape[1]}")