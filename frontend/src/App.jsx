import { useState, useRef } from "react"
import { Upload, Music, RotateCcw } from "lucide-react"

const API_URL = "https://music-classifier-8f2v.onrender.com"

const MOOD_THEMES = {
  happy:     { bg: "#FFD93D", glow: "rgba(255,217,61,0.15)",  text: "#1a1a00" },
  sad:       { bg: "#6EA8FF", glow: "rgba(110,168,255,0.15)", text: "#00001a" },
  energetic: { bg: "#FF6B6B", glow: "rgba(255,107,107,0.15)", text: "#1a0000" },
  calm:      { bg: "#6BFFB8", glow: "rgba(107,255,184,0.15)", text: "#001a0d" },
}

export default function App() {
  const [screen, setScreen] = useState("upload")
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const [fileName, setFileName] = useState("")
  const fileRef = useRef()

  const analyze = async (file) => {
    setFileName(file.name)
    setScreen("analyzing")
    setError(null)

    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch(`${API_URL}/analyze`, {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResult(data)
      setScreen("results")
    } catch (e) {
      setError(e.message)
      setScreen("upload")
    }
  }

  const handleFile = (file) => {
    if (!file) return
    if (!file.name.match(/\.(mp3|wav|ogg|flac)$/i)) {
      setError("Please upload an MP3, WAV, OGG, or FLAC file.")
      return
    }
    analyze(file)
  }

  const reset = () => {
    setScreen("upload")
    setResult(null)
    setError(null)
    setFileName("")
  }

  const theme = result ? MOOD_THEMES[result.mood] || MOOD_THEMES.happy : null

  return (
    <div style={{
      minHeight: "100vh",
      background: theme
        ? `radial-gradient(ellipse 80% 60% at 50% 0%, ${theme.glow}, transparent 60%), #0a0a0f`
        : "#0a0a0f",
      transition: "background 1s ease",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
    }}>

      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <div style={{
          fontSize: "11px",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: theme ? theme.bg : "#e8ff6e",
          marginBottom: "12px",
          transition: "color 1s ease",
        }}>
          Music Intelligence
        </div>
        <h1 style={{
          fontFamily: "Syne, sans-serif",
          fontSize: "clamp(28px, 5vw, 48px)",
          fontWeight: 800,
          color: "#fff",
          letterSpacing: "-0.03em",
          lineHeight: 1.1,
        }}>
          Mood & Genre<br />
          <span style={{ color: theme ? theme.bg : "#e8ff6e", transition: "color 1s ease" }}>
            Classifier
          </span>
        </h1>
      </div>

      {screen === "upload" && (
        <div style={{ width: "100%", maxWidth: "520px" }}>
          <div
            onClick={() => fileRef.current.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault()
              setDragOver(false)
              handleFile(e.dataTransfer.files[0])
            }}
            style={{
              border: `2px dashed ${dragOver ? "#e8ff6e" : "#2a2a3a"}`,
              borderRadius: "4px",
              padding: "64px 32px",
              textAlign: "center",
              cursor: "pointer",
              transition: "all 0.3s",
              background: dragOver ? "rgba(232,255,110,0.03)" : "rgba(255,255,255,0.02)",
            }}
          >
            <div style={{
              width: "64px", height: "64px",
              borderRadius: "50%",
              background: "rgba(232,255,110,0.1)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 24px",
            }}>
              <Upload size={28} color="#e8ff6e" />
            </div>
            <div style={{
              fontFamily: "Syne, sans-serif",
              fontSize: "20px",
              fontWeight: 700,
              color: "#fff",
              marginBottom: "8px",
            }}>
              Drop your track here
            </div>
            <div style={{ fontSize: "12px", color: "#6a6a80" }}>
              MP3, WAV, OGG, FLAC supported
            </div>
          </div>

          <input
            ref={fileRef}
            type="file"
            accept=".mp3,.wav,.ogg,.flac"
            style={{ display: "none" }}
            onChange={(e) => handleFile(e.target.files[0])}
          />

          {error && (
            <div style={{
              marginTop: "16px",
              padding: "12px 16px",
              background: "rgba(255,107,107,0.1)",
              border: "1px solid rgba(255,107,107,0.3)",
              color: "#ff6b6b",
              fontSize: "13px",
              borderRadius: "4px",
            }}>
              {error}
            </div>
          )}

          <div style={{
            marginTop: "24px",
            display: "flex",
            gap: "8px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}>
            {["😄 Happy", "😢 Sad", "⚡ Energetic", "😌 Calm"].map(tag => (
              <span key={tag} style={{
                padding: "4px 14px",
                border: "1px solid #1e1e2e",
                borderRadius: "2px",
                fontSize: "12px",
                color: "#6a6a80",
              }}>{tag}</span>
            ))}
          </div>
        </div>
      )}

      {screen === "analyzing" && (
        <div style={{ textAlign: "center" }}>
          <div style={{
            display: "flex",
            gap: "8px",
            justifyContent: "center",
            marginBottom: "32px",
          }}>
            {[0,1,2,3,4].map(i => (
              <div key={i} style={{
                width: "4px",
                borderRadius: "2px",
                background: "#e8ff6e",
                animation: `wave 1s ease-in-out ${i * 0.15}s infinite alternate`,
                height: "40px",
              }} />
            ))}
          </div>
          <div style={{
            fontFamily: "Syne, sans-serif",
            fontSize: "22px",
            fontWeight: 700,
            color: "#fff",
            marginBottom: "8px",
          }}>
            Analyzing...
          </div>
          <div style={{ fontSize: "12px", color: "#6a6a80" }}>
            {fileName}
          </div>
          <style>{`
            @keyframes wave {
              from { transform: scaleY(0.3); opacity: 0.4; }
              to   { transform: scaleY(1);   opacity: 1; }
            }
          `}</style>
        </div>
      )}

      {/* FOOTER */}
      <div style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        padding: "12px 24px",
        textAlign: "center",
        fontSize: "11px",
        letterSpacing: "0.15em",
        color: "#3a3a50",
        background: "transparent",
        pointerEvents: "none",
      }}>
        © 2026 THIYAGESON PRATHISH · MUSIC INTELLIGENCE
      </div>

    </div>
  )
}

      {screen === "results" && result && (
        <div style={{ width: "100%", maxWidth: "560px" }}>
          <div style={{
            background: theme.bg,
            borderRadius: "4px",
            padding: "40px",
            textAlign: "center",
            marginBottom: "12px",
            animation: "fadeUp 0.6s ease both",
          }}>
            <div style={{ fontSize: "56px", marginBottom: "12px" }}>{result.emoji}</div>
            <div style={{
              fontFamily: "Syne, sans-serif",
              fontSize: "clamp(32px, 8vw, 48px)",
              fontWeight: 800,
              color: theme.text,
              textTransform: "capitalize",
              letterSpacing: "-0.03em",
              lineHeight: 1,
              marginBottom: "8px",
            }}>
              {result.mood}
            </div>
            <div style={{ fontSize: "14px", color: theme.text, opacity: 0.6 }}>
              {result.description}
            </div>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "8px",
            marginBottom: "12px",
          }}>
            {[
              { label: "BPM", value: result.bpm },
              { label: "Energy", value: `${result.energy}%` },
              { label: "Confidence", value: `${result.confidence}%` },
            ].map(stat => (
              <div key={stat.label} style={{
                background: "#111118",
                border: "1px solid #1e1e2e",
                borderRadius: "4px",
                padding: "20px 16px",
                textAlign: "center",
                animation: "fadeUp 0.6s 0.1s ease both",
              }}>
                <div style={{
                  fontFamily: "Syne, sans-serif",
                  fontSize: "28px",
                  fontWeight: 700,
                  color: theme.bg,
                  lineHeight: 1,
                  marginBottom: "6px",
                }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: "11px", color: "#6a6a80", letterSpacing: "0.1em" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          <div style={{
            background: "#111118",
            border: "1px solid #1e1e2e",
            borderRadius: "4px",
            padding: "14px 20px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "16px",
            animation: "fadeUp 0.6s 0.2s ease both",
          }}>
            <Music size={16} color="#6a6a80" />
            <span style={{ fontSize: "13px", color: "#6a6a80", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {fileName}
            </span>
          </div>

          <button
            onClick={reset}
            style={{
              width: "100%",
              padding: "16px",
              background: "transparent",
              border: `1px solid ${theme.bg}`,
              borderRadius: "4px",
              color: theme.bg,
              fontFamily: "Syne, sans-serif",
              fontSize: "14px",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "all 0.2s",
              animation: "fadeUp 0.6s 0.3s ease both",
            }}
            onMouseEnter={e => e.currentTarget.style.background = theme.glow}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <RotateCcw size={16} />
            Analyze Another Track
          </button>

          <style>{`
            @keyframes fadeUp {
              from { opacity: 0; transform: translateY(20px); }
              to   { opacity: 1; transform: translateY(0); }
            }
          `}</style>
        </div>
    
      )}

    </div>
  )
}