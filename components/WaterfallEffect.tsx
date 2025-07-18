
"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

export function WaterfallEffect() {
  const { theme } = useTheme()
  const [particles, setParticles] = useState<Array<{ id: number; left: number; duration: number; delay: number; size: number; opacity: number }>>([])
  const [floatingParticles, setFloatingParticles] = useState<Array<{ id: number; left: number; top: number; duration: number; delay: number; size: number }>>([])

  useEffect(() => {
    const createWaterfallParticles = () => {
      const newParticles = []
      // Create gentle waterfall particles
      for (let i = 0; i < 15; i++) {
        newParticles.push({
          id: i,
          left: 48 + Math.random() * 4, // Concentrated around center
          duration: 2 + Math.random() * 1.5,
          delay: Math.random() * 2,
          size: 3 + Math.random() * 4,
          opacity: 0.4 + Math.random() * 0.4
        })
      }
      setParticles(newParticles)
    }

    const createFloatingParticles = () => {
      const newFloating = []
      // Create ambient floating particles
      for (let i = 0; i < 8; i++) {
        newFloating.push({
          id: i,
          left: 30 + Math.random() * 40,
          top: 20 + Math.random() * 60,
          duration: 4 + Math.random() * 2,
          delay: Math.random() * 3,
          size: 2 + Math.random() * 3
        })
      }
      setFloatingParticles(newFloating)
    }

    createWaterfallParticles()
    createFloatingParticles()
    
    const waterfallInterval = setInterval(createWaterfallParticles, 3000)
    const floatingInterval = setInterval(createFloatingParticles, 5000)
    
    return () => {
      clearInterval(waterfallInterval)
      clearInterval(floatingInterval)
    }
  }, [])

  const isDark = theme === 'dark'

  return (
    <div className="waterfall-container">
      {/* Main beam */}
      <div className={`waterfall-beam ${isDark ? 'beam-electric' : 'beam-blue'}`} />
      
      {/* Core glow */}
      <div className={`waterfall-core ${isDark ? 'core-electric' : 'core-blue'}`} />
      
      {/* Waterfall particles */}
      {particles.map((particle) => (
        <div
          key={`waterfall-${particle.id}`}
          className={`waterfall-drop ${isDark ? 'drop-electric' : 'drop-blue'}`}
          style={{
            left: `${particle.left}%`,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
            width: `${particle.size}px`,
            height: `${particle.size * 3}px`,
            opacity: particle.opacity
          }}
        />
      ))}
      
      {/* Floating ambient particles */}
      {floatingParticles.map((particle) => (
        <div
          key={`floating-${particle.id}`}
          className={`floating-particle ${isDark ? 'particle-electric' : 'particle-blue'}`}
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
            width: `${particle.size}px`,
            height: `${particle.size}px`
          }}
        />
      ))}
    </div>
  )
}
