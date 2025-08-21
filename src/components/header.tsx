"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"

import { Link } from "@tanstack/react-router"
import { navItems } from "~/lib/data"


export default function Header() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  const handleDrawerOpen = () => {
    setIsDrawerOpen(!isDrawerOpen)
  }

  const handleDrawerClose = () => {
    setIsDrawerOpen(false)
  }

  return (
    <>
      {/* Header Logo */}
      <header className="fixed top-2 left-10 p-8 z-50">
        <button onClick={handleDrawerOpen} className="pointer-events-auto cursor-pointer hover:opacity-80 transition-opacity duration-300">
          <img
            src="/assets/logo-white.png"
            alt="Logo"
            width={32}
            height={32}
          />
        </button>
      </header>

      {/* Backdrop */}
      <AnimatePresence>
        {isDrawerOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleDrawerClose}
          />
        )}
      </AnimatePresence>

      {/* Sliding Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <motion.div
            className="fixed left-0 top-0 h-full w-96 bg-black/90 backdrop-blur-sm z-50 flex flex-col justify-center border-r border-white/70"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="absolute top-8 left-8 cursor-pointer hover:opacity-80 transition-opacity duration-300">
                <Link 
                  to="/"
                  preload="intent"
                >
                    <img
                        src="/assets/logo-white.png"
                        alt="Logo"
                        width={32}
                        height={32}
                    />
                </Link>
            </div>

            {/* Close Button */}
            <button
              onClick={handleDrawerClose}
              className="absolute top-8 right-8 text-white/70 hover:text-white/90 text-2xl cursor-pointer"
            >
              ×
            </button>

            {/* Navigation */}
            <nav className="px-8">
              <ul className="flex flex-col gap-6">
                {navItems.map((item, index) => (
                  <motion.li
                    key={`nav-${index}`}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <Link
                      to={item.link}
                      preload="intent"
                      className="relative z-10 block text-2xl font-light leading-tight text-white/70 transition-all duration-300 hover:text-white/90 uppercase"
                      onClick={handleDrawerClose}
                      style={{
                        mixBlendMode: "difference",
                      }}
                    >
                      {item.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>

            {/* Footer */}
            <div className="absolute bottom-8 left-8 text-sm text-white/50">
              <p>PIGGYBANK ©2025</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}