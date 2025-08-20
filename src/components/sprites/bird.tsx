"use client"

import { useState, useEffect } from "react"

type BirdProps = {
  x: number
  y: number
  size: number
  velocity: number
  isFlapping: boolean
}

export default function Bird({ x, y, size, velocity, isFlapping }: BirdProps) {
  const [wingFrame, setWingFrame] = useState(0)

  // Wing animation
  useEffect(() => {
    if (!isFlapping) return

    const interval = setInterval(() => {
      setWingFrame((prev) => (prev + 1) % 3)
    }, 100)

    return () => clearInterval(interval)
  }, [isFlapping])

  // Calculate rotation based on velocity
  const rotation = Math.max(-30, Math.min(30, velocity * 3))

  return (
    <div
      className="absolute transition-transform duration-75 ease-out"
      style={{
        left: x,
        top: y,
        width: size,
        height: size,
        transform: `rotate(${rotation}deg)`,
      }}
    >
      {/* Bird body */}
      <div className="relative w-full h-full">
        {/* Main body */}
        <div className="absolute inset-0 bg-yellow-400 rounded-full border-2 border-yellow-600 shadow-lg" />

        {/* Wing */}
        <div
          className={`absolute top-1 right-1 w-4 h-3 bg-orange-400 rounded-full border border-orange-600 transition-transform duration-100 ${
            wingFrame === 1 ? "scale-110 -translate-y-1" : wingFrame === 2 ? "scale-90" : ""
          }`}
        />

        {/* Eye */}
        <div className="absolute top-2 right-2 w-3 h-3 bg-white rounded-full border border-gray-300">
          <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-black rounded-full" />
        </div>

        {/* Beak */}
        <div
          className="absolute top-3 -right-1 w-2 h-1 bg-orange-500 border border-orange-600"
          style={{ clipPath: "polygon(0 0, 100% 50%, 0 100%)" }}
        />
      </div>
    </div>
  )
}
