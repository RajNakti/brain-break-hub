'use client'

import { useState, useEffect } from 'react'
import { Trophy, Medal, Crown, TrendingUp, Gamepad2, Timer, Target, Zap } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

interface LeaderboardProps {
  user: any
}

interface LeaderboardEntry {
  id: string
  user_id: string
  username: string
  total_score: number
  games_played: number
  focus_time: number
  habits_completed: number
  rank: number
}

interface GameScore {
  game_type: string
  score: number
  created_at: string
}

export default function Leaderboard({ user }: LeaderboardProps) {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overall' | 'games' | 'focus' | 'habits'>('overall')
  const [userRank, setUserRank] = useState<number | null>(null)

  useEffect(() => {
    loadLeaderboardData()
    // Set up real-time subscription
    const subscription = supabase
      .channel('leaderboard_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'game_scores' },
        () => loadLeaderboardData()
      )
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'focus_sessions' },
        () => loadLeaderboardData()
      )
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'habit_entries' },
        () => loadLeaderboardData()
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const loadLeaderboardData = async () => {
    try {
      // Get all users with their profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, full_name, email')

      if (profilesError) {
        console.error('Error loading profiles:', profilesError)
        toast.error('Failed to load leaderboard data')
        return
      }

      if (!profiles || profiles.length === 0) {
        console.log('No profiles found')
        setLeaderboardData([])
        setLoading(false)
        return
      }

      // Calculate scores for each user
      const leaderboardEntries = await Promise.all(
        profiles.map(async (profile) => {
          // Get game scores
          const { data: gameScores, error: gameScoresError } = await supabase
            .from('game_scores')
            .select('score, game_type')
            .eq('user_id', profile.id)

          if (gameScoresError) {
            console.error('Error loading game scores for user', profile.id, gameScoresError)
          }

          // Get focus sessions
          const { data: focusSessions, error: focusError } = await supabase
            .from('focus_sessions')
            .select('duration')
            .eq('user_id', profile.id)

          if (focusError) {
            console.error('Error loading focus sessions for user', profile.id, focusError)
          }

          // Get habit completions
          const { data: habitEntries, error: habitError } = await supabase
            .from('habit_entries')
            .select('id')
            .eq('user_id', profile.id)

          if (habitError) {
            console.error('Error loading habit entries for user', profile.id, habitError)
          }

          const totalGameScore = gameScores?.reduce((sum, score) => sum + score.score, 0) || 0
          const gamesPlayed = gameScores?.length || 0
          const totalFocusTime = focusSessions?.reduce((sum, session) => sum + session.duration, 0) || 0
          const habitsCompleted = habitEntries?.length || 0

          // Calculate overall score (weighted combination)
          const totalScore = (totalGameScore * 0.4) + (totalFocusTime * 0.3) + (habitsCompleted * 10 * 0.3)

          return {
            id: profile.id,
            user_id: profile.id,
            username: profile.username || profile.full_name || profile.email?.split('@')[0] || 'Anonymous',
            total_score: Math.round(totalScore),
            games_played: gamesPlayed,
            focus_time: totalFocusTime,
            habits_completed: habitsCompleted,
            rank: 0 // Will be set after sorting
          }
        })
      )

      // Sort by total score and assign ranks
      const sortedEntries = leaderboardEntries
        .sort((a, b) => b.total_score - a.total_score)
        .map((entry, index) => ({ ...entry, rank: index + 1 }))

      console.log('Leaderboard data loaded:', sortedEntries)
      setLeaderboardData(sortedEntries)

      // Find current user's rank
      const currentUserEntry = sortedEntries.find(entry => entry.user_id === user.id)
      setUserRank(currentUserEntry?.rank || null)
      console.log('Current user rank:', currentUserEntry?.rank)

    } catch (error) {
      console.error('Error loading leaderboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-6 w-6 text-yellow-500" />
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />
    if (rank === 3) return <Medal className="h-6 w-6 text-amber-600" />
    return <span className="text-lg font-bold text-gray-600">#{rank}</span>
  }

  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return 'from-yellow-400 to-yellow-600'
    if (rank === 2) return 'from-gray-300 to-gray-500'
    if (rank === 3) return 'from-amber-400 to-amber-600'
    return 'from-blue-400 to-blue-600'
  }

  const getTabData = () => {
    switch (activeTab) {
      case 'games':
        return leaderboardData
          .sort((a, b) => b.games_played - a.games_played)
          .map((entry, index) => ({ ...entry, rank: index + 1 }))
      case 'focus':
        return leaderboardData
          .sort((a, b) => b.focus_time - a.focus_time)
          .map((entry, index) => ({ ...entry, rank: index + 1 }))
      case 'habits':
        return leaderboardData
          .sort((a, b) => b.habits_completed - a.habits_completed)
          .map((entry, index) => ({ ...entry, rank: index + 1 }))
      default:
        return leaderboardData
    }
  }

  const getTabValue = (entry: LeaderboardEntry) => {
    switch (activeTab) {
      case 'games':
        return `${entry.games_played} games`
      case 'focus':
        return `${Math.round(entry.focus_time / 60)} min`
      case 'habits':
        return `${entry.habits_completed} habits`
      default:
        return `${entry.total_score} pts`
    }
  }

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'games': return <Gamepad2 className="h-5 w-5" />
      case 'focus': return <Timer className="h-5 w-5" />
      case 'habits': return <Target className="h-5 w-5" />
      default: return <Trophy className="h-5 w-5" />
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="bg-gray-200 rounded-xl h-16"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const tabData = getTabData()

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Leaderboard</h1>
        <p className="text-xl text-gray-600">See how you rank against other Brain Break Hub users</p>
        {userRank && (
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full">
            <TrendingUp className="h-4 w-4" />
            Your rank: #{userRank}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {[
          { key: 'overall', label: 'Overall', icon: 'overall' },
          { key: 'games', label: 'Games', icon: 'games' },
          { key: 'focus', label: 'Focus Time', icon: 'focus' },
          { key: 'habits', label: 'Habits', icon: 'habits' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeTab === tab.key
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {getTabIcon(tab.icon)}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Leaderboard */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {tabData.length === 0 ? (
          <div className="text-center py-12">
            <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No data yet</h3>
            <p className="text-gray-500">Start playing games, focusing, and building habits to appear on the leaderboard!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {tabData.slice(0, 50).map((entry, index) => (
              <div
                key={entry.id}
                className={`flex items-center justify-between p-6 hover:bg-gray-50 transition-colors duration-200 ${
                  entry.user_id === user.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r ${getRankBadgeColor(entry.rank)}`}>
                    {entry.rank <= 3 ? (
                      getRankIcon(entry.rank)
                    ) : (
                      <span className="text-white font-bold">#{entry.rank}</span>
                    )}
                  </div>
                  <div>
                    <h3 className={`font-semibold ${entry.user_id === user.id ? 'text-blue-900' : 'text-gray-900'}`}>
                      {entry.username}
                      {entry.user_id === user.id && (
                        <span className="ml-2 text-sm text-blue-600 font-normal">(You)</span>
                      )}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {activeTab === 'overall' && `${entry.games_played} games • ${Math.round(entry.focus_time / 60)} min focus • ${entry.habits_completed} habits`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${entry.user_id === user.id ? 'text-blue-900' : 'text-gray-900'}`}>
                    {getTabValue(entry)}
                  </div>
                  {entry.rank <= 3 && (
                    <div className="flex items-center gap-1 mt-1">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm text-yellow-600 font-medium">Top Performer</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User's position if not in top 50 */}
      {userRank && userRank > 50 && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-white font-bold">#{userRank}</span>
              </div>
              <div>
                <h4 className="font-semibold text-blue-900">Your Position</h4>
                <p className="text-sm text-blue-600">Keep going to climb the ranks!</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-blue-900">
                {getTabValue(leaderboardData.find(e => e.user_id === user.id) || {} as LeaderboardEntry)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
