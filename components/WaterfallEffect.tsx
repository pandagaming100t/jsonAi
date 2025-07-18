
"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

export function WaterfallEffect() {
  const { theme } = useTheme()
  const [drops, setDrops] = useState<Array<{ id: number; left: number; duration: number; delay: number }>>([])

  useEffect(() => {
    const createDrops = () => {
      const newDrops = []
      for (let i = 0; i < 15; i++) {
        newDrops.push({
          id: i,
          left: Math.random() * 100,
          duration: 2 + Math.random() * 3,
          delay: Math.random() * 2
        })
      }
      setDrops(newDrops)
    }

    createDrops()
    const interval = setInterval(createDrops, 5000)
    return () => clearInterval(interval)
  }, [])

  const isDark = theme === 'dark'

  return (
    <div className="waterfall-container">
      {drops.map((drop) => (
        <div
          key={drop.id}
          className={`waterfall-drop ${isDark ? 'electric' : 'blue'}`}
          style={{
            left: `${drop.left}%`,
            animationDuration: `${drop.duration}s`,
            animationDelay: `${drop.delay}s`
          }}
        />
      ))}
    </div>
  )
}
