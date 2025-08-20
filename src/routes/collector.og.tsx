import { getProfileByEmail } from '~/integrations/klaviyo/profiles/services'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { OGCollectorForm } from '~/components/form/og'
import ParticleTwinkleBackground from '~/components/particle-background-twinkle'

export const Route = createFileRoute('/collector/og')({
    /*
    loader: async ({ context }) => {
        // Prefetch the query
        await context.queryClient.prefetchQuery({
            queryKey: ['profile', 'daryl@piggybanxinc.com'],
            queryFn: () => getProfileByEmail({ 
                data: { 
                    email: 'daryl@piggybanxinc.com' 
                } 
            })
        })
    },
    */
    component: RouteComponent,
})

function RouteComponent() {
    const email = false // disable for now
    if (email) {
        const { data: profile, isLoading, error } = useQuery({
            queryKey: ['profile', ''],
            queryFn: () => getProfileByEmail({ 
                data: { 
                    email: '' 
                } 
            })
        })

        if (isLoading) return <div>Loading...</div>
        if (error) return <div>Error loading profile</div>
        if (!profile) return <div>No profile found</div>
    }

    // Welcome, {profile.attributes.first_name}

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-950 to-zinc-950">
      <ParticleTwinkleBackground />

      <div className="relative z-10 min-h-screen pt-32 md:pt-28 pb-8">
        <div className="container mx-auto px-4 h-full">
          <div className="flex justify-center items-start min-h-full">
            <div className="w-full max-w-3xl">
              <OGCollectorForm />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
