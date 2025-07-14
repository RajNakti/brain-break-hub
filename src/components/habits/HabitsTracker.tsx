'use client'

import { useState, useEffect } from 'react'
import { Plus, Check, X, Target, TrendingUp, Calendar, Flame } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

interface HabitsTrackerProps {
  user: any
}

interface Habit {
  id: string
  name: string
  description: string
  target_frequency: number // times per week
  color: string
  created_at: string
  user_id: string
}

interface HabitEntry {
  id: string
  habit_id: string
  completed_at: string
  user_id: string
}

const habitColors = [
  'blue', 'green', 'purple', 'orange', 'red', 'pink', 'indigo', 'teal'
]

export default function HabitsTracker({ user }: HabitsTrackerProps) {
  const [habits, setHabits] = useState<Habit[]>([])
  const [habitEntries, setHabitEntries] = useState<HabitEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newHabit, setNewHabit] = useState({
    name: '',
    description: '',
    target_frequency: 7,
    color: 'blue'
  })

  useEffect(() => {
    loadHabits()
    loadHabitEntries()
  }, [user])

  const loadHabits = async () => {
    try {
      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase error loading habits:', error)
        throw error
      }
      setHabits(data || [])
    } catch (error) {
      console.error('Error loading habits:', error)
      // Set empty array on error to prevent crashes
      setHabits([])
      toast.error('Failed to load habits. Please try refreshing the page.')
    }
  }

  const loadHabitEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('habit_entries')
        .select('*')
        .eq('user_id', user.id)
        .gte('completed_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()) // Last 30 days

      if (error) {
        console.error('Supabase error loading habit entries:', error)
        throw error
      }
      setHabitEntries(data || [])
    } catch (error) {
      console.error('Error loading habit entries:', error)
      // Set empty array on error to prevent crashes
      setHabitEntries([])
    } finally {
      setLoading(false)
    }
  }

  const addHabit = async () => {
    if (!newHabit.name.trim()) {
      toast.error('Please enter a habit name')
      return
    }

    try {
      const { data, error } = await supabase
        .from('habits')
        .insert([{
          title: newHabit.name,
          name: newHabit.name,
          description: newHabit.description,
          target_per_week: newHabit.target_frequency,
          target_frequency: newHabit.target_frequency,
          color: newHabit.color,
          user_id: user.id,
          streak: 0
        }])
        .select()
        .single()

      if (error) throw error

      setHabits([data, ...habits])
      setNewHabit({ name: '', description: '', target_frequency: 7, color: 'blue' })
      setShowAddForm(false)
      toast.success('Habit added successfully!')
    } catch (error) {
      console.error('Error adding habit:', error)
      toast.error('Failed to add habit')
    }
  }

  const toggleHabitToday = async (habitId: string) => {
    const today = new Date().toISOString().split('T')[0]
    const existingEntry = habitEntries.find(
      entry => entry.habit_id === habitId && entry.completed_at.startsWith(today)
    )

    try {
      if (existingEntry) {
        // Remove entry
        const { error } = await supabase
          .from('habit_entries')
          .delete()
          .eq('id', existingEntry.id)

        if (error) throw error

        setHabitEntries(habitEntries.filter(entry => entry.id !== existingEntry.id))
        toast.success('Habit unmarked for today')
      } else {
        // Add entry
        const { data, error } = await supabase
          .from('habit_entries')
          .insert([{
            habit_id: habitId,
            user_id: user.id,
            completed_at: new Date().toISOString()
          }])
          .select()
          .single()

        if (error) throw error

        setHabitEntries([...habitEntries, data])
        toast.success('Habit completed for today!')
      }
    } catch (error) {
      console.error('Error toggling habit:', error)
      toast.error('Failed to update habit')
    }
  }

  const getHabitStreak = (habitId: string) => {
    const entries = habitEntries
      .filter(entry => entry.habit_id === habitId)
      .sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())

    if (entries.length === 0) return 0

    let streak = 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Check if completed today or yesterday to start streak
    const latestEntry = new Date(entries[0].completed_at)
    latestEntry.setHours(0, 0, 0, 0)

    const daysSinceLatest = Math.floor((today.getTime() - latestEntry.getTime()) / (1000 * 60 * 60 * 24))

    if (daysSinceLatest > 1) return 0 // Streak broken

    // Count consecutive days
    for (let i = 0; i < entries.length; i++) {
      const entryDate = new Date(entries[i].completed_at)
      entryDate.setHours(0, 0, 0, 0)

      const expectedDate = new Date(today.getTime() - (streak * 24 * 60 * 60 * 1000))
      expectedDate.setHours(0, 0, 0, 0)

      if (entryDate.getTime() === expectedDate.getTime()) {
        streak++
      } else {
        break
      }
    }

    return streak
  }

  const getWeeklyProgress = (habitId: string) => {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const weeklyEntries = habitEntries.filter(
      entry => entry.habit_id === habitId && new Date(entry.completed_at) >= weekAgo
    )
    return weeklyEntries.length
  }

  const isCompletedToday = (habitId: string) => {
    const today = new Date().toISOString().split('T')[0]
    return habitEntries.some(
      entry => entry.habit_id === habitId && entry.completed_at.startsWith(today)
    )
  }

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600',
      orange: 'from-orange-500 to-orange-600',
      red: 'from-red-500 to-red-600',
      pink: 'from-pink-500 to-pink-600',
      indigo: 'from-indigo-500 to-indigo-600',
      teal: 'from-teal-500 to-teal-600'
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-gray-200 rounded-xl h-48"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Habits Tracker</h1>
          <p className="text-gray-600">Build positive habits and track your progress</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105"
        >
          <Plus className="h-5 w-5" />
          Add Habit
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Add New Habit</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Habit Name</label>
              <input
                type="text"
                value={newHabit.name}
                onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Drink 8 glasses of water"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Target per Week</label>
              <input
                type="number"
                value={newHabit.target_frequency || ''}
                onChange={(e) => setNewHabit({ ...newHabit, target_frequency: parseInt(e.target.value) || 1 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
                max="7"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
            <textarea
              value={newHabit.description}
              onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={2}
              placeholder="Why is this habit important to you?"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
            <div className="flex gap-2">
              {habitColors.map(color => (
                <button
                  key={color}
                  onClick={() => setNewHabit({ ...newHabit, color })}
                  className={`w-8 h-8 rounded-full bg-gradient-to-r ${getColorClasses(color)} ${
                    newHabit.color === color ? 'ring-2 ring-gray-400' : ''
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={addHabit}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
            >
              Add Habit
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {habits.length === 0 ? (
        <div className="text-center py-12">
          <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No habits yet</h3>
          <p className="text-gray-500 mb-6">Start building positive habits by adding your first one!</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
          >
            Add Your First Habit
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {habits.map(habit => {
            const streak = getHabitStreak(habit.id)
            const weeklyProgress = getWeeklyProgress(habit.id)
            const completedToday = isCompletedToday(habit.id)

            return (
              <div key={habit.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${getColorClasses(habit.color)}`}></div>
                  <button
                    onClick={() => toggleHabitToday(habit.id)}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      completedToday
                        ? 'bg-green-100 text-green-600 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                    }`}
                  >
                    <Check className="h-5 w-5" />
                  </button>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">{habit.name}</h3>
                {habit.description && (
                  <p className="text-gray-600 text-sm mb-4">{habit.description}</p>
                )}

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Flame className="h-4 w-4 text-orange-500" />
                      <span className="text-sm text-gray-600">Streak</span>
                    </div>
                    <span className="font-semibold text-gray-900">{streak} days</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <span className="text-sm text-gray-600">This Week</span>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {weeklyProgress}/{habit.target_frequency}
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full bg-gradient-to-r ${getColorClasses(habit.color)} transition-all duration-300`}
                      style={{ width: `${Math.min((weeklyProgress / habit.target_frequency) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
