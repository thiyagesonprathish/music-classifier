import librosa
import numpy as np

def extract_features(file_path):
    # Load the audio file (only first 30 seconds)
    y, sr = librosa.load(file_path, duration=30)

    # Tempo (BPM)
    tempo, _ = librosa.beat.beat_track(y=y, sr=sr)

    # MFCCs — 13 values that capture the texture/timbre of the sound
    mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
    mfcc_mean = np.mean(mfccs, axis=1)

    # Spectral Centroid — brightness of the sound
    spectral_centroid = np.mean(librosa.feature.spectral_centroid(y=y, sr=sr))

    # Zero Crossing Rate — how rough/noisy the sound is
    zcr = np.mean(librosa.feature.zero_crossing_rate(y))

    # RMS Energy — loudness
    rms = np.mean(librosa.feature.rms(y=y))

    # Chroma Features — harmonic/musical content
    chroma = librosa.feature.chroma_stft(y=y, sr=sr)
    chroma_mean = np.mean(chroma, axis=1)

    # Combine everything into one flat array
    features = np.hstack([
        tempo,
        mfcc_mean,
        spectral_centroid,
        zcr,
        rms,
        chroma_mean
    ])

    return features

# --- Quick test ---
if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        print("Usage: python features.py path/to/song.mp3")
    else:
        path = sys.argv[1]
        result = extract_features(path)
        print(f"Extracted {len(result)} features successfully!")
        print(result)