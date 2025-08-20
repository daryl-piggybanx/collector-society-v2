"use client"

import { useState, useEffect, useRef } from "react"
import { Link } from "@tanstack/react-router"

// Public assets are referenced as URLs, not imported as modules
const bgVideo = "/assets/webBG.mp4"
const landingbg = "/assets/landingBG2.png"
import { navItems } from "@/lib/data"

export default function LandingPage() {
    // const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    // const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
    const [isVideoLoaded, setIsVideoLoaded] = useState(false)
    const [videoError, setVideoError] = useState(false)
    const videoRef = useRef<HTMLVideoElement>(null)


  // useEffect(() => {
  //   const handleMouseMove = (event: MouseEvent) => {
  //     setMousePosition({ x: event.clientX, y: event.clientY })
  //   }

  //   window.addEventListener("mousemove", handleMouseMove)

  //   return () => {
  //     window.removeEventListener("mousemove", handleMouseMove)
  //   }
  // }, [])

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
    <div className="h-screen w-screen cursor-auto relative flex flex-col items-center sm:items-start justify-center sm:justify-end overflow-hidden font-serif">
      {/* Background Video or Image, change to !videoError when video is chosen */}
      {videoError ? ( 
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
          onError={handleVideoError}
        >
          <source src={bgVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <img
          src={landingbg}
          alt="Landing Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/30" />

    {/* Hover Images */}
    {/* {navItems.map((item, index) => (
      <motion.div
        key={`image-${index}`}
        className="fixed z-0 pointer-events-none"
        style={{
          left: mousePosition.x - (index % 2 === 0 ? 350 :  -150), // Alternate left/right positioning
          top: mousePosition.y - 150,
          rotate: hoveredIndex === index ? (index % 2 === 0 ? 5 : 355) : 0, // Alternate rotation: even=5°, odd=355°
        }}
        animate={{
          opacity: hoveredIndex === index ? 1 : 0,
          scale: hoveredIndex === index ? 1 : 0.8,
          
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <Image
          src={item.image || "/placeholder.svg"}
          alt={`${item.name} background`}
          width={300}
          height={300}
          className="rounded-lg"
        />
      </motion.div>
    ))} */}


    <main className="absolute z-10 inset-0 py-8 sm:px-8 md:py-12 md:px-12 lg:py-20 lg:px-20 flex flex-col-reverse sm:flex-row">
      <nav className="flex items-center justify-center sm:items-end sm:justify-start">
        <ul className="flex flex-col gap-4 sm:gap-5 md:gap-4 text-center sm:text-left">
          {navItems.map((item, index) => (
            <li
              key={`nav-${index}`}
              // onMouseEnter={() => setHoveredIndex(index)}
              // onMouseLeave={() => setHoveredIndex(null)}
            >
              <Link
                to={item.link}
                className="text-wrap relative z-10 block text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light leading-tight text-white/70 transition-all duration-300 hover:text-white/90 hover:text-shadow-md hover:text-shadow-white/50 uppercase"
                style={{
                  mixBlendMode: "difference",
                }}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <nav className="flex-1 flex justify-center sm:justify-end pt-4 sm:pt-8">
        <ul className="flex flex-col gap-4 sm:gap-5 md:gap-4 text-center sm:text-right">
          <li>
            <a 
              href="https://discord.com/invite/piggybanx-1133508764474019870"
              className="font-light leading-tight text-white/70 transition-all duration-300 hover:text-white/90 hover:text-shadow-md hover:text-shadow-white/50 uppercase"
            >
              Gallery
            </a>
          </li>
          <li>
            <a 
              href="https://www.instagram.com/piggy_banx/"
              className="font-light leading-tight text-white/70 transition-all duration-300 hover:text-white/90 hover:text-shadow-md hover:text-shadow-white/50 uppercase"
            >
              Discord
            </a>
          </li>
        </ul>
      </nav>
    </main>

    {/* Loading indicator while video loads */}
    {/* {!isVideoLoaded && (
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        <p className="mt-4 font-serif text-sm uppercase tracking-wider text-white/70">Loading...</p>
      </div>
    )} */}

  </div>
  )
}