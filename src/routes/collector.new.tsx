import { createFileRoute } from '@tanstack/react-router'
import { Suspense, lazy, useEffect, useState } from 'react'

import { NewCollectorForm } from '@/components/form/new'
import ParticleBackground from '@/components/particle-background'
import ParticleTwinkleBackground from '@/components/particle-background-twinkle'
// import SmokeEffectBackground from "@/components/smoke-effect-background"

const SmokeEffectBackground = lazy(() => import('@/components/smoke-effect-background'))

export const Route = createFileRoute('/collector/new')({
  component: RouteComponent,
})

function RouteComponent() {
  const [showBackground, setShowBackground] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBackground(true)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  return (
    // <main className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-950 to-zinc-950">
    //   <ParticleTwinkleBackground />

    //   <div className="relative z-10 min-h-screen pt-32 md:pt-28 pb-8">
    //     <div className="container mx-auto px-4 h-full">
    //       <div className="flex justify-center items-start min-h-full">
    //         <div className="w-full max-w-3xl">
    //           <NewCollectorForm />
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </main>
    <main className="min-h-screen">
      {/* Fallback background while 3D scene loads */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-gray-900 via-gray-800 to-black" />
      
      {/* Lazy-loaded 3D background with Suspense */}
      {showBackground && (
        <Suspense fallback={null}>
          <SmokeEffectBackground />
        </Suspense>
      )}

    <div className="relative z-10 min-h-screen pt-32 md:pt-28 pb-8">
      <div className="container mx-auto px-4 h-full">
        <div className="flex justify-center items-start min-h-full">
          <div className="w-full max-w-3xl">
            <NewCollectorForm />
          </div>
        </div>  
      </div>
    </div>
  </main>
  )
}
