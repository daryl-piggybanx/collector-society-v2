"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { useMutation } from "@tanstack/react-query"
import { submitScore } from "@/integrations/supabase/services"

type ScoreEntryProps = {
  score: number
  onSubmit: (username: string) => void
  onCancel: () => void
  isLoading?: boolean
}

export default function ScoreEntry({ score, onSubmit, onCancel, isLoading = false }: ScoreEntryProps) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const mutation = useMutation({
    mutationFn: submitScore,
    onSuccess: () => {
      setError("")
      onSubmit(username.trim())
    },
    onError: (error) => {
      console.error("Error submitting score:", error)
      setError("Failed to submit score. Please try again.")
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!username.trim()) {
      setError("Username is required")
      return
    }

    if (username.length < 2) {
      setError("Username must be at least 2 characters")
      return
    }

    if (username.length > 20) {
      setError("Username must be less than 20 characters")
      return
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      setError("Username can only contain letters, numbers, hyphens, and underscores")
      return
    }

    setError("")
    // Submit the score
    mutation.mutate({ data: { username: username.trim(), score } })
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60">
      <Card className="bg-gray-900 border-red-600 border-2 text-white max-w-sm w-full mx-4">
        <CardHeader>
          <CardTitle className="text-center text-red-400">Add to Leaderboard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-lg">
              Your High Score: <span className="font-bold text-cyan-400">{score}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-2">
                Enter Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your username"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                maxLength={20}
                disabled={mutation.isPending}
              />
              {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
            </div>

            <div className="flex space-x-3">
              <Button
                type="submit"
                disabled={mutation.isPending}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md disabled:opacity-50"
              >
                {mutation.isPending ? "Adding..." : "Add Score"}
              </Button>
              <Button
                type="button"
                onClick={onCancel}
                disabled={mutation.isPending}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
