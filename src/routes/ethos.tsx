import { createFileRoute } from '@tanstack/react-router'
import Ethos from '@/components/pages/ethos'

export const Route = createFileRoute('/ethos')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="font-sans overflow-x-hidden bg-background text-foreground">
      <Ethos />
    </div>
  )
}
