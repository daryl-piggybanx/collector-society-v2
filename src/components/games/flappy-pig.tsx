"use client"

import { setWithExpiration, getWithExpiration, clearExpiredItems } from "@/utils/localStorage"

import { useState, useEffect, useCallback, useRef } from "react"
import { Card } from "@/components/ui/card"
import SpacePig from "@/components/sprites/space-pig"
import FuturisticBuilding from "@/components/games/futuristic-building"
import GameOverScreen from "@/components/games/game-over-screen"
import StartScreen from "@/components/games/start-screen"
import ScoreDisplay from "@/components/games/score-display"
import { useGamePhysics } from "@/hooks/use-game-physics"
import { useGameInput } from "@/hooks/use-game-input"

export type GameState = "menu" | "ready" | "playing" | "gameOver"

export type PipeData = {
  id: number
  x: number
  gapY: number
  passed: boolean
}

const GAME_WIDTH = 400
const GAME_HEIGHT = 600
const PIPE_WIDTH = 60
const PIPE_GAP = 150
const PIPE_SPEED = 4
const PIPE_SPAWN_INTERVAL = 1800
const PIG_SIZE = 50
const PIG_POSITION_X = GAME_WIDTH * 0.25 // Position pig at 1/4 of screen width

export default function FlappyPigGame() {
  const [gameState, setGameState] = useState<GameState>("menu")
  const [score, setScore] = useState(0)
  const [savedHighScore, setSavedHighScore] = useState(0)
  const [pipes, setPipes] = useState<PipeData[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const gameAreaRef = useRef<HTMLDivElement>(null)
  const lastPipeRef = useRef(0)

  // Load high score from localStorage and clean up expired items
  useEffect(() => {
    // Clean up any expired localStorage items on app start
    clearExpiredItems()
    
    const savedHighScore = getWithExpiration<number>("flappy-pig-high-score")
    console.log("savedHighScore", savedHighScore)
    if (savedHighScore !== null) {
      // ✅ Ensure it's actually a valid number to prevent NaN errors
      const numericHighScore = Number(savedHighScore)
      if (!isNaN(numericHighScore) && numericHighScore >= 0) {
        setSavedHighScore(numericHighScore)
      }
    }
  }, [])

  // ✅ Calculate current high score during rendering with additional safety
  const currentHighScore = Math.max(score || 0, savedHighScore || 0)
  
  // ✅ Update localStorage when we detect a new high score (proper useEffect)
  useEffect(() => {
    if (score > savedHighScore && score > 0 && !isNaN(score)) {
      setSavedHighScore(score)
      setWithExpiration("flappy-pig-high-score", score)
    }
  }, [score, savedHighScore])

  const { pigY, pigVelocity, flap, resetPig } = useGamePhysics(gameState === "playing")

  const startGame = useCallback(() => {
    setGameState("ready")
    setScore(0)
    setPipes([])
    resetPig()

    // Set initial delay for first pipe spawn (3 seconds from now)
    lastPipeRef.current = Date.now() + 2000 // Add 2 seconds to the normal interval

    // Start playing after a brief delay
    setTimeout(() => {
      setGameState("playing")
    }, 1000)
  }, [resetPig])

  const endGame = useCallback(() => {
    setGameState("gameOver")
  }, [])

  const restartGame = useCallback(() => {
    startGame()
  }, [startGame])

  // Handle input - disable when modal is open
  useGameInput(flap, startGame, restartGame, gameState, !isModalOpen)

  // Game loop for pipes and collision detection
  useEffect(() => {
    if (gameState !== "playing") return

    let animationId: number
    let lastTime = 0
    const targetFPS = 60
    const frameInterval = 1000 / targetFPS

    const gameLoop = (currentTime: number) => {
      if (currentTime - lastTime >= frameInterval) {
        // Move pipes with smoother interpolation
        setPipes((prevPipes) => {
          const newPipes = prevPipes
            .map((pipe) => ({
              ...pipe,
              x: pipe.x - PIPE_SPEED,
            }))
            .filter((pipe) => pipe.x > -PIPE_WIDTH)

          // Add new pipe with adjusted timing
          const now = Date.now()
          if (now - lastPipeRef.current > PIPE_SPAWN_INTERVAL) {
            const gapY = Math.random() * (GAME_HEIGHT - PIPE_GAP - 100) + 50
            newPipes.push({
              id: now,
              x: GAME_WIDTH,
              gapY,
              passed: false,
            })
            lastPipeRef.current = now
          }

          return newPipes
        })

        // Check for scoring - updated to use pig's new position
        setPipes((prevPipes) =>
          prevPipes.map((pipe) => {
            if (!pipe.passed && pipe.x + PIPE_WIDTH < PIG_POSITION_X) {
              setScore((prev) => prev + 1)
              return { ...pipe, passed: true }
            }
            return pipe
          }),
        )

        // Collision detection - reduced hitbox for more forgiving gameplay
        const pigX = PIG_POSITION_X - PIG_SIZE / 2 // Updated to use new position
        const pigHitboxSize = PIG_SIZE * 0.7 // Reduce hitbox to 70% of sprite size
        const pigHitboxOffset = (PIG_SIZE - pigHitboxSize) / 2

        const pigTop = pigY + pigHitboxOffset
        const pigBottom = pigY + PIG_SIZE - pigHitboxOffset
        const pigLeft = pigX + pigHitboxOffset
        const pigRight = pigX + PIG_SIZE - pigHitboxOffset

        // Check ground and ceiling collision
        if (pigBottom >= GAME_HEIGHT - 50 || pigTop <= 0) {
          endGame()
          return
        }

        // Check pipe collision - reduced hitbox for more forgiving gameplay
        for (const pipe of pipes) {
          const pipeLeft = pipe.x + 5 // Add small buffer to pipe edges
          const pipeRight = pipe.x + PIPE_WIDTH - 5 // Add small buffer to pipe edges
          const topPipeBottom = pipe.gapY - 5 // Add small buffer to pipe top
          const bottomPipeTop = pipe.gapY + PIPE_GAP + 5 // Add small buffer to pipe bottom

          if (pigRight > pipeLeft && pigLeft < pipeRight) {
            if (pigTop < topPipeBottom || pigBottom > bottomPipeTop) {
              endGame()
              return
            }
          }
        }

        lastTime = currentTime
      }

      animationId = requestAnimationFrame(gameLoop)
    }

    animationId = requestAnimationFrame(gameLoop)
    return () => cancelAnimationFrame(animationId)
  }, [gameState, pigY, pipes, endGame])

  return (
    <Card className="relative overflow-hidden bg-gradient-to-b from-black to-blue-800 border-4 border-red-600 shadow-2xl">
      <div
        ref={gameAreaRef}
        className="relative cursor-pointer select-none"
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
        onClick={gameState === "playing" ? flap : undefined}
        onTouchStart={
          gameState === "playing"
            ? (e) => {
                e.preventDefault()
                flap()
              }
            : undefined
        }
      >
        {/* Background elements - Space theme */}
        <div className="absolute inset-0 bg-gradient-to-b bg-gradient-to-b from-gray-950 via-gray-950 to-zinc-950" />

        {/* Stars */}
        <div className="absolute top-5 left-8 w-1 h-1 bg-white rounded-full animate-pulse" />
        <div className="absolute top-12 right-16 w-0.5 h-0.5 bg-red-200 rounded-full animate-pulse" />
        <div className="absolute top-24 left-24 w-1 h-1 bg-blue-200 rounded-full animate-pulse" />
        <div className="absolute top-32 right-32 w-0.5 h-0.5 bg-white rounded-full animate-pulse" />
        <div className="absolute top-40 left-40 w-1 h-1 bg-purple-200 rounded-full animate-pulse" />
        <div className="absolute top-48 right-8 w-0.5 h-0.5 bg-cyan-200 rounded-full animate-pulse" />

        {/* Distant planet/moon */}
        <div className="absolute top-16 right-12 w-16 h-16 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full opacity-60 shadow-lg" />

        {/* Ground - Moon surface */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-blue-800 to-blue-600 border-t-2 border-blue-900">
          {/* Moon crater texture */}
          <div className="absolute inset-0 opacity-40">
            <div className="absolute bottom-2 left-4 w-3 h-1 bg-blue-900 rounded-full" />
            <div className="absolute bottom-1 left-12 w-2 h-1 bg-blue-900 rounded-full" />
            <div className="absolute bottom-3 right-8 w-4 h-1 bg-blue-900 rounded-full" />
            <div className="absolute bottom-1 right-20 w-2 h-1 bg-blue-900 rounded-full" />
          </div>
        </div>

        {/* Pipes */}
        {pipes.map((pipe) => (
          <FuturisticBuilding
            key={pipe.id}
            x={pipe.x}
            gapY={pipe.gapY}
            width={PIPE_WIDTH}
            gapHeight={PIPE_GAP}
            gameHeight={GAME_HEIGHT}
          />
        ))}

        {/* Pig - updated position */}
        <SpacePig
          x={PIG_POSITION_X - PIG_SIZE / 2}
          y={pigY}
          size={PIG_SIZE}
          velocity={pigVelocity}
          isFlapping={gameState === "playing"}
        />

        {/* Score */}
        {(gameState === "playing" || gameState === "gameOver") && <ScoreDisplay score={score} />}

        {/* Game State Overlays */}
        {gameState === "menu" && <StartScreen onStart={startGame} highScore={currentHighScore} />}

        {gameState === "ready" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
            <div className="text-center text-white">
              <h2 className="text-2xl font-bold mb-2">Get Ready!</h2>
              <p className="text-sm">Tap or press Space to fire thrusters</p>
            </div>
          </div>
        )}

        {gameState === "gameOver" && <GameOverScreen score={score} highScore={currentHighScore} onRestart={restartGame} onModalStateChange={setIsModalOpen} />}
      </div>
    </Card>
  )
}
