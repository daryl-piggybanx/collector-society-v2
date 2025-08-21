import { createFileRoute } from '@tanstack/react-router'
import VideoGame from '~/components/pages/videogame'

export const Route = createFileRoute('/piggyverse')({
  component: RouteComponent,
})

function RouteComponent() {
  return <VideoGame />
}
