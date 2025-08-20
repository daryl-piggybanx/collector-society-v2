/// <reference types="vite/client" />
import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useLocation,
} from '@tanstack/react-router'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import * as React from 'react'
import type { QueryClient } from '@tanstack/react-query'
import { DefaultCatchBoundary } from '~/components/DefaultCatchBoundary'
import { NotFound } from '~/components/NotFound'
import appCss from '~/styles/app.css?url'
import { seo } from '~/utils/seo'
import LogoHeader from '~/components/logo-header'


import { PostHogClientProvider } from '~/integrations/posthog/provider'

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'PiggyVerse',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
      {
        rel: 'icon',
        type: 'image/png',
        href: '/logo-white.png',
      },
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/logo-white-circle.ico',
      },
    ],
  }),

  errorComponent: (props) => {
    return (
      <RootDocument>
        <DefaultCatchBoundary {...props} />
      </RootDocument>
    )
  },
  notFoundComponent: () => <NotFound />,
  
  component: () => {    
    const location = useLocation()
    const currentPath = location.pathname
    
    // Show header only for routes that start with '/collector'
    const shouldShowHeader = currentPath.startsWith('/collector')

    return (
      <RootDocument>
        {/* <PostHogClientProvider> */}
          {shouldShowHeader && <LogoHeader />}

          <Outlet />
          <TanStackRouterDevtools />

          {/* <TanstackQueryLayout /> */}
        {/* </PostHogClientProvider> */}
      </RootDocument>
    )
  },
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <TanStackRouterDevtools position="bottom-right" />
        <ReactQueryDevtools buttonPosition="bottom-left" />
        <Scripts />
      </body>
    </html>
  )
}
