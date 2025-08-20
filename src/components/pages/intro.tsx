"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "motion/react"

/** Cloudinary */
// import { Cloudinary, CloudinaryVideo } from "@cloudinary/url-gen";
// import { quality } from "@cloudinary/url-gen/actions/delivery";
// import { format } from "@cloudinary/url-gen/actions/delivery";
// import { auto } from "@cloudinary/url-gen/qualifiers/format";
// import {AdvancedVideo} from '@cloudinary/react';

// const cld = new Cloudinary({
//   cloud: {
//     cloudName: 'dj0feyubj'
//   }
// });

// const bgVideo2 = cld.video("studio-landscape_mb7r4j").delivery(quality(85)).delivery(format(auto()));
/** End Cloudinary */

type IntroPageProps = {
  onEnter: () => void
}

export default function IntroPage({ onEnter }: IntroPageProps) {




  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
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

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black cursor-auto"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
    >
      {/* Video Background */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
        onLoadedData={handleVideoReady}
        onCanPlay={handleVideoReady}
        onCanPlayThrough={handleVideoReady}
        onPlaying={handleVideoReady}
      >
        <source src="/assets/webBG.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      {/* Cloudinary */}
      {/* <AdvancedVideo
        cldVid={bgVideo2}
        className="absolute inset-0 h-full w-full object-cover"
        controls={false}
        autoPlay
        muted
        loop
        playsInline
        onLoadStart={handleVideoReady}
        onCanPlay={handleVideoReady}
        onCanPlayThrough={handleVideoReady}
        onPlaying={handleVideoReady}
        innerRef={videoRef}
      /> */}

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content Overlay */}
      <AnimatePresence>
        {isVideoLoaded && (
          <motion.div
            className="relative z-10 flex flex-col items-center justify-between text-center h-1/2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <div className="flex flex-col items-center justify-start">
            {/* Logo */}
            <img
              src="/assets/logo-white.png"
              alt="Logo"
              width={50}
              height={50}
              className=""
            />
            {/* Title */}
            <motion.h1
              className="mt-10 font-serif text-6xl font-bold uppercase tracking-wider text-white/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
            >
              PIGGYBANX
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="mt-2 font-serif text-3xl uppercase tracking-wider text-white/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
            >
              Collector Society
            </motion.p>
            </div>

            {/* Enter Button */}
            <motion.button
              onClick={onEnter}
              className="cursor-pointer group relative overflow-hidden bg-transparent px-12 py-12 font-serif text-2xl font-light uppercase tracking-widest text-white transition-all duration-300 mt-10"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 transition-colors duration-300 group-hover:font-bold">Enter</span>
              <img src="/assets/arrow.png" alt="arrow" className="w-[95%]" />
              <motion.div
                className="absolute inset-0"
                initial={{ x: "-100%" }}
                whileHover={{ x: "0%" }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              />
            </motion.button>


          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading indicator while video loads */}
      {!isVideoLoaded && (
        <div className="relative z-10 flex flex-col items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          <p className="mt-4 font-serif text-sm uppercase tracking-wider text-white/70">Loading...</p>
        </div>
      )}
    </motion.div>
  )
}
