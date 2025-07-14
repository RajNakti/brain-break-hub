'use client'

import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { User as UserIcon, Mail, Calendar, Trophy, Target, Zap, Save, Edit3 } from 'lucide-react'
import toast from 'react-hot-toast'

interface ProfileContentProps {
  user: User
}

interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  coins: number
  created_at: string
  updated_at: string
}

interface Stats {
  totalGamesPlayed: number
  totalFocusTime: number
  totalHabitsCompleted: number
  averageGameScore: number
  longestStreak: number
  totalCoins: number
}

export default function ProfileContent({ user }: ProfileContentProps) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [stats, setStats] = useState<Stats>({
    totalGamesPlayed: 0,
    totalFocusTime: 0,
    totalHabitsCompleted: 0,
    averageGameScore: 0,
    longestStreak: 0,
    totalCoins: 0
  })
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    full_name: '',
    email: ''
  })

  useEffect(() => {
    loadProfile()
    loadStats()
  }, [user])

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) throw error
      
      setProfile(data)
      setEditForm({
        full_name: data.full_name || '',
        email: data.email || user.email || ''
      })
    } catch (error) {
      console.error('Error loading profile:', error)
      toast.error('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      // Get game stats
      const { data: gameScores } = await supabase
        .from('game_scores')
        .select('score')
        .eq('user_id', user.id)

      // Get focus session stats
      const { data: focusSessions } = await supabase
        .from('focus_sessions')
        .select('duration')
        .eq('user_id', user.id)
        .eq('completed', true)

      // Get habit stats
      const { data: habitEntries } = await supabase
        .from('habit_entries')
        .select('id')
        .eq('user_id', user.id)

      const totalGamesPlayed = gameScores?.length || 0
      const totalFocusTime = focusSessions?.reduce((sum, session) => sum + session.duration, 0) || 0
      const totalHabitsCompleted = habitEntries?.length || 0
      const averageGameScore = totalGamesPlayed > 0 
        ? Math.round(gameScores!.reduce((sum, score) => sum + score.score, 0) / totalGamesPlayed)
        : 0

      setStats({
        totalGamesPlayed,
        totalFocusTime,
        totalHabitsCompleted,
        averageGameScore,
        longestStreak: 0, // TODO: Calculate streak
        totalCoins: profile?.coins || 0
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const updateProfile = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: editForm.full_name,
          email: editForm.email
        })
        .eq('id', user.id)

      if (error) throw error

      setProfile(prev => prev ? {
        ...prev,
        full_name: editForm.full_name,
        email: editForm.email
      } : null)
      
      setEditing(false)
      toast.success('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    }
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-6">
            <div className="bg-gradient-to-r from-blue-400 to-purple-600 p-4 rounded-full">
              <UserIcon className="h-12 w-12 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {profile?.full_name || 'User Profile'}
              </h1>
              <p className="text-gray-600 flex items-center gap-2 mt-1">
                <Mail className="h-4 w-4" />
                {profile?.email}
              </p>
              <p className="text-gray-500 flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4" />
                Member since {profile?.created_at ? formatDate(profile.created_at) : 'Unknown'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setEditing(!editing)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit3 className="h-4 w-4" />
            {editing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {editing && (
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Profile</h3>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editForm.full_name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, full_name: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
            </div>
            <button
              onClick={updateProfile}
              className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </button>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="bg-blue-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Trophy className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.totalGamesPlayed}</h3>
          <p className="text-gray-600">Games Played</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="bg-green-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Zap className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{formatTime(Math.round(stats.totalFocusTime / 60))}</h3>
          <p className="text-gray-600">Focus Time</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="bg-purple-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Target className="h-8 w-8 text-purple-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.totalHabitsCompleted}</h3>
          <p className="text-gray-600">Habits Completed</p>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Performance</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Game Score</span>
              <span className="font-semibold text-gray-900">{stats.averageGameScore}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Coins Earned</span>
              <span className="font-semibold text-gray-900">{stats.totalCoins}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Longest Streak</span>
              <span className="font-semibold text-gray-900">{stats.longestStreak} days</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Account Settings</h3>
          <div className="space-y-4">
            <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <span className="font-medium text-gray-900">Change Password</span>
              <p className="text-sm text-gray-600">Update your account password</p>
            </button>
            <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <span className="font-medium text-gray-900">Export Data</span>
              <p className="text-sm text-gray-600">Download your personal data</p>
            </button>
            <button className="w-full text-left px-4 py-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors text-red-600">
              <span className="font-medium">Delete Account</span>
              <p className="text-sm text-red-500">Permanently delete your account</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
