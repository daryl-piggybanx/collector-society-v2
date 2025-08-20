"use client"

import { useState, useEffect } from "react"
import { motion } from "motion/react"
import { GiFalling } from "react-icons/gi"
import { Home } from "lucide-react"

type DomainIcon = "falling" | "home"

interface DomainButtonProps {
  label: string
  icon: DomainIcon
  href: string
  description?: string
}

const iconMap = {
  falling: GiFalling,
  home: Home,
}

// Bounce easing function from https://easings.net/#easeOutBounce
function bounceEase(x: number) {
  const n1 = 7.5625
  const d1 = 2.75

  if (x < 1 / d1) {
    return n1 * x * x
  } else if (x < 2 / d1) {
    return n1 * (x -= 1.5 / d1) * x + 0.75
  } else if (x < 2.5 / d1) {
    return n1 * (x -= 2.25 / d1) * x + 0.9375
  } else {
    return n1 * (x -= 2.625 / d1) * x + 0.984375
  }
}

export function DomainButton({ label, icon, href, description }: DomainButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)
  const IconComponent = iconMap[icon]

  useEffect(() => {
    // Trigger load animation after a slight delay
    const timer = setTimeout(() => setHasLoaded(true), 200)
    return () => clearTimeout(timer)
  }, [])

  // Define dramatic icon-specific animations for load and hover
  const getIconAnimation = () => {
    if (icon === "falling") {
      // Separate animations for load vs hover
      if (isHovered) {
        return {
          y: [-20, -15, -8, 0, 8, 15, 20, 10, 0],
          rotate: [0, -8, -12, -8, 0, 8, 12, 8, 0],
          scale: [1, 0.95, 0.9, 0.95, 1, 1.05, 1.1, 1.05, 1],
        }
      } else if (hasLoaded) {
        return {
          y: [0, -10, 0],
          rotate: [0, -5, 0],
          scale: [1, 1.05, 1],
        }
      }
      return { y: 0, rotate: 0, scale: 1 }
    } else if (icon === "home") {
      if (isHovered) {
        return {
          rotate: [0, -10, 10, -8, 8, -5, 5, -2, 2, 0],
          y: [0, -5, -8, -6, -4, -2, -1, 0],
          scale: [1, 1.1, 1.2, 1.15, 1.1, 1.05, 1.02, 1],
        }
      } else if (hasLoaded) {
        return {
          rotate: [0, -5, 0],
          y: [0, -3, 0],
          scale: [1, 1.1, 1],
        }
      }
      return { rotate: 0, y: 0, scale: 1 }
    }
    return {}
  }

  const getIconTransition = () => {
    if (icon === "falling") {
      if (isHovered) {
        return {
          duration: 2,
          ease: [0.4, 0, 0.2, 1],
          times: [0, 0.15, 0.25, 0.4, 0.55, 0.7, 0.8, 0.9, 1],
          repeat: Number.POSITIVE_INFINITY,
          repeatDelay: 0.5,
        }
      } else if (hasLoaded) {
        return {
          duration: 1,
          ease: [0.4, 0, 0.2, 1],
          repeat: 0, // No repeat on load
        }
      }
    } else if (icon === "home") {
      if (isHovered) {
        return {
          duration: 2.2,
          ease: [0.25, 0.1, 0.25, 1],
          times: [0, 0.12, 0.25, 0.38, 0.5, 0.62, 0.75, 0.88, 1],
          repeat: Number.POSITIVE_INFINITY,
          repeatDelay: 0.3,
        }
      } else if (hasLoaded) {
        return {
          duration: 1.2,
          ease: [0.25, 0.1, 0.25, 1],
          repeat: 0, // No repeat on load
        }
      }
    }
    return { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
  }

  return (
    <motion.div
      className="perspective-1000 flex flex-col items-center space-y-4"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <a href={href} className="flex flex-col items-center space-y-4">
        {/* Compact white background container - just for the icon */}
        <div className="group relative h-24 w-24 overflow-hidden rounded-xl bg-neutral-100 shadow-2xl transition-all duration-500 hover:shadow-3xl sm:h-28 sm:w-28">
          {/* Animated background gradient */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-neutral-50 to-neutral-200 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            initial={false}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          />

          {/* Centered icon container */}
          <div className="relative z-10 flex h-full w-full items-center justify-center">
            {/* Static black circle container with animated icon inside */}
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gray-950 text-neutral-100 shadow-lg sm:h-18 sm:w-18">
              {/* Animated icon */}
              <motion.div
                className="absolute flex items-center justify-center"
                animate={getIconAnimation()}
                transition={getIconTransition()}
              >
                <IconComponent size={28} className="sm:text-3xl" />
              </motion.div>
            </div>
          </div>

          {/* Enhanced ripple effect */}
          <motion.div
            className="absolute inset-0 rounded-xl bg-gray-300"
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: isHovered ? [0, 1.1, 1.3] : (hasLoaded ? [0, 1.1, 0] : 0),
              opacity: isHovered ? [0, 0.15, 0] : (hasLoaded ? [0, 0.15, 0] : 0),
            }}
            transition={{
              duration: 1.2,
              repeat: isHovered ? Number.POSITIVE_INFINITY : 0,
              ease: [0.4, 0, 0.2, 1],
            }}
          />

          {/* Pulsing border glow effect */}
          <motion.div
            className="absolute inset-0 rounded-xl border-2 border-gray-400"
            animate={{
              opacity: isHovered ? [0, 0.3, 0] : (hasLoaded ? [0, 0.3, 0] : 0),
              scale: isHovered ? [1, 1.02, 1] : (hasLoaded ? [1, 1.02, 1] : 1),
            }}
            transition={{
              duration: 1.8,
              repeat: isHovered ? Number.POSITIVE_INFINITY : 0,
              ease: [0.4, 0, 0.2, 1],
            }}
          />
        </div>

        {/* Text content outside the white background */}
        <div className="flex flex-col items-center space-y-1 text-center">
          <motion.h3
            className="text-lg font-bold text-neutral-100 transition-colors duration-300 group-hover:text-white sm:text-xl"
            initial={{ scale: 1 }}
            animate={{
              scale: isHovered ? [1, 1.03, 1] : (hasLoaded ? [1, 1.03, 1] : 1),
            }}
            transition={{ 
              duration: 0.4, 
              ease: [0.4, 0, 0.2, 1],
              repeat: isHovered ? Number.POSITIVE_INFINITY : 0,
            }}
          >
            {label}
          </motion.h3>

          {description && (
            <motion.p
              className="text-xs text-neutral-100 transition-colors duration-300 group-hover:text-white sm:text-sm"
              initial={{ opacity: 0.7 }}
              animate={{
                opacity: isHovered ? 1 : (hasLoaded ? 1 : 0.7),
                y: isHovered ? [0, -1, 0] : (hasLoaded ? [0, -1, 0] : 0),
              }}
              transition={{ 
                duration: 0.3, 
                ease: [0.4, 0, 0.2, 1],
                repeat: isHovered ? Number.POSITIVE_INFINITY : 0,
              }}
            >
              {description}
            </motion.p>
          )}
        </div>
      </a>
    </motion.div>
  )
}

