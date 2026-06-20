from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import joblib
import librosa
import tempfile
import os
from features import extract_features

app = FastAPI()

# Allow React frontend to talk to this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the trained model
mood_model = joblib.load("mood_model.pkl")
genre_model = joblib.load("genre_model.pkl")

# Mood metadata — colors and emojis for the frontend
MOOD_META = {
    "happy":     {"emoji": "😄", "color": "#FFD93D", "description": "Upbeat and joyful"},
    "sad":       {"emoji": "😢", "color": "#6EA8FF", "description": "Melancholic and emotional"},
    "energetic": {"emoji": "⚡", "color": "#FF6B6B", "description": "Intense and powerful"},
    "calm":      {"emoji": "😌", "color": "#6BFFB8", "description": "Peaceful and relaxing"},
}

@app.get("/")
def root():
    return {"status": "Music Classifier API is running"}

@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    # Save uploaded file to a temp location
    suffix = os.path.splitext(file.filename)[1]
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        contents = await file.read()
        tmp.write(contents)
        tmp_path = tmp.name

    try:
        # Extract features
        features = extract_features(tmp_path)
        features_2d = features.reshape(1, -1)

        # Predict mood
        mood = mood_model.predict(features_2d)[0]
        mood_proba = mood_model.predict_proba(features_2d)[0]
        confidence = round(float(np.max(mood_proba)) * 100, 1)

        #Predict Genre
        genre = genre_model.predict(features_2d)[0]
        genre_proba = genre_model.predict_proba(features_2d)[0]
        genre_confidence = round(float(np.max(genre_proba)) * 100, 1)

        # Get BPM and energy directly from features
        bpm = round(float(features[0]), 1)
        energy = round(float(features[27]) * 1000, 2)  # RMS energy scaled

        return {
            "mood": mood,
            "emoji": MOOD_META[mood]["emoji"],
            "color": MOOD_META[mood]["color"],
            "description": MOOD_META[mood]["description"],
            "confidence": confidence,
            "bpm": bpm,
            "energy": min(round(energy * 10, 1), 100),
            "genre": genre,
            "genre_confidence": genre_confidence,
        }

    except Exception as e:
        return {"error": str(e)}

    finally:
        os.unlink(tmp_path)