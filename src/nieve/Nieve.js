"use client"

import { useEffect } from "react"
import "./Nieve.css"

export default function Nieve() {
  useEffect(() => {
    function createSnowflake() {
      const snowflake = document.createElement("div")
      snowflake.className = "snowflake"
      snowflake.style.left = `${Math.random() * window.innerWidth}px`
      snowflake.style.top = `-5px`

      // Variación en la opacidad para un efecto más natural
      snowflake.style.opacity = Math.random() * 0.7 + 0.3

      // Variación en el tamaño para que se vean más naturales
      const size = Math.random() * 4 + 2 // Entre 2px y 6px
      snowflake.style.width = `${size}px`
      snowflake.style.height = `${size}px`

      document.body.appendChild(snowflake)

      let posY = -5
      const speed = Math.random() * 2 + 1
      let wobble = 0

      function fall() {
        posY += speed
        wobble += 0.02
        snowflake.style.top = posY + "px"
        snowflake.style.left = Number.parseFloat(snowflake.style.left) + Math.sin(wobble) * 2 + "px"

        if (posY < window.innerHeight) {
          requestAnimationFrame(fall)
        } else {
          snowflake.remove()
        }
      }

      fall()
    }

    const interval = setInterval(createSnowflake, 100)

    return () => clearInterval(interval)
  }, [])

  return null
}
