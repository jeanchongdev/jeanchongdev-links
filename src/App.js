"use client"

import { useCallback, useState, useRef, useEffect } from "react"
import Particles from "react-particles"
import { loadSlim } from "tsparticles-slim"
import { Github, Facebook, Codepen, Globe, Mail, ExternalLink, Volume2, VolumeX } from "lucide-react"
import "./App.css"
import Nieve from "./nieve/Nieve" // Importación correcta

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioLoaded, setAudioLoaded] = useState(false)
  const [audioError, setAudioError] = useState(false)
  const [audioStatus, setAudioStatus] = useState("loading") // "loading", "ready", "error"
  const audioRef = useRef(null)
  const audioContextRef = useRef(null)
  const analyserRef = useRef(null)
  const dataArrayRef = useRef(null)
  const animationFrameRef = useRef(null)
  const barsRef = useRef([])

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine)
  }, [])

  const particlesLoaded = useCallback(async (container) => {
    console.log(container)
  }, [])

  // Manejar la carga del audio
  useEffect(() => {
    if (audioRef.current) {
      const handleCanPlay = () => {
        console.log("Audio can play now")
        setAudioLoaded(true)
        setAudioStatus("ready")
      }

      const handleError = (e) => {
        console.error("Error loading audio:", e)
        setAudioError(true)
        setAudioStatus("error")
      }

      audioRef.current.addEventListener("canplaythrough", handleCanPlay)
      audioRef.current.addEventListener("error", handleError)

      // Intentar cargar el audio manualmente
      audioRef.current.load()

      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener("canplaythrough", handleCanPlay)
          audioRef.current.removeEventListener("error", handleError)
        }
      }
    }
  }, [])

  const setupAudioContext = () => {
    if (!audioContextRef.current && audioRef.current) {
      try {
        // Inicializar el contexto de audio
        const audioContext = new (window.AudioContext || window.webkitAudioContext)()
        const analyser = audioContext.createAnalyser()
        analyser.fftSize = 64 // Tamaño de la FFT (determina la cantidad de barras)

        const source = audioContext.createMediaElementSource(audioRef.current)
        source.connect(analyser)
        analyser.connect(audioContext.destination)

        const bufferLength = analyser.frequencyBinCount
        const dataArray = new Uint8Array(bufferLength)

        audioContextRef.current = audioContext
        analyserRef.current = analyser
        dataArrayRef.current = dataArray

        return true
      } catch (error) {
        console.error("Error setting up audio context:", error)
        return false
      }
    }
    return !!audioContextRef.current
  }

  const toggleAudio = async () => {
    console.log("Audio status:", audioStatus)

    if (audioStatus === "loading") {
      console.warn("Audio still loading, please wait...")
      return
    }

    if (audioStatus === "error") {
      console.error("Audio failed to load, check the file path")
      alert("No se pudo cargar el audio. Verifica que el archivo exista en la ruta correcta.")
      return
    }

    try {
      if (!audioContextRef.current) {
        const success = setupAudioContext()
        if (!success) {
          alert("No se pudo inicializar el reproductor de audio.")
          return
        }
      }

      if (isPlaying) {
        audioRef.current.pause()
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current)
        }
        setIsPlaying(false)
      } else {
        try {
          console.log("Attempting to play audio...")
          // Usar await para manejar la promesa que devuelve play()
          await audioRef.current.play()
          console.log("Audio playing successfully")
          animateVisualizer()
          setIsPlaying(true)
        } catch (error) {
          console.error("Error playing audio:", error)
          alert("Error al reproducir el audio: " + error.message)
          return
        }
      }
    } catch (error) {
      console.error("Error in toggleAudio:", error)
      alert("Error en el reproductor de audio: " + error.message)
    }
  }

  const animateVisualizer = () => {
    if (!analyserRef.current) return

    analyserRef.current.getByteFrequencyData(dataArrayRef.current)

    // Actualizar la altura de cada barra basada en los datos de frecuencia
    barsRef.current.forEach((bar, index) => {
      if (bar) {
        // Usar solo una parte de los datos para las barras visibles
        const value = dataArrayRef.current[index * 2]
        const height = value ? (value / 255) * 100 : 0 // Normalizar a porcentaje
        bar.style.height = `${3 + height * 0.7}px` // Altura mínima de 3px
      }
    })

    animationFrameRef.current = requestAnimationFrame(animateVisualizer)
  }

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  return (
    <div className="app">
      {/* Renderizar el componente Nieve */}
      <Nieve />

      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          background: {
            color: {
              value: "#000",
            },
          },
          fpsLimit: 120,
          particles: {
            color: {
              value: "#ffffff",
            },
            links: {
              color: "#ffffff",
              distance: 150,
              enable: true,
              opacity: 0.5,
              width: 1,
            },
            move: {
              direction: "none",
              enable: true,
              outModes: {
                default: "bounce",
              },
              random: false,
              speed: 1,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 80,
            },
            opacity: {
              value: 0.5,
            },
            shape: {
              type: "circle",
            },
            size: {
              value: { min: 1, max: 3 },
            },
          },
          detectRetina: true,
        }}
        className="particles-container"
      />

      <div className="content">
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-top">
              <div
                className={`audio-visualizer ${audioStatus === "error" ? "audio-error" : ""} ${
                  isPlaying ? "playing" : ""
                }`}
                onClick={toggleAudio}
                title={
                  audioStatus === "loading"
                    ? "Cargando audio..."
                    : audioStatus === "error"
                      ? "Error al cargar el audio"
                      : isPlaying
                        ? "Pausar música"
                        : "Reproducir música"
                }
              >
                {isPlaying ? (
                  <Volume2 size={16} className="audio-icon" />
                ) : (
                  <VolumeX size={16} className="audio-icon" />
                )}
                <div className="audio-bars">
                  {[...Array(5)].map((_, index) => (
                    <span key={index} className="audio-bar" ref={(el) => (barsRef.current[index] = el)}></span>
                  ))}
                </div>
              </div>
              <div className="avatar-container">
                <img src="https://i.postimg.cc/RhFSv272/Happy.gif" alt="Profile" className="avatar" />
              </div>
            </div>
            <h1 className="username">@jeanchongdev</h1>
            <div className="dev-logo">
              <span className="dev-bracket">{"<"}</span>
              <span className="dev-slash">/</span>
              <span className="dev-bracket">{">"}</span>
            </div>
            <p className="bio">Desarrollador web apasionado por crear experiencias digitales increíbles</p>

            <div className="social-icons">
              <a
                href="https://github.com/jeanchongdev"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
              >
                <Github size={20} />
              </a>
              <a
                href="https://codepen.io/jeanchongdev"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
              >
                <Codepen size={20} />
              </a>
              <a
                href="https://facebook.com/jeanchongdev"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
              >
                <Facebook size={20} />
              </a>
              <a
                href="mailto:proboconalies.circling647@aleeas.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          <div className="links-container">
            <a href="https://jeanchongdev.github.io/" className="link-item" target="_blank" rel="noopener noreferrer">
              <div className="link-icon">
                <Globe size={20} />
              </div>
              <span className="link-text">Portfolio Web ES</span>
              <ExternalLink size={16} className="external-icon" />
            </a>

            <a href="https://jeanchongdev.vercel.app/" className="link-item" target="_blank" rel="noopener noreferrer">
              <div className="link-icon">
                <Globe size={20} />
              </div>
              <span className="link-text">Portfolio Web EN</span>
              <ExternalLink size={16} className="external-icon" />
            </a>

            <a href="https://github.com/jeanchongdev" className="link-item" target="_blank" rel="noopener noreferrer">
              <div className="link-icon">
                <Github size={20} />
              </div>
              <span className="link-text">GitHub</span>
              <ExternalLink size={16} className="external-icon" />
            </a>

            <a href="https://codepen.io/jeanchongdev" className="link-item" target="_blank" rel="noopener noreferrer">
              <div className="link-icon">
                <Codepen size={20} />
              </div>
              <span className="link-text">CodePen</span>
              <ExternalLink size={16} className="external-icon" />
            </a>

            <a href="https://facebook.com/jeanchongdev" className="link-item" target="_blank" rel="noopener noreferrer">
              <div className="link-icon">
                <Facebook size={20} />
              </div>
              <span className="link-text">Facebook</span>
              <ExternalLink size={16} className="external-icon" />
            </a>

            <a
              href="https://www.roblox.com/users/3992979125"
              className="link-item"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="link-icon">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M5.164 0L.16 18.928 18.836 24l5.004-18.928L5.164 0zm11.095 17.097l-8.747-2.923 1.148-3.45 8.747 2.923-1.148 3.45z" />
                </svg>
              </div>
              <span className="link-text">Roblox</span>
              <ExternalLink size={16} className="external-icon" />
            </a>

            {/* Puedes agregar más enlaces aquí y se creará automáticamente un scroll */}
          </div>

          <div className="footer">
            <p>© 2025 jeanchongdev. Todos los derechos reservados.</p>
          </div>
        </div>
      </div>

      <div className="floating-sticker">
        <img src="https://i.postimg.cc/G2CW8YKs/oie-2021833-Pq-HZoa3k.gif" alt="Sticker" className="sticker-image" />
      </div>

      {/* Reproductor de audio oculto - Ruta corregida */}
      <audio ref={audioRef} loop preload="auto">
        <source src="/audio/as-the-world-caves-in-orchestral-version.mp3" type="audio/mp3" />
        Tu navegador no soporta el elemento de audio.
      </audio>
    </div>
  )
}
