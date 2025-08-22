import { createFileRoute } from '@tanstack/react-router'
import Knights from "~/components/pages/knights"
import usePreloadedImage from "~/hooks/use-preloaded-image"

export const Route = createFileRoute('/knights')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Knights />
}
