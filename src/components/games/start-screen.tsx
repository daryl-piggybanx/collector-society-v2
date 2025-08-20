"use client"
import { Link } from '@tanstack/react-router'
import logo from '@/assets/logo-white.png'

import { Button } from "@/components/ui/button"


type StartScreenProps = {
  onStart: () => void
  highScore: number
}

export default function StartScreen({ onStart, highScore }: StartScreenProps) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 text-white">
          <Link to="/" className="block">
            <img 
              src={logo} 
              alt="PiggyBanx Logo" 
              className="h-20 w-20 object-contain transition-opacity duration-200 backdrop-blur-sm rounded-full" 
            />
          </Link>
      <div className="text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold text-red-600 drop-shadow-lg">Into the PiggyVerse</h1>

        {highScore > 0 && (
          <div className="text-lg">
            <span className="text-gray-300">High Score: </span>
            <span className="text-red-400 font-bold">{highScore}</span>
          </div>
        )}

        <div className="space-y-4">
          <Button
            onClick={onStart}
            className="bg-red-500 hover:bg-red-600 text-black font-bold px-8 py-3 text-lg rounded-full shadow-lg transform hover:scale-105 transition-all"
          >
            Launch Mission
          </Button>

          <div className="text-sm text-gray-300 space-y-1">
            <p className="md:hidden">Tap anywhere to make the pig fly</p>
            <p className="hidden md:block">Tap or Press Space to make the pig fly</p>
          </div>
        </div>
      </div>
    </div>
  )
}