export function DomainButtonV2({ label, icon, href, description }: DomainButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)
  const IconComponent = iconMap[icon]

  useEffect(() => {
    // Trigger load animation after a slight delay
    const timer = setTimeout(() => setHasLoaded(true), 300)
    return () => clearTimeout(timer)
  }, [])

  // Define dramatic icon-specific animations with bounce easing for falling
  const getIconAnimation = () => {
    if (icon === "falling") {
      if (isHovered) {
        return {
          y: -32,
          rotate: [0, -15, 15, -10, 10, -5, 5, 0],
          scale: [1, 0.9, 1.1, 0.95, 1.05, 1],
        }
      } else if (hasLoaded) {
        return {
          y: [10, -20, 10],
          rotate: [0, -8, 0],
          scale: [1, 1.05, 1],
        }
      }
      return { y: 10, rotate: 0, scale: 1 }
    } else if (icon === "home") {
      if (isHovered) {
        return {
          rotate: [0, -10, 10, -8, 8, -5, 5, -2, 2, 0],
          y: [0, -5, -8, -6, -4, -2, -1, 0],
          scale: [1, 1.1, 1.2, 1.15, 1.1, 1.05, 1.02, 1],
        }
      } else if (hasLoaded) {
        return {
          rotate: [0, -5, 0],
          y: [0, -3, 0],
          scale: [1, 1.1, 1],
        }
      }
      return { rotate: 0, y: 0, scale: 1 }
    }
    return {}
  }

  const getIconTransition = () => {
    if (icon === "falling") {
      if (isHovered) {
        return {
          duration: 1.2,
          ease: bounceEase,
          repeat: Number.POSITIVE_INFINITY,
          repeatDelay: 0.8,
        }
      } else if (hasLoaded) {
        return {
          duration: 1.2,
          ease: bounceEase,
          repeat: 0, // No repeat on load
        }
      }
    } else if (icon === "home") {
      if (isHovered) {
        return {
          duration: 2.2,
          ease: [0.25, 0.1, 0.25, 1],
          times: [0, 0.12, 0.25, 0.38, 0.5, 0.62, 0.75, 0.88, 1],
          repeat: Number.POSITIVE_INFINITY,
          repeatDelay: 0.5,
        }
      } else if (hasLoaded) {
        return {
          duration: 1.5,
          ease: [0.25, 0.1, 0.25, 1],
          repeat: 0, // No repeat on load
        }
      }
    }
    return { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
  }

  // Get gradient colors based on icon type
  const getGradientColors = () => {
    if (icon === "falling") {
      return "from-red-600 via-rose-600 to-red-800"
    } else if (icon === "home") {
      return "from-white via-neutral-300 to-neutral-100"
    }
    return "from-red-500 via-rose-600 to-red-800"
  }

  return (
    <motion.div
      className="perspective-1000 flex flex-col items-center space-y-4"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <a href={href} className="block">
        <div className="group relative h-24 w-24 overflow-hidden rounded-3xl shadow-2xl transition-all duration-500 hover:shadow-3xl sm:h-32 sm:w-32">
          {/* Gradient background with flowing shapes */}
          <div className={`absolute inset-0 bg-gradient-to-br ${getGradientColors()}`}>
            {/* Flowing organic shapes */}
            <div className="absolute inset-0 opacity-30">
              <motion.div
                className="absolute -top-4 -right-4 h-16 w-16 rounded-full bg-white/20"
                animate={{
                  scale: isHovered ? [1, 1.2, 1] : (hasLoaded ? [1, 1.2, 1] : 1),
                  x: isHovered ? [0, 5, 0] : (hasLoaded ? [0, 5, 0] : 0),
                  y: isHovered ? [0, -5, 0] : (hasLoaded ? [0, -5, 0] : 0),
                }}
                transition={{ 
                  duration: 2, 
                  repeat: isHovered ? Number.POSITIVE_INFINITY : 0,
                  delay: 0.2,
                }}
              />
              <motion.div
                className="absolute -bottom-6 -left-6 h-20 w-20 rounded-full bg-white/15"
                animate={{
                  scale: isHovered ? [1, 0.8, 1] : (hasLoaded ? [1, 0.8, 1] : 1),
                  x: isHovered ? [0, -3, 0] : (hasLoaded ? [0, -3, 0] : 0),
                  y: isHovered ? [0, 3, 0] : (hasLoaded ? [0, 3, 0] : 0),
                }}
                transition={{ 
                  duration: 2.5, 
                  repeat: isHovered ? Number.POSITIVE_INFINITY : 0,
                  delay: 0.4,
                }}
              />
              <motion.div
                className="absolute top-1/2 left-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10"
                animate={{
                  scale: isHovered ? [1, 1.3, 1] : (hasLoaded ? [1, 1.3, 1] : 1),
                  rotate: isHovered ? [0, 180, 360] : (hasLoaded ? [0, 180, 360] : 0),
                }}
                transition={{ 
                  duration: 3, 
                  repeat: isHovered ? Number.POSITIVE_INFINITY : 0,
                  delay: 0.6,
                }}
              />
            </div>
          </div>

          {/* Glass effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />

          {/* Content container */}
          <div className="relative z-10 flex h-full flex-col items-center justify-evenly space-y-2 p-2 text-center">
            {/* Animated icon */}
            <motion.div
              className={`flex items-center justify-center ${icon === "falling" ? "text-neutral-100" : "text-neutral-950"} drop-shadow-lg`}
              animate={getIconAnimation()}
              transition={getIconTransition()}
            >
              <IconComponent size={32} className="sm:text-4xl" />
            </motion.div>

            {/* Label text */}
            <motion.div
              className="space-y-1"
              animate={{
                scale: isHovered ? [1, 1.02, 1] : (hasLoaded ? [1, 1.02, 1] : 1),
              }}
              transition={{ 
                duration: 0.4,
                repeat: isHovered ? Number.POSITIVE_INFINITY : 0,
              }}
            >
              <h3 className={`text-sm font-bold uppercase tracking-wider ${icon === "falling" ? "text-neutral-100" : "text-neutral-950"} drop-shadow-md sm:text-base`}>
                {label}
              </h3>
            </motion.div>
          </div>

          {/* Hover glow effect */}
          <motion.div
            className="absolute inset-0 rounded-3xl bg-white/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Pulsing border effect */}
          <motion.div
            className="absolute inset-0 rounded-3xl border-2 border-white/40"
            animate={{
              opacity: isHovered ? [0, 0.6, 0] : (hasLoaded ? [0, 0.6, 0] : 0),
              scale: isHovered ? [1, 1.02, 1] : (hasLoaded ? [1, 1.02, 1] : 1),
            }}
            transition={{
              duration: 1.5,
              repeat: isHovered ? Number.POSITIVE_INFINITY : 0,
              ease: "easeInOut",
            }}
          />
        </div>
        {description && <p className="mt-4 text-xs text-white/90 drop-shadow-sm sm:text-sm">{description}</p>}
      </a>
    </motion.div>
  )
}
