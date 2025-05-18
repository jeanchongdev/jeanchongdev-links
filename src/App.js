"use client"

import { useCallback } from "react"
import Particles from "react-particles"
import { loadSlim } from "tsparticles-slim"
import { Github, Facebook, Codepen, Globe, Mail, ExternalLink } from "lucide-react"
import "./App.css"

export default function App() {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine)
  }, [])

  const particlesLoaded = useCallback(async (container) => {
    console.log(container)
  }, [])

  return (
    <div className="app">
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
            <div className="avatar-container">
              <img src="https://i.postimg.cc/RhFSv272/Happy.gif" alt="Profile" className="avatar" />
            </div>
            <h1 className="username">jeanchongdev</h1>
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
              <a href="mailto:proboconalies.circling647@aleeas.com" target="_blank" rel="noopener noreferrer" className="social-icon">
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

            {/* Puedes agregar más enlaces aquí y se creará automáticamente un scroll */}
          </div>

          <div className="footer">
            <p>© 2025 jeanchongdev. Todos los derechos reservados.</p>
          </div>
        </div>
      </div>

      <div className="floating-sticker">
        <img src="https://i.postimg.cc/zfzjtD2H/code.png" alt="Sticker" className="sticker-image" />
      </div>
    </div>
  )
}
