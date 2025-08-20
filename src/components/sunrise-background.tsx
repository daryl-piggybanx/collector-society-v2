"use client"

import { useEffect, useState } from "react"
import { motion, useScroll, useTransform, useMotionValueEvent } from "motion/react"


export default function SunriseBackground() {
    const { scrollYProgress } = useScroll()
  
    // Overlay opacity (fades from 1 to 0)
    const overlayOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1])
  
    // Logo position (moves from 85.89% to center)
    const logoY = useTransform(scrollYProgress, [0, 0.6], [85.89, 0])
    // Logo gradient colors - SVG gradients need string values, so using state with useMotionValueEvent
    const [topColor, setTopColor] = useState("rgba(0,0,0,1)")
    const [bottomColor, setBottomColor] = useState("rgba(0,0,0,1)")
    
    // Title color - transitions from black to white matching logo timing
    const [titleColor, setTitleColor] = useState("#000000")
    
    // Geometric lines color - transitions from black to white
    const [linesColor, setLinesColor] = useState("#FFFFFF")
    // Geometric lines opacity - fade out later to give hero more static time
    const linesOpacity = useTransform(scrollYProgress, [0.4, 0.5], [1, 0])

    // Use useMotionValueEvent for motion value changes (immediate, no delay)
    useMotionValueEvent(scrollYProgress, "change", (latest) => {
      // Logo transitions to lighter colors as background gets darker (0-0.2 scroll range)
      if (latest > 0.1) {
        // Transition from dark to light - matches overlay darkening (0-20% scroll)
        setTopColor(latest > 0.2 ? "#FFFFFF" : latest > 0.15 ? "#F0F0F0" : "#e0dede")
        setBottomColor(latest > 0.4 ? "#FFFFFF" : latest > 0.3 ? "#e0dede" : "#212121")
        // Title color transitions matching logo timing
        setTitleColor(latest > 0.2 ? "#FFFFFF" : latest > 0.15 ? "#F0F0F0" : "#e0dede")
      } else {
        // Initial state - dark colors when background is light
        setTopColor("#212121")
        setBottomColor("rgba(0,0,0,1)")
        setLinesColor("rgba(250,250,250,0.9)")
        setTitleColor("#000000")
      }
    })
  
    // Line positions using useTransform for smooth animation
    const initialPositions = [
      35550, 32691.1, 30044, 27593, 25323.6, 23222.2, 21276.5, 19474.9, 17806.8, 16262.3, 14832.1, 13507.9, 12281.8,
      11146.5, 10095.3, 9121.96, 8220.73, 7386.25, 6613.59, 5898.16, 5235.73, 4622.36, 4054.43, 3528.57, 3041.66,
      2590.82, 2173.38, 1786.85, 1428.96, 1097.58, 790.74, 506.64, 243.58, 0,
    ]
  
    const finalPositions = [
      7.7499, 7.1267, 6.5496, 6.0153, 5.5206, 5.0625, 4.6383, 4.2456, 3.8819, 3.5452, 3.2334, 2.9447, 2.6774, 2.4299,
      2.2008, 1.9886, 1.7921, 1.6102, 1.4418, 1.2858, 1.1414, 1.0077, 0.8839, 0.7692, 0.6631, 0.5648, 0.4738, 0.3895,
      0.3115, 0.2393, 0.1724, 0.1104, 0.0531, 0,
    ]
  
    // Create motion values for each line position with immediate response
    const linePositions = initialPositions.map((initial, index) => {
      const final = finalPositions[index]
      return useTransform(scrollYProgress, [0, 0.6], [initial, final])
    })

    return (
      <div className="relative" style={{ height: "100vh" }}>
        {/* Hero wrap section using motion components */}
        <section className="fixed inset-0 w-full h-screen overflow-hidden z-0">
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-black from-40% via-[#171718] via-60% to-[#2d2d30] to-100%"
            style={{
              opacity: overlayOpacity,
            }}
          />

          {/* Hero text wrap */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
            {/* Title */}
            <div className="flex justify-start w-full margin-auto mb-8 pl-8 md:pl-20 lg:pl-40">
              <motion.h1 
                initial={{ opacity: 0}}
                whileInView={{ opacity: 1}}
                exit={{ opacity: 0}}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="text-3xl md:text-5xl lg:text-6xl font-light leading-tight text-right max-w-3xl"
                style={{ color: titleColor }}
              >
                Community Driven<br />Collectible Art
              </motion.h1>
            </div>
          </div>

          {/* Logo - positioned between background and foreground lines */}
          <motion.div
            className="absolute left-1/2 top-1/2 w-[500px] h-[500px] pointer-events-none"
            style={{
              y: useTransform(logoY, (value) => `calc(-50% + ${value}%)`),
              x: "-50%",
              zIndex: 20,
            }}
          >
            <svg
              id="Layer_1"
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              width="500"
              height="500"
              viewBox="0 0 360 360"
              className="w-full h-full"
            >
              <defs>
                <linearGradient id="logoGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor={topColor} />
                  <stop offset="100%" stopColor={bottomColor} />
                </linearGradient>
              </defs>
              <path
                d="M174.1,229.96c-5.29,0-10.41-.04-15.54,0-10.76.1-21.53.23-32.29.38-3.67.05-7.33.14-10.9-.98-6.13-1.94-10.14-7.39-9.87-13.61.15-3.38,1.78-6.15,4.1-8.44,2.45-2.42,5.13-4.62,7.72-6.9,7-6.19,13.99-12.39,20.99-18.58,11.5-10.17,23-20.33,34.49-30.49,6.05-5.35,12.07-10.73,18.14-16.05,3.06-2.68,6.31-5.16,9.3-7.92,3.03-2.79,5.81-5.88,7.41-9.74,1.88-4.53,2.3-9.31,1.38-14.13-2.14-11.37-8.67-19.28-19.46-23.26-16.09-5.93-33.99,4.18-37.86,20.91-2.89,12.46,3.03,26.5,15.38,33,2.57,1.35,5.26,2.28,8.13,2.67.13.02.26.08.58.18-11.38,9.83-22.65,19.56-33.94,29.3-5.67-3.58-10.72-7.81-15.11-12.82-8.72-9.94-14.12-21.5-15.91-34.55-3.16-23,3.15-43.13,19.36-59.88,9.11-9.41,20.21-15.57,32.95-18.67,12.29-2.99,24.47-2.35,36.64.98,5.35,1.46,10.35,3.55,15.08,6.36,1.99,1.18,3.87,2.55,5.76,3.88.53.38.92.39,1.47.07,8.74-5.1,18.51-4.26,25.8,2.75,6.16,5.93,8.01,13.3,5.59,21.59-1.22,4.16-3.61,7.55-6.98,10.29-.35.29-.58,1.02-.51,1.5.55,3.88,1.26,7.74,1.79,11.62.85,6.29,1.01,12.61.26,18.93-.75,6.32-2.35,12.41-5.03,18.2-3.78,8.18-9.11,15.2-15.95,21.04-13.08,11.17-26.2,22.29-39.31,33.43-1.08.92-2.17,1.82-3.55,2.96.71,0,1.11,0,1.5,0,10.54-.04,21.09-.15,31.63-.11,4.43.02,8.88.13,13.27.6,6.23.67,11.41,3.51,15.18,8.63,4.05,5.5,3.76,12.79-.68,18.4-3.51,4.43-7.85,7.97-12.31,11.36-9.54,7.27-19.12,14.5-28.7,21.72-10.54,7.94-21.11,15.84-31.65,23.78-14.78,11.13-29.55,22.29-44.33,33.43-4.35,3.28-8.72,6.55-13.24,9.7,19.73-30.51,39.47-61.02,59.22-91.56Z"
                fill="url(#logoGradient)"
              />
            </svg>
          </motion.div>
          
          {/* Background Geometric Lines (behind logo) */}
          <motion.div 
            className="absolute inset-0 pointer-events-none top-2/3"
            style={{ opacity: linesOpacity, zIndex: 25 }}
          >
            <div className="relative w-full h-full">
              {linePositions.slice(0, 20).map((position, index) => (
                <motion.svg
                  key={index}
                  xmlns="http://www.w3.org/2000/svg"
                  width="100%"
                  viewBox="0 0 100 1"
                  fill="none"
                  preserveAspectRatio="none"
                  className="absolute w-full h-px"
                  style={{
                    y: useTransform(position, (value) => `calc(50% + ${value}%)`),
                  }}
                >
                  <rect width="100" height="1" fill={linesColor} />
                </motion.svg>
              ))}
            </div>
          </motion.div>

          {/* Foreground Geometric Lines (in front of logo) */}
          <motion.div 
            className="absolute inset-0 pointer-events-none top-2/3 bg-[#2d2d30]"
            exit={{ background: "black" }}
            style={{ opacity: linesOpacity, zIndex: 15 }}
          >
            <div className="relative w-full h-full">
              {linePositions.slice(20).map((position, index) => (
                <motion.svg
                  key={index + 20}
                  xmlns="http://www.w3.org/2000/svg"
                  width="100%"
                  viewBox="0 0 100 1"
                  fill="none"
                  preserveAspectRatio="none"
                  className="absolute w-full h-px"
                  style={{
                    y: useTransform(position, (value) => `calc(50% + ${value}%)`),
                  }}
                >
                  <rect width="100" height="1" fill={linesColor} />
                </motion.svg>
              ))}

            {/* Subtitle with increased spacing */}
            {/* <motion.div
              className="absolute left-1/2 bottom-0 max-w-4xl px-6 pb-20"
              style={{
                x: "-50%",
              }}
            >
              <motion.h2
                className="text-lg md:text-xl text-black leading-relaxed text-left mb-8"
                style={{ opacity: subtitleOpacity }}
              >
                <span className="text-orange-400">PiggyBanx is a new kind of collectible art company.</span> lorem ipsum piggybanx collaboratorium lorem ipsum piggybanx collaboratorium. Our{" "}
                <span className="text-orange-400">intelligent, autonomous art cells</span> lorem ipsum piggybanx collaboratorium lorem ipsum piggybanx collaboratorium. and{" "}
                <span className="text-orange-400">empower artists</span> lorem ipsum piggybanx collaboratorium lorem ipsum piggybanx collaboratorium.
              </motion.h2>
            </motion.div> */}
            </div>

          </motion.div>

        </section>
      </div>
    )
}