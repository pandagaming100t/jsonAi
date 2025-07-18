
"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

export function WaterfallEffect() {
  const { theme } = useTheme()
  const [particles, setParticles] = useState<Array<{ id: number; left: number; duration: number; delay: number; size: number; opacity: number }>>([])
  const [coreBeam, setCoreBeam] = useState<Array<{ id: number; duration: number; delay: number; intensity: number }>>([])

  useEffect(() => {
    const createParticles = () => {
      const newParticles = []
      // Create rocket exhaust particles
      for (let i = 0; i < 40; i++) {
        newParticles.push({
          id: i,
          left: 48 + Math.random() * 4, // Concentrated around center
          duration: 1.5 + Math.random() * 2,
          delay: Math.random() * 0.5,
          size: 2 + Math.random() * 6,
          opacity: 0.6 + Math.random() * 0.4
        })
      }
      setParticles(newParticles)
    }

    const createCoreBeam = () => {
      const newBeam = []
      // Create intense core beam segments
      for (let i = 0; i < 8; i++) {
        newBeam.push({
          id: i,
          duration: 2 + Math.random() * 1,
          delay: Math.random() * 0.3,
          intensity: 0.7 + Math.random() * 0.3
        })
      }
      setCoreBeam(newBeam)
    }

    createParticles()
    createCoreBeam()
    
    const particleInterval = setInterval(createParticles, 2000)
    const beamInterval = setInterval(createCoreBeam, 1500)
    
    return () => {
      clearInterval(particleInterval)
      clearInterval(beamInterval)
    }
  }, [])

  const isDark = theme === 'dark'

  return (
    <div className="rocket-container">
      {/* Main rocket core beam */}
      <div className={`rocket-core-beam ${isDark ? 'core-electric' : 'core-blue'}`} />
      
      {/* Core beam segments for intensity variation */}
      {coreBeam.map((beam) => (
        <div
          key={`core-${beam.id}`}
          className={`rocket-core-segment ${isDark ? 'segment-electric' : 'segment-blue'}`}
          style={{
            animationDuration: `${beam.duration}s`,
            animationDelay: `${beam.delay}s`,
            opacity: beam.intensity
          }}
        />
      ))}
      
      {/* Rocket exhaust particles */}
      {particles.map((particle) => (
        <div
          key={`particle-${particle.id}`}
          className={`rocket-particle ${isDark ? 'particle-electric' : 'particle-blue'}`}
          style={{
            left: `${particle.left}%`,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
            width: `${particle.size}px`,
            height: `${particle.size * 4}px`,
            opacity: particle.opacity
          }}
        />
      ))}
      
      {/* Side exhaust streams */}
      <div className={`rocket-side-stream rocket-left ${isDark ? 'stream-electric' : 'stream-blue'}`} />
      <div className={`rocket-side-stream rocket-right ${isDark ? 'stream-electric' : 'stream-blue'}`} />
    </div>
  )
}
