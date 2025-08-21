"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "motion/react"
import { Button } from "~/components/ui/button"

export function Banner() {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [videoError, setVideoError] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Fallback timeout to show content even if video events don't fire
    const fallbackTimer = setTimeout(() => {
      setIsVideoLoaded(true)
    }, 3000) // 3 second fallback

    // Check if video is already loaded (e.g., from cache)
    const checkVideoReady = () => {
      const video = videoRef.current
      if (video && video.readyState >= 3) { // HAVE_FUTURE_DATA or higher
        setIsVideoLoaded(true)
        clearTimeout(fallbackTimer)
      }
    }

    // Check immediately
    checkVideoReady()

    // Also check periodically for the first few seconds
    const intervalTimer = setInterval(checkVideoReady, 100)
    setTimeout(() => clearInterval(intervalTimer), 2000)

    return () => {
      clearTimeout(fallbackTimer)
      clearInterval(intervalTimer)
    }
  }, [])

  const handleVideoReady = () => {
    setIsVideoLoaded(true)
  }

  const handleVideoError = () => {
    setVideoError(true)
    setIsVideoLoaded(true) // Still show the content with fallback image
  }

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Video or Image */}
      <div className="absolute inset-0 z-0">
        {!videoError ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover filter grayscale"
            onLoadedData={handleVideoReady}
            onCanPlay={handleVideoReady}
            onCanPlayThrough={handleVideoReady}
            onPlaying={handleVideoReady}
            onError={handleVideoError}
          >
            <source src="/assets/webBG.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <img
            src="/assets/astro-boy_banner.png"
            alt="Destiny Hero Background"
            className="w-full h-full object-cover filter grayscale"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-mono-heavy via-mono-heavy/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h1
          className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 text-mono-light uppercase"
          style={{ fontFamily: "system-ui, sans-serif" }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Into The
          <br />
          <span className="text-mono-mid">PiggyVerse</span>
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto leading-relaxed text-mono-mid"
          style={{ fontFamily: "system-ui, sans-serif" }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Join hundreds of players in PTA 6, PiggyBanx's action MMO. Create your Collector and collect unique art pieces to
          prove yourself in competitive multiplayer, challenging PvE missions, and more.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="lg"
              className="text-lg px-8 py-4 font-bold hover:opacity-90 transition-opacity bg-mono-light text-mono-heavy"
            >
              Play Free Now
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-4 font-semibold bg-transparent hover:opacity-80 transition-opacity border-mono-mid text-mono-mid"
            >
              Watch Trailer
            </Button>
          </motion.div>
        </motion.div>

      </div>
    </section>
  )
}
