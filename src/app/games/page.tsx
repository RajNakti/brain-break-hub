'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/AuthProvider'
import { supabase } from '@/lib/supabase'
import GamesLibrary from '@/components/games/GamesLibrary'
import Header from '@/components/layout/Header'
import { Brain } from 'lucide-react'

export default function GamesPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [gameScores, setGameScores] = useState<any[]>([])
  const [scoresLoading, setScoresLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
      return
    }

    if (user) {
      loadGameScores()
    }
  }, [user, loading, router])

  const loadGameScores = async () => {
    if (!user) return

    try {
      const { data } = await supabase
        .from('game_scores')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      setGameScores(data || [])
    } catch (error) {
      console.error('Error loading game scores:', error)
    } finally {
      setScoresLoading(false)
    }
  }

  if (loading || scoresLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <Brain className="h-16 w-16 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading games...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header />
      <GamesLibrary user={user} gameScores={gameScores} />
    </div>
  )
}
