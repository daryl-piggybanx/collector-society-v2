"use client"

import { useState, useEffect } from "react"

type ScoreDisplayProps = {
  score: number
}

export default function ScoreDisplay({ score }: ScoreDisplayProps) {
  const [isFlashing, setIsFlashing] = useState(false)

  // Flash effect when score increases
  useEffect(() => {
    if (score > 0) {
      setIsFlashing(true)
      const timer = setTimeout(() => setIsFlashing(false), 200)
      return () => clearTimeout(timer)
    }
  }, [score])

  return (
    <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10">
      <div
        className={`text-4xl md:text-5xl font-bold text-white drop-shadow-lg transition-all duration-200 ${
          isFlashing ? "scale-125 text-red-400" : "scale-100"
        }`}
        style={{
          textShadow: "2px 2px 4px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.5)",
        }}
      >
        {score}
      </div>
    </div>
  )
}
