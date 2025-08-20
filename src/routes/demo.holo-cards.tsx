import { createFileRoute } from '@tanstack/react-router';
import HolographicCard from '@/components/holographic-card';

export const Route = createFileRoute('/demo/holo-cards')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-zinc-950 p-8">
      <HolographicCard imageSrc="/assets/PB25054_B-HiroQuest3-Art.png" imageAlt="HiroQuest 3 Paragon"  />
    </div>
  )
}
