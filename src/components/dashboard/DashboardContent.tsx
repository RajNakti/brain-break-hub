'use client'

import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { Timer, Target, TrendingUp, Play } from 'lucide-react'
import { getGreeting } from '@/lib/utils'
import Link from 'next/link'

interface DashboardContentProps {
  user: User
  profile: any
}

export default function DashboardContent({ user, profile }: DashboardContentProps) {
  const [stats, setStats] = useState({
    todayFocusTime: 0,
    todayBreakTime: 0,
    coinsEarnedToday: 0,
    currentStreak: 0,
    gamesPlayedToday: 0,
    totalCoins: profile?.coins || 0,
    habitsCompletedToday: 0,
    weeklyHabitsCompleted: 0,
    totalGamesPlayed: 0,
    averageGameScore: 0,
    longestFocusSession: 0,
    totalHabits: 0
  })

  const [recentSessions, setRecentSessions] = useState<any[]>([])
  const [recentGameScores, setRecentGameScores] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  if (!user || !profile) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-gray-200 rounded-xl h-32"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  useEffect(() => {
    loadDashboardStats()
    // Set up real-time subscriptions
    const subscription = supabase
      .channel('dashboard_updates')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'focus_sessions' },
        () => loadDashboardStats()
      )
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'game_scores' },
        () => loadDashboardStats()
      )
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'habit_entries' },
        () => loadDashboardStats()
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const loadDashboardStats = async () => {
    try {
      const today = new Date().toISOString().split('T')[0]
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

      // Get today's focus sessions
      const { data: todayFocusSessions } = await supabase
        .from('focus_sessions')
        .select('duration, completed, created_at')
        .eq('user_id', user.id)
        .gte('created_at', `${today}T00:00:00`)
        .lte('created_at', `${today}T23:59:59`)

      // Get all focus sessions for longest session
      const { data: allFocusSessions } = await supabase
        .from('focus_sessions')
        .select('duration')
        .eq('user_id', user.id)
        .eq('completed', true)

      // Get recent focus sessions
      const { data: recentFocusSessions } = await supabase
        .from('focus_sessions')
        .select('duration, completed, created_at, session_type')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)

      // Get today's game scores
      const { data: todayGameScores } = await supabase
        .from('game_scores')
        .select('score, game_type, created_at')
        .eq('user_id', user.id)
        .gte('created_at', `${today}T00:00:00`)
        .lte('created_at', `${today}T23:59:59`)

      // Get all game scores
      const { data: allGameScores } = await supabase
        .from('game_scores')
        .select('score, game_type, created_at')
        .eq('user_id', user.id)

      // Get recent game scores
      const { data: recentGameScoresData } = await supabase
        .from('game_scores')
        .select('score, game_type, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)

      // Get today's habit entries
      const { data: todayHabitEntries } = await supabase
        .from('habit_entries')
        .select('id, habit_id')
        .eq('user_id', user.id)
        .gte('completed_at', `${today}T00:00:00`)
        .lte('completed_at', `${today}T23:59:59`)

      // Get weekly habit entries
      const { data: weeklyHabitEntries } = await supabase
        .from('habit_entries')
        .select('id')
        .eq('user_id', user.id)
        .gte('completed_at', weekAgo)

      // Get total habits
      const { data: totalHabitsData } = await supabase
        .from('habits')
        .select('id')
        .eq('user_id', user.id)

      // Calculate stats
      const todayFocusTime = todayFocusSessions?.reduce((total, session) =>
        session.completed ? total + session.duration : total, 0) || 0

      const longestFocusSession = allFocusSessions?.reduce((max, session) =>
        Math.max(max, session.duration), 0) || 0

      const gamesPlayedToday = todayGameScores?.length || 0
      const totalGamesPlayed = allGameScores?.length || 0
      const averageGameScore = allGameScores && allGameScores.length > 0
        ? Math.round(allGameScores.reduce((sum, score) => sum + score.score, 0) / allGameScores.length)
        : 0

      const habitsCompletedToday = todayHabitEntries?.length || 0
      const weeklyHabitsCompleted = weeklyHabitEntries?.length || 0
      const totalHabits = totalHabitsData?.length || 0

      setStats({
        todayFocusTime,
        todayBreakTime: 0, // We can calculate this later if needed
        coinsEarnedToday: gamesPlayedToday * 10 + Math.floor(todayFocusTime / 60) * 5 + habitsCompletedToday * 15,
        currentStreak: 0, // We can implement streak calculation later
        gamesPlayedToday,
        totalCoins: profile?.coins || 0,
        habitsCompletedToday,
        weeklyHabitsCompleted,
        totalGamesPlayed,
        averageGameScore,
        longestFocusSession,
        totalHabits
      })

      setRecentSessions(recentFocusSessions || [])
      setRecentGameScores(recentGameScoresData || [])
    } catch (error) {
      console.error('Error loading dashboard stats:', error)
      // Set default values on error
      setStats({
        todayFocusTime: 0,
        todayBreakTime: 0,
        coinsEarnedToday: 0,
        currentStreak: 0,
        gamesPlayedToday: 0,
        totalCoins: profile?.coins || 0,
        habitsCompletedToday: 0,
        weeklyHabitsCompleted: 0,
        totalGamesPlayed: 0,
        averageGameScore: 0,
        longestFocusSession: 0,
        totalHabits: 0
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">{/* Header is now in DashboardWrapper */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 animate-fade-in">
            {getGreeting()}, <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{profile?.full_name || user.email?.split('@')[0]}</span>!
          </h1>
          <p className="text-gray-600 text-lg animate-fade-in-delay">Ready for a productive day? Let's get started!</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="stats-card animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">Today's Focus Time</p>
                <p className="text-3xl font-bold text-blue-600">{Math.round(stats.todayFocusTime / 60)}m</p>
              </div>
              <div className="bg-gradient-to-r from-blue-400 to-blue-600 p-3 rounded-full flex-shrink-0">
                <Timer className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          <div className="stats-card animate-fade-in-delay">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">Games Played</p>
                <p className="text-3xl font-bold text-green-600">{stats.gamesPlayedToday}</p>
              </div>
              <div className="bg-gradient-to-r from-green-400 to-green-600 p-3 rounded-full flex-shrink-0">
                <Play className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          <div className="stats-card animate-fade-in-delay-2">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">Current Streak</p>
                <p className="text-3xl font-bold text-orange-600">{stats.currentStreak} days</p>
              </div>
              <div className="bg-gradient-to-r from-orange-400 to-orange-600 p-3 rounded-full flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          <div className="stats-card animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">Habits Today</p>
                <p className="text-3xl font-bold text-purple-600">{stats.habitsCompletedToday}</p>
              </div>
              <div className="bg-gradient-to-r from-purple-400 to-purple-600 p-3 rounded-full flex-shrink-0">
                <Target className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          <div className="stats-card animate-fade-in-delay">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">Average Score</p>
                <p className="text-3xl font-bold text-indigo-600">{stats.averageGameScore}</p>
              </div>
              <div className="bg-gradient-to-r from-indigo-400 to-indigo-600 p-3 rounded-full flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          <div className="stats-card animate-fade-in-delay-2">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">Longest Focus</p>
                <p className="text-3xl font-bold text-red-600">{Math.round(stats.longestFocusSession / 60)}m</p>
              </div>
              <div className="bg-gradient-to-r from-red-400 to-red-600 p-3 rounded-full flex-shrink-0">
                <Timer className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/focus" className="group bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 text-left block border border-blue-200">
            <div className="bg-blue-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors duration-300 shadow-lg">
              <Timer className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors duration-300">Start Focus Session</h3>
            <p className="text-gray-600 text-sm group-hover:text-blue-600 transition-colors duration-300">Begin a Pomodoro timer session</p>
          </Link>

          <Link href="/games" className="group bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 text-left block border border-green-200">
            <div className="bg-green-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-600 transition-colors duration-300 shadow-lg">
              <Play className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-green-700 transition-colors duration-300">Play a Game</h3>
            <p className="text-gray-600 text-sm group-hover:text-green-600 transition-colors duration-300">Challenge your mind with brain games</p>
          </Link>

          <Link href="/breaks" className="group bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 text-left block border border-purple-200">
            <div className="bg-purple-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-600 transition-colors duration-300 shadow-lg">
              <Target className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-purple-700 transition-colors duration-300">Take a Guided Break</h3>
            <p className="text-gray-600 text-sm group-hover:text-purple-600 transition-colors duration-300">Relax with breathing exercises</p>
          </Link>

          <Link href="/habits" className="group bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 text-left block border border-orange-200">
            <div className="bg-orange-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-600 transition-colors duration-300 shadow-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-700 transition-colors duration-300">Track Habits</h3>
            <p className="text-gray-600 text-sm group-hover:text-orange-600 transition-colors duration-300">Manage your daily habits</p>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Focus Sessions</h3>
            <div className="space-y-3">
              {recentSessions.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  <p className="text-sm">No recent sessions</p>
                  <Link href="/focus" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Start your first session
                  </Link>
                </div>
              ) : (
                recentSessions.map((session: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 capitalize">
                        {session.session_type || 'Focus Session'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {Math.round(session.duration / 60)} minutes • {session.completed ? 'Completed' : 'Incomplete'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(session.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className={session.completed ? 'text-green-600' : 'text-orange-600'}>
                      <Timer className="h-5 w-5" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Game Scores</h3>
            <div className="space-y-3">
              {recentGameScores.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  <p className="text-sm">No games played yet</p>
                  <Link href="/games" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Play your first game
                  </Link>
                </div>
              ) : (
                recentGameScores.map((score: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 capitalize">{score.game_type.replace('-', ' ')}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(score.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">{score.score}</p>
                      <p className="text-xs text-gray-500">points</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
