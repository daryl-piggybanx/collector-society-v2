import { createFileRoute } from '@tanstack/react-router'

import { VerificationCollectorForm } from '@/components/form/verification'
import ParticleTwinkleBackground from '@/components/particle-background-twinkle'

export const Route = createFileRoute('/collector/discord')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-950 to-zinc-950">
      <ParticleTwinkleBackground />

      <div className="relative z-10 min-h-screen pt-32 md:pt-28 pb-8">
        <div className="container mx-auto px-4 h-full">
          <div className="flex justify-center items-start min-h-full">
            <div className="w-full max-w-3xl">
              <VerificationCollectorForm />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
