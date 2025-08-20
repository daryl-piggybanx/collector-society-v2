"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Link } from "@tanstack/react-router"
import logo from '@/assets/logo-white.png'

import { useRouter } from "@tanstack/react-router"

import ScoreEntry from "./score-entry"

type GameOverScreenProps = {
  score: number
  highScore: number
  onRestart: () => void
  onModalStateChange?: (isModalOpen: boolean) => void
}

export default function GameOverScreen({ score, highScore, onRestart, onModalStateChange }: GameOverScreenProps) {
  const [canRestart, setCanRestart] = useState(false);
  const isNewHighScore = score === highScore && score > 0;
  const [showUsernameInput, setShowUsernameInput] = useState(false);

  const router = useRouter();

  useEffect(() => {
    // Wait 2 seconds before allowing restart
    const timer = setTimeout(() => {
      setCanRestart(true)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const handleAddToLeaderboard = () => {
    setShowUsernameInput(true);
    onModalStateChange?.(true);
  }

  const handleUsernameSubmit = (username: string) => {
    // ScoreEntry already submitted the score, just navigate to leaderboard
    setShowUsernameInput(false);
    onModalStateChange?.(false);
    router.history.push("/play/leaderboard")
  }

  const handleCancel = () => {
    setShowUsernameInput(false);
    onModalStateChange?.(false);
  }

  const handleViewLeaderboard = () => {
    router.history.push("/play/leaderboard")
  }

  const handleRestart = () => {
    if (canRestart) {
      onRestart()
    }
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/50 bg-opacity-60">
      <Card className="bg-black p-6 text-center space-y-4 shadow-2xl border-4 border-red-600">
        <div className="flex justify-center">
          <Link to="/" className="block">
            <img 
              src={logo} 
              alt="PiggyBanx Logo" 
              className="h-20 w-20 object-contain" 
            />
          </Link>
        </div>
        <h2 className="text-3xl font-bold text-red-600">Game Over!</h2>

        <div className="space-y-2">
          <div className="text-xl">
            <span className="text-white">Score: </span>
            <span className="font-bold text-blue-600">{score}</span>
          </div>

          <div className="text-xl">
            <span className="text-white">Best: </span>
            <span className="font-bold text-red-600">{highScore}</span>
          </div>

          {isNewHighScore && (
            <div className="text-sm text-red-600 font-bold animate-pulse">🎉 New High Score! 🎉</div>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex space-x-2">
            <Button
              onClick={handleRestart}
              disabled={!canRestart}
              className={`flex-1 font-bold px-4 py-2 rounded-full shadow-lg transform transition-all ${
                canRestart
                  ? "bg-red-500 hover:bg-red-600 text-white hover:scale-105"
                  : "bg-gray-400 text-white cursor-not-allowed"
              }`}
            >
              {canRestart ? "Play Again" : "Wait..."}
            </Button>

            <Button
              onClick={handleViewLeaderboard}
              className="flex-1 bg-gray-100 hover:bg-gray-50 text-red-600 font-bold px-4 py-2 rounded-full shadow-lg transform hover:scale-105 transition-all"
            >
              Leaderboard
            </Button>
          </div>

          {canRestart && (
            <Button
              onClick={handleAddToLeaderboard}
              className="w-full bg-red-700 hover:bg-red-600 text-white font-bold px-4 py-2 rounded-full shadow-lg transform hover:scale-105 transition-all"
            >
              Add to Leaderboard
            </Button>
          )}

          <div className="text-xs text-gray-500">
            {canRestart ? <p>Tap or press Space to fly again!</p> : <p>...</p>}
          </div>
        </div>
        {showUsernameInput && (
          <ScoreEntry
            score={highScore}
            onSubmit={handleUsernameSubmit}
            onCancel={handleCancel}
          />
        )}
      </Card>
    </div>
  )
}
