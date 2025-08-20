"use client"

import { useState, useEffect } from "react"

type SpacePigProps = {
  x: number
  y: number
  size: number
  velocity: number
  isFlapping: boolean
}

export default function SpacePig({ x, y, size, velocity, isFlapping }: SpacePigProps) {
  const [thrustFrame, setThrustFrame] = useState(0)
  const [showThrust, setShowThrust] = useState(false)

  // Thrust animation when flapping
  useEffect(() => {
    if (isFlapping) {
      setShowThrust(true)
      const timer = setTimeout(() => setShowThrust(false), 200)
      return () => clearTimeout(timer)
    }
  }, [isFlapping])

  // Thrust animation frames
  useEffect(() => {
    if (!showThrust) return

    const interval = setInterval(() => {
      setThrustFrame((prev) => (prev + 1) % 2)
    }, 100)

    return () => clearInterval(interval)
  }, [showThrust])

  // Calculate rotation based on velocity (space pig tilts less)
  const rotation = Math.max(-15, Math.min(15, velocity * 1.5))

  // Calculate bounce effect for thrust
  const bounceOffset = showThrust ? -3 : 0

  return (
    <div
      className="absolute transition-transform duration-100 ease-out"
      style={{
        left: x,
        top: y + bounceOffset,
        width: size,
        height: size,
        transform: `rotate(${rotation}deg)`,
        zIndex: 10,
      }}
    >
      {/* Space Pig sprite */}
      <img
        src={showThrust ? "/assets/space-pig_thrust.png" : "/assets/space-pig.png"}
        alt="Space Pig"
        className={`w-full h-full object-contain transition-transform duration-100 ${
          showThrust ? "scale-105" : "scale-100"
        }`}
        style={{
          imageRendering: "pixelated", // Maintain crisp pixel art
          filter: showThrust ? "brightness(1.2) drop-shadow(0 0 8px #fbbf24)" : "brightness(1)",
        }}
      />

      {/* Subtle glow effect for space theme */}
      <div
        className="absolute inset-0 bg-blue-400 opacity-10 rounded-full blur-md"
        style={{
          transform: "translateY(6px) scale(0.9)",
          zIndex: -1,
        }}
      />
    </div>
  )
}
