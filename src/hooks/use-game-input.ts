"use client"

import { useEffect, useCallback, useRef } from "react"
import type { GameState } from "@/components/games/flappy-pig"

export function useGameInput(flap: () => void, startGame: () => void, restartGame: () => void, gameState: GameState, isEnabled: boolean = true) {
  const gameOverTimeRef = useRef<number>(0)

  // Track when game over state starts
  useEffect(() => {
    if (gameState === "gameOver") {
      gameOverTimeRef.current = Date.now()
    }
  }, [gameState])

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      // Don't handle keyboard events if not enabled
      if (!isEnabled) return

      switch (event.code) {
        case "Space":
        case "ArrowUp":
          event.preventDefault()
          if (gameState === "playing") {
            flap()
          } else if (gameState === "menu") {
            startGame()
          } else if (gameState === "gameOver") {
            // Check if 2 seconds have passed since game over
            const timeSinceGameOver = Date.now() - gameOverTimeRef.current
            if (timeSinceGameOver >= 2000) {
              restartGame()
            }
          }
          break
        case "Enter":
          event.preventDefault()
          if (gameState === "menu") {
            startGame()
          } else if (gameState === "gameOver") {
            // Check if 2 seconds have passed since game over
            const timeSinceGameOver = Date.now() - gameOverTimeRef.current
            if (timeSinceGameOver >= 2000) {
              restartGame()
            }
          }
          break
        case "KeyR":
          if (gameState === "gameOver") {
            // Check if 2 seconds have passed since game over
            const timeSinceGameOver = Date.now() - gameOverTimeRef.current
            if (timeSinceGameOver >= 2000) {
              restartGame()
            }
          }
          break
        case "Escape":
          // Could implement pause functionality here
          break
      }
    },
    [flap, startGame, restartGame, gameState, isEnabled],
  )

  useEffect(() => {
    // Only add event listener if enabled
    if (!isEnabled) return

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [handleKeyPress, isEnabled])

  // Prevent default touch behaviors that might interfere with the game
  useEffect(() => {
    // Only add touch event listeners if enabled
    if (!isEnabled) return

    const preventDefaultTouch = (e: TouchEvent) => {
      if (gameState === "playing") {
        e.preventDefault()
      }
    }

    document.addEventListener("touchstart", preventDefaultTouch, { passive: false })
    document.addEventListener("touchmove", preventDefaultTouch, { passive: false })

    return () => {
      document.removeEventListener("touchstart", preventDefaultTouch)
      document.removeEventListener("touchmove", preventDefaultTouch)
    }
  }, [gameState, isEnabled])
}
