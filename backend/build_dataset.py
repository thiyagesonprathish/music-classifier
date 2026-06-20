import os
import csv
import numpy as np
from features import extract_features
from genre_labels import GENRE_MAP

SONGS_DIR = "songs"
MOODS = ["happy", "sad", "energetic", "calm"]
OUTPUT_CSV = "dataset.csv"

def build_dataset():
    rows = []

    for mood in MOODS:
        folder = os.path.join(SONGS_DIR, mood)
        files = [f for f in os.listdir(folder) if f.endswith(".mp3")]

        print(f"\nProcessing {mood} ({len(files)} songs)...")

        for filename in files:
            filepath = os.path.join(folder, filename)
            genre = GENRE_MAP.get(filename, "unknown")
            print(f"  → {filename} [{genre}]")

            try:
                features = extract_features(filepath)
                row = list(features) + [mood, genre]
                rows.append(row)
            except Exception as e:
                print(f"  ✗ Failed: {e}")

    with open(OUTPUT_CSV, "w", newline="") as f:
        writer = csv.writer(f)
        header = [f"feature_{i}" for i in range(len(rows[0]) - 2)] + ["mood", "genre"]
        writer.writerow(header)
        writer.writerows(rows)

    print(f"\n✓ Dataset saved to {OUTPUT_CSV}")
    print(f"✓ Total songs processed: {len(rows)}")

    unknown_count = sum(1 for r in rows if r[-1] == "unknown")
    if unknown_count:
        print(f"⚠ Warning: {unknown_count} songs have 'unknown' genre — check filename matches in genre_labels.py")

if __name__ == "__main__":
    build_dataset()