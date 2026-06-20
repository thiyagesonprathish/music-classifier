import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import cross_val_score
import joblib

df = pd.read_csv("dataset.csv")

feature_cols = [c for c in df.columns if c.startswith("feature_")]
X = df[feature_cols].values

# --- Train Mood Model ---
y_mood = df["mood"].values
print("Evaluating mood model with cross validation...")
mood_cv = RandomForestClassifier(n_estimators=200, random_state=42)
mood_scores = cross_val_score(mood_cv, X, y_mood, cv=4)
print(f"✓ Mood accuracy: {mood_scores.mean() * 100:.1f}% (+/- {mood_scores.std() * 100:.1f}%)")

mood_model = RandomForestClassifier(n_estimators=200, random_state=42)
mood_model.fit(X, y_mood)
joblib.dump(mood_model, "mood_model.pkl")
print("✓ Mood model saved to mood_model.pkl")

# --- Train Genre Model ---
y_genre = df["genre"].values
print("\nEvaluating genre model with cross validation...")
genre_cv = RandomForestClassifier(n_estimators=200, random_state=42)
genre_scores = cross_val_score(genre_cv, X, y_genre, cv=4)
print(f"✓ Genre accuracy: {genre_scores.mean() * 100:.1f}% (+/- {genre_scores.std() * 100:.1f}%)")

genre_model = RandomForestClassifier(n_estimators=200, random_state=42)
genre_model.fit(X, y_genre)
joblib.dump(genre_model, "genre_model.pkl")
print("✓ Genre model saved to genre_model.pkl")

print(f"\n✓ Trained on {len(X)} songs")
print(f"✓ Feature count: {X.shape[1]}")