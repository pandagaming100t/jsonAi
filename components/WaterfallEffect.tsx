
"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

export function WaterfallEffect() {
  const { theme } = useTheme()
  const [drops, setDrops] = useState<Array<{ id: number; left: number; duration: number; delay: number; size: number; opacity: number }>>([])
  const [beamParticles, setBeamParticles] = useState<Array<{ id: number; left: number; duration: number; delay: number; size: number }>>([])

  useEffect(() => {
    const createDrops = () => {
      const newDrops = []
      // Create regular drops
      for (let i = 0; i < 20; i++) {
        newDrops.push({
          id: i,
          left: Math.random() * 100,
          duration: 2 + Math.random() * 3,
          delay: Math.random() * 2,
          size: 2 + Math.random() * 3,
          opacity: 0.3 + Math.random() * 0.5
        })
      }
      setDrops(newDrops)
    }

    const createBeamParticles = () => {
      const newParticles = []
      // Create central beam particles
      for (let i = 0; i < 30; i++) {
        newParticles.push({
          id: i,
          left: 47 + Math.random() * 6, // Center the beam
          duration: 1.5 + Math.random() * 2,
          delay: Math.random() * 1.5,
          size: 1 + Math.random() * 4
        })
      }
      setBeamParticles(newParticles)
    }

    createDrops()
    createBeamParticles()
    
    const dropInterval = setInterval(createDrops, 4000)
    const beamInterval = setInterval(createBeamParticles, 2000)
    
    return () => {
      clearInterval(dropInterval)
      clearInterval(beamInterval)
    }
  }, [])

  const isDark = theme === 'dark'

  return (
    <div className="waterfall-container">
      {/* Central beam effect */}
      <div className={`waterfall-beam ${isDark ? 'beam-electric' : 'beam-blue'}`} />
      
      {/* Beam particles */}
      {beamParticles.map((particle) => (
        <div
          key={`beam-${particle.id}`}
          className={`waterfall-beam-particle ${isDark ? 'particle-electric' : 'particle-blue'}`}
          style={{
            left: `${particle.left}%`,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
            width: `${particle.size}px`,
            height: `${particle.size * 3}px`
          }}
        />
      ))}
      
      {/* Regular drops */}
      {drops.map((drop) => (
        <div
          key={`drop-${drop.id}`}
          className={`waterfall-drop ${isDark ? 'electric' : 'blue'}`}
          style={{
            left: `${drop.left}%`,
            animationDuration: `${drop.duration}s`,
            animationDelay: `${drop.delay}s`,
            width: `${drop.size}px`,
            height: `${drop.size * 6}px`,
            opacity: drop.opacity
          }}
        />
      ))}
    </div>
  )
}
