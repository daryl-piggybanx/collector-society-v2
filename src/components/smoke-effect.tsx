"use client"

import { useRef, useState, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import { Cloud, Clouds } from "@react-three/drei"
import type * as THREE from "three"

export default function SmokeEffect() {
  const cloudsRef = useRef<THREE.Group>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const mouseInfluence = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Convert screen coordinates to normalized device coordinates (-1 to 1)
      const x = (event.clientX / window.innerWidth) * 2 - 1
      const y = -(event.clientY / window.innerHeight) * 2 + 1
      setMousePosition({ x, y })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useFrame((state) => {
    if (!cloudsRef.current) return

    mouseInfluence.current.x += (mousePosition.x * 0.5 - mouseInfluence.current.x) * 0.02
    mouseInfluence.current.y += (mousePosition.y * 0.3 - mouseInfluence.current.y) * 0.02

    const time = state.clock.elapsedTime
    cloudsRef.current.rotation.y = Math.sin(time * 0.1) * 0.1 + mouseInfluence.current.x * 0.2
    cloudsRef.current.position.x = mouseInfluence.current.x * 0.8
    cloudsRef.current.position.z = mouseInfluence.current.y * 0.4
  })

  return (
    <Clouds ref={cloudsRef} limit={200}>
      {/* Bottom layer - densest smoke */}
      <Cloud
        seed={1}
        segments={20}
        bounds={[4, 1, 2]}
        volume={6}
        color="#ffffff"
        opacity={0.3}
        speed={0.1}
        growth={2}
        position={[0, -2, 0]}
        fade={10}
      />

      {/* Middle layer - dispersing */}
      <Cloud
        seed={2}
        segments={18}
        bounds={[6, 1.5, 3]}
        volume={4}
        color="#f0f0f0"
        opacity={0.2}
        speed={0.15}
        growth={3}
        position={[0.5, 0, 0]}
        fade={8}
      />

      {/* Upper layer - most dispersed */}
      <Cloud
        seed={3}
        segments={15}
        bounds={[8, 2, 4]}
        volume={3}
        color="#e8e8e8"
        opacity={0.12}
        speed={0.2}
        growth={4}
        position={[-0.3, 2, 0]}
        fade={6}
      />

      {/* Top wispy layer */}
      <Cloud
        seed={4}
        segments={12}
        bounds={[10, 1.5, 5]}
        volume={2}
        color="#d0d0d0"
        opacity={0.06}
        speed={0.25}
        growth={5}
        position={[0.2, 4, 0]}
        fade={4}
      />
    </Clouds>
  )
}
