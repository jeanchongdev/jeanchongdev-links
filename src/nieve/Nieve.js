"use client"

import { useEffect, useRef } from "react"
import "./Nieve.css"

export default function Nieve() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    // Ajustar el tamaño del canvas al tamaño de la ventana
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Configuración de los copos de nieve
    const snowflakes = []
    const maxSnowflakes = window.innerWidth < 768 ? 50 : 100

    // Crear copos de nieve iniciales
    for (let i = 0; i < maxSnowflakes; i++) {
      snowflakes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 3 + 1,
        speed: Math.random() * 1 + 1, // Velocidad normal para todos los dispositivos
        opacity: Math.random() * 0.7 + 0.3,
        wobble: Math.random() * Math.PI * 2,
      })
    }

    // Función de animación
    function animate() {
      // Limpiar el canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Dibujar y actualizar cada copo
      snowflakes.forEach((flake) => {
        // Dibujar el copo
        ctx.beginPath()
        ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`
        ctx.fill()

        // Actualizar posición
        flake.y += flake.speed
        flake.wobble += 0.01
        flake.x += Math.sin(flake.wobble) * 0.5

        // Si el copo sale de la pantalla, reposicionarlo arriba
        if (flake.y > canvas.height) {
          flake.y = -10
          flake.x = Math.random() * canvas.width
        }

        // Si el copo sale por los lados, ajustarlo
        if (flake.x > canvas.width) flake.x = 0
        if (flake.x < 0) flake.x = canvas.width
      })

      // Continuar la animación
      requestAnimationFrame(animate)
    }

    // Iniciar la animación
    animate()

    // Limpieza al desmontar
    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return <canvas ref={canvasRef} className="snow-canvas" />
}
