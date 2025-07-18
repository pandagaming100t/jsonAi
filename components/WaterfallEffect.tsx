"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

interface WaterfallParticle {
  id: number
  x: number
  y: number
  speed: number
  size: number
  opacity: number
  delay: number
}

interface RainDrop {
  id: number
  x: number
  y: number
  speed: number
  length: number
  opacity: number
}

interface SmokeParticle {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  drift: number
  speed: number
}

export function WaterfallEffect() {
  const { theme } = useTheme()
  const [waterfallParticles, setWaterfallParticles] = useState<WaterfallParticle[]>([])
  const [rainDrops, setRainDrops] = useState<RainDrop[]>([])
  const [smokeParticles, setSmokeParticles] = useState<SmokeParticle[]>([])

  useEffect(() => {
    // Create main waterfall stream particles
    const createWaterfallParticles = () => {
      const particles: WaterfallParticle[] = []
      for (let i = 0; i < 80; i++) {
        // Create widening effect - narrower at top, wider at bottom
        const progress = Math.random()
        const topWidth = 8 // Start narrow
        const bottomWidth = 60 // End wide
        const currentWidth = topWidth + (bottomWidth - topWidth) * progress
        const centerOffset = (Math.random() - 0.5) * currentWidth

        particles.push({
          id: i,
          x: 50 + centerOffset, // Center position with width variation
          y: Math.random() * 100,
          speed: 0.8 + Math.random() * 1.2,
          size: 1.5 + Math.random() * 2,
          opacity: 0.3 + Math.random() * 0.5,
          delay: Math.random() * 2
        })
      }
      setWaterfallParticles(particles)
    }

    // Create rain particles around the waterfall
    const createRainDrops = () => {
      const drops: RainDrop[] = []
      for (let i = 0; i < 1200; i++) { // Multiply by 10, so 120 * 10 = 1200
        drops.push({
          id: i,
          x: Math.random() * 100, // first of rain in whole hero section
          y: Math.random() * 100,
          speed: 1.5 + Math.random() * 2,
          length: 8 + Math.random() * 15,
          opacity: 0.2 + Math.random() * 0.4
        })
      }
      setRainDrops(drops)
    }

    // Create smoke/mist at the base
    const createSmokeParticles = () => {
      const smoke: SmokeParticle[] = []
      for (let i = 0; i < 625; i++) { // Multiply by 25, so 25 * 25 = 625
        smoke.push({
          id: i,
          x: 25 + Math.random() * 50, // Spread at base
          y: 70 + Math.random() * 25, // Bottom area
          size: 15 + Math.random() * 25,
          opacity: 0.1 + Math.random() * 0.3,
          drift: (Math.random() - 0.5) * 2,
          speed: 0.3 + Math.random() * 0.5
        })
      }
      setSmokeParticles(smoke)
    }

    createWaterfallParticles()
    createRainDrops()
    createSmokeParticles()

    const waterfallInterval = setInterval(createWaterfallParticles, 3000)
    const rainInterval = setInterval(createRainDrops, 2500)
    const smokeInterval = setInterval(createSmokeParticles, 4000)

    return () => {
      clearInterval(waterfallInterval)
      clearInterval(rainInterval)
      clearInterval(smokeInterval)
    }
  }, [])

  const isDark = theme === 'dark'

  return (
    <div className="waterfall-container">
      {/* Main waterfall stream - widening effect */}
      <div className={`waterfall-stream ${isDark ? 'stream-electric' : 'stream-blue'}`} />

      {/* Core bright center */}
      <div className={`waterfall-core-center ${isDark ? 'core-electric' : 'core-blue'}`} />

      {/* Waterfall particles with natural flow */}
      {waterfallParticles.map((particle) => (
        <div
          key={`waterfall-${particle.id}`}
          className={`waterfall-particle ${isDark ? 'particle-electric' : 'particle-blue'}`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size * 2}px`,
            opacity: particle.opacity,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${2 + particle.speed}s`
          }}
        />
      ))}

      {/* Rain drops */}
      {rainDrops.map((drop) => (
        <div
          key={`rain-${drop.id}`}
          className={`rain-drop ${isDark ? 'rain-electric' : 'rain-blue'}`}
          style={{
            left: `${drop.x}%`,
            top: `${drop.y}%`,
            height: `${drop.length}px`,
            opacity: drop.opacity,
            animationDuration: `${1.5 + drop.speed}s`,
            animationDelay: `${Math.random() * 2}s`
          }}
        />
      ))}

      {/* Smoke/mist particles at base */}
      {smokeParticles.map((smoke) => (
        <div
          key={`smoke-${smoke.id}`}
          className={`smoke-particle ${isDark ? 'smoke-electric' : 'smoke-blue'}`}
          style={{
            left: `${smoke.x}%`,
            top: `${smoke.y}%`,
            width: `${smoke.size}px`,
            height: `${smoke.size}px`,
            opacity: smoke.opacity,
            animationDuration: `${4 + smoke.speed}s`,
            animationDelay: `${Math.random() * 3}s`
          }}
        />
      ))}
    </div>
  )
}