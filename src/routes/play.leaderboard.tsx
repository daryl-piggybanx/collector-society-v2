import { createFileRoute } from '@tanstack/react-router'
import { getLeaderboard, getLeaderBoardStats } from '~/integrations/supabase/services'
import ParticleTwinkleBackground from '~/components/particle-background-twinkle'
import LeaderboardPage from '~/components/games/leaderboard'

export const Route = createFileRoute('/play/leaderboard')({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.prefetchQuery({
        queryKey: ['leaderboard'],
        queryFn: () => getLeaderboard(),
      }),
      context.queryClient.prefetchQuery({
        queryKey: ['leaderboardStats'],
        queryFn: () => getLeaderBoardStats(),
      })
    ])
    // await context.queryClient.prefetchQuery({
    //     queryKey: ['userBest'],
    //     queryFn: () => getUserBest(),
    // })
  },
  component: RouteComponent,
})

function RouteComponent() {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black flex items-center justify-center p-4">
        <ParticleTwinkleBackground />
  
        <div className="relative z-10 min-h-screen pt-32 md:pt-28 pb-8">
          <div className="container mx-auto px-4 h-full">
            <div className="flex justify-center items-start min-h-full">
              <div className="w-full max-w-3xl">
                <LeaderboardPage/>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }
  