import { createFileRoute } from '@tanstack/react-router'
import Knights from "~/components/pages/knights"


export const Route = createFileRoute('/knights')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Knights />
}
