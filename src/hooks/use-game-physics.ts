"use client"

import { useState, useEffect, useCallback, useRef } from "react"

const GRAVITY = 0.6
const FLAP_STRENGTH = -9
const MAX_VELOCITY = 12
const INITIAL_Y = 250

export function useGamePhysics(isActive: boolean) {
  const [pigY, setPigY] = useState(INITIAL_Y)
  const [pigVelocity, setPigVelocity] = useState(0)
  const animationFrameRef = useRef<number | null>(null)

  const flap = useCallback(() => {
    setPigVelocity(FLAP_STRENGTH)
  }, [])

  const resetPig = useCallback(() => {
    setPigY(INITIAL_Y)
    setPigVelocity(0)
  }, [])

  // Physics loop
  useEffect(() => {
    if (!isActive) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      return
    }

    const updatePhysics = () => {
      setPigVelocity((prevVelocity) => {
        const newVelocity = Math.min(MAX_VELOCITY, prevVelocity + GRAVITY)
        return newVelocity
      })

      setPigY((prevY) => {
        return prevY + pigVelocity
      })

      animationFrameRef.current = requestAnimationFrame(updatePhysics)
    }

    animationFrameRef.current = requestAnimationFrame(updatePhysics)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isActive, pigVelocity])

  return {
    pigY,
    pigVelocity,
    flap,
    resetPig,
  }
}
