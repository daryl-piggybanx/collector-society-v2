import { useEffect, useRef, useState } from "react"

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  color: string
  originalX: number
  originalY: number
  glowIntensity: number
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const particlesRef = useRef<Particle[]>([])
  const mousePositionRef = useRef({ x: 0, y: 0 })
  const animationFrameRef = useRef<number>(0)
  const isInitializedRef = useRef(false)

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current
        const width = window.innerWidth
        const height = window.innerHeight

        // Set canvas dimensions
        canvas.width = width
        canvas.height = height
        setDimensions({ width, height })

        // Reinitialize particles if already initialized
        if (isInitializedRef.current) {
          initParticles(width, height)
        }
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // Initialize particles
  const initParticles = (width: number, height: number) => {
    const particles: Particle[] = []
    const particleCount = Math.min(Math.floor((width * height) / 10000), 200)

    const colors = [
      // "rgba(255, 183, 77, 0.8)", // Amber
      // "rgba(255, 167, 38, 0.8)", // Orange
      // "rgba(255, 152, 0, 0.8)", // Deep Orange
      // "rgba(244, 143, 177, 0.8)", // Pink
      // "rgba(255, 204, 128, 0.8)", // Light Orange
      // "rgba(236, 235, 235, 0.8)", // Off-white
      // "rgba(200, 195, 187, 0.6)", // Light stone gray
      // "rgba(166, 167, 163, 0.7)", // Silver gray
      // "rgba(236, 235, 235, 0.5)", // Off-white with more transparency
      // "rgba(200, 195, 187, 0.4)", // Light stone gray with more transparency
      "rgba(243, 244, 246, 0.8)", // gray-100 (off-white)
      "rgba(229, 231, 235, 0.6)", // gray-200 (off-white with transparency)
      "rgba(228, 228, 231, 0.7)", // zinc-200 (light gray)
      "rgba(250, 250, 250, 0.6)", // zinc-50 with more transparency
      "rgba(244, 244, 245, 0.5)", // zinc-100 with more transparency
    ]

    for (let i = 0; i < particleCount; i++) {
      const size = Math.random() * 5 + 2
      const x = Math.random() * width
      const y = Math.random() * height
      const speedX = Math.random() * 0.2 - 0.1
      const speedY = Math.random() * 0.2 - 0.1
      const colorIndex = Math.floor(Math.random() * colors.length)
      const glowIntensity = Math.random() * 0.5 + 0.5

      particles.push({
        x,
        y,
        size,
        speedX,
        speedY,
        color: colors[colorIndex],
        originalX: x,
        originalY: y,
        glowIntensity,
      })
    }

    particlesRef.current = particles
    isInitializedRef.current = true
  }

  // Setup mouse/touch tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePositionRef.current = { x: e.clientX, y: e.clientY }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("touchmove", handleTouchMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("touchmove", handleTouchMove)
    }
  }, [])

  // Animation loop
  useEffect(() => {
    if (!dimensions.width || !dimensions.height) return

    // Initialize particles
    if (!isInitializedRef.current) {
      initParticles(dimensions.width, dimensions.height)
    }

    const animate = () => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particlesRef.current.forEach((particle) => {
        // Calculate distance from mouse/touch
        const dx = mousePositionRef.current.x - particle.x
        const dy = mousePositionRef.current.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const maxDistance = 150

        // Move particles away from cursor/finger
        if (distance < maxDistance) {
          const force = (maxDistance - distance) / maxDistance
          particle.x -= dx * force * 0.05
          particle.y -= dy * force * 0.05
        }

        // Return to original position
        const returnForce = 0.01
        particle.x += (particle.originalX - particle.x) * returnForce
        particle.y += (particle.originalY - particle.y) * returnForce

        // Apply regular movement
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Boundary check
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.speedX = -particle.speedX
        }

        if (particle.y < 0 || particle.y > canvas.height) {
          particle.speedY = -particle.speedY
        }

        // Draw particle with glow
        ctx.save()
        ctx.shadowBlur = 15 * particle.glowIntensity
        ctx.shadowColor = particle.color
        ctx.fillStyle = particle.color
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })

      // Continue animation loop
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    // Start animation
    animationFrameRef.current = requestAnimationFrame(animate)

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameRef.current)
    }
  }, [dimensions])

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
}
