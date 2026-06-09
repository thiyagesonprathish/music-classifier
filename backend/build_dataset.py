import os
import csv
import numpy as np
from features import extract_features

# Mood folders
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
            print(f"  → {filename}")

            try:
                features = extract_features(filepath)
                row = list(features) + [mood]
                rows.append(row)
            except Exception as e:
                print(f"  ✗ Failed: {e}")

    # Write to CSV
    with open(OUTPUT_CSV, "w", newline="") as f:
        writer = csv.writer(f)

        # Header row
        header = [f"feature_{i}" for i in range(len(rows[0]) - 1)] + ["mood"]
        writer.writerow(header)

        # Data rows
        writer.writerows(rows)

    print(f"\n✓ Dataset saved to {OUTPUT_CSV}")
    print(f"✓ Total songs processed: {len(rows)}")

if __name__ == "__main__":
    build_dataset()