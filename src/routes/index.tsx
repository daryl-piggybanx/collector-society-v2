"use client"

import { useState } from "react"

import { createFileRoute } from '@tanstack/react-router'

import { AnimatePresence } from "motion/react"
import IntroPage from "~/components/pages/intro"
import LandingPage from "~/components/pages/landing"
import { Menu, SquareX } from "lucide-react"


export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const [showIntro, setShowIntro] = useState(true)

  const handleEnter = () => {
    setShowIntro(false)
  }

  const toggleView = () => {
    setShowIntro(!showIntro)
  }

  return (
    <div className="bg-[#111111] text-white">
      <header className="fixed top-2 right-10 p-8 z-[100] cursor-auto">
        <button onClick={toggleView} className="pointer-events-auto cursor-pointer hover:opacity-80 transition-opacity duration-300">
        {showIntro ? (<Menu className="w-8 h-8" />) : (<SquareX className="w-8 h-8" />)}
        </button>
      </header>
      <AnimatePresence mode="wait">
        {showIntro ? (
          <IntroPage key="intro" onEnter={handleEnter} />
        ) : (
          <LandingPage key="landing" />
          // <ThreeCanvasWrapper key="three-scene" />
        )}
      </AnimatePresence>
      <footer className="absolute bottom-0 left-0 p-8 text-sm text-white/50 z-[100]">
        <p>PIGGYBANK ©2025</p>
      </footer>
    </div>
  )
}
