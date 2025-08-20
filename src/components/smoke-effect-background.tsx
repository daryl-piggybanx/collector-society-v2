"use client"

import { Canvas } from "@react-three/fiber"
import SmokeEffect from "@/components/smoke-effect"

export default function SmokeEffectBackground() {
  return (
    <div className="fixed inset-0 -z-10 bg-gradient-to-b from-gray-900 via-gray-800 to-black">
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 75 }} 
        style={{ width: "100%", height: "100%" }}
        performance={{ min: 0.5 }} // allow framerate drop
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} />
        <SmokeEffect />
      </Canvas>
    </div>
  )
}
