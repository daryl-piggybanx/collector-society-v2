"use client"

import { useState } from "react"
import { useRouter } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { ArrowLeft, Trophy, Medal, Award } from "lucide-react"

import { useQuery } from "@tanstack/react-query"
import { getLeaderboard, getLeaderBoardStats } from "@/integrations/supabase/services"
import type { LeaderboardEntry } from "@/integrations/supabase/types"


export default function LeaderboardPage() {
    const [userBest, setUserBest] = useState<LeaderboardEntry | null>(null)

    const router = useRouter();

    const query = useQuery({
        queryKey: ['leaderboard'],
        queryFn: () => getLeaderboard(),
    });

    const statsQuery = useQuery({
        queryKey: ['leaderboardStats'],
        queryFn: () => getLeaderBoardStats(),
    });

    // Extract leaderboard data from query result
    const topScores = (query.isSuccess && query.data?.success ? query.data.data : []) || [];
    
    // Extract stats data from query result
    const stats = (statsQuery.isSuccess && statsQuery.data?.success ? statsQuery.data.data : null);

    if (query.isPending) {
        return (
            <Card className="bg-gray-900 border-red-600 border-2 text-white max-w-4xl w-full">
                <CardContent className="py-8">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto"></div>
                        <p className="mt-2 text-gray-200">Loading leaderboard...</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (query.isError) {
        return (
            <Card className="bg-gray-900 border-red-600 border-2 text-white max-w-4xl w-full">
                <CardContent className="py-8">
                    <div className="text-center">
                        <p className="text-red-500">Error loading leaderboard</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1:
                return <Trophy className="w-6 h-6 text-red-700" />
            case 2:
                return <Medal className="w-6 h-6 text-red-500" />
            case 3:
                return <Award className="w-6 h-6 text-red-300" />
            default:
                return <span className="w-6 h-6 flex items-center justify-center text-lg font-bold text-red-500">#{rank}</span>
        }
    }
    
  

  return (
    <Card className="bg-gray-900 border-red-600 border-2 text-white max-w-4xl w-full">
    <CardHeader>
      <div className="flex items-center justify-between">
        <Button onClick={() => router.history.back()} className="bg-gray-700 hover:bg-gray-600 p-2">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <CardTitle className="text-center text-red-500 text-2xl">Leaderboard</CardTitle>
        <div className="w-10" /> {/* Spacer for centering */}
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      {topScores.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-200">No scores yet. Be the first!</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-red-500 font-bold">Rank</th>
                <th className="text-left py-3 px-4 text-red-500 font-bold">Player</th>
                <th className="text-center py-3 px-4 text-red-500 font-bold">Date</th>
                <th className="text-right py-3 px-4 text-red-500 font-bold">Score</th>
              </tr>
            </thead>
            <tbody>
              {topScores.map((entry, index) => (
                <tr
                  key={`${entry.username}-${entry.score}-${index}`}
                  className={`border-b border-gray-700/50 transition-colors hover:bg-gray-800/30 ${
                    index === 0
                      ? "bg-yellow-900/20"
                      : index === 1
                        ? "bg-gray-800/30"
                        : index === 2
                          ? "bg-amber-900/20"
                          : "bg-transparent"
                  }`}
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      {getRankIcon(index + 1)}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <p className="font-bold text-lg text-white">{entry.username}</p>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <p className="text-sm text-gray-200">
                      {entry.created_at ? new Date(entry.created_at).toLocaleDateString() : 'Unknown date'}
                    </p>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <p className="text-xl font-bold text-red-500">{entry.score}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {stats && (
        <div className="pt-4">
          <h3 className="text-lg font-bold text-red-500 mb-2">Stats</h3>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-xs text-gray-200">Players</p>
              <p className="font-bold text-red-500">{stats.totalEntries}</p>
            </div>
            <div>
              <p className="text-xs text-gray-200">Average</p>
              <p className="font-bold text-red-500">{stats.averageScore}</p>
            </div>
          </div>
        </div>
      )}

      <div className="pt-4 border-t border-gray-700">
        <Button
          onClick={() => router.history.back()}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md"
        >
          Back to Game
        </Button>
      </div>
    </CardContent>
  </Card>
  )
}