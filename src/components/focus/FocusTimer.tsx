'use client'

import { useState, useEffect, useRef } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { Play, Pause, Square, Settings, Timer, Coffee } from 'lucide-react'
import { formatTime } from '@/lib/utils'
import toast from 'react-hot-toast'

interface FocusTimerProps {
  user: User
}

type TimerState = 'idle' | 'running' | 'paused' | 'break'
type SessionType = 'focus' | 'short-break' | 'long-break'

export default function FocusTimer({ user }: FocusTimerProps) {
  const [taskName, setTaskName] = useState('')
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes in seconds
  const [timerState, setTimerState] = useState<TimerState>('idle')
  const [sessionType, setSessionType] = useState<SessionType>('focus')
  const [sessionCount, setSessionCount] = useState(0)
  const [settings, setSettings] = useState({
    focusTime: 25,
    shortBreak: 5,
    longBreak: 15,
    sessionsUntilLongBreak: 4,
  })
  const [showSettings, setShowSettings] = useState(false)
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<Date | null>(null)

  useEffect(() => {
    if (timerState === 'running') {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerComplete()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [timerState])

  const handleTimerComplete = async () => {
    setTimerState('idle')
    
    if (sessionType === 'focus') {
      // Save focus session to database
      if (taskName.trim()) {
        const duration = settings.focusTime
        await supabase.from('focus_sessions').insert({
          user_id: user.id,
          task_name: taskName,
          duration,
          completed: true,
        })
      }
      
      setSessionCount(prev => prev + 1)
      
      // Determine next break type
      const nextBreakType = (sessionCount + 1) % settings.sessionsUntilLongBreak === 0 
        ? 'long-break' 
        : 'short-break'
      
      setSessionType(nextBreakType)
      setTimeLeft(nextBreakType === 'long-break' ? settings.longBreak * 60 : settings.shortBreak * 60)
      
      toast.success('Focus session completed! Time for a break.')
      
      // Request notification permission and show notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Focus Session Complete!', {
          body: 'Great job! Time for a well-deserved break.',
          icon: '/favicon.ico'
        })
      }
    } else {
      // Break completed
      setSessionType('focus')
      setTimeLeft(settings.focusTime * 60)
      toast.success('Break time over! Ready for another focus session?')
      
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Break Complete!', {
          body: 'Ready to get back to work?',
          icon: '/favicon.ico'
        })
      }
    }
  }

  const startTimer = () => {
    if (sessionType === 'focus' && !taskName.trim()) {
      toast.error('Please enter a task name before starting')
      return
    }
    
    startTimeRef.current = new Date()
    setTimerState('running')
    
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }

  const pauseTimer = () => {
    setTimerState('paused')
  }

  const stopTimer = () => {
    setTimerState('idle')
    setTimeLeft(sessionType === 'focus' ? settings.focusTime * 60 : 
                sessionType === 'short-break' ? settings.shortBreak * 60 : 
                settings.longBreak * 60)
  }

  const resetToFocus = () => {
    setTimerState('idle')
    setSessionType('focus')
    setTimeLeft(settings.focusTime * 60)
    setTaskName('')
  }

  const updateSettings = (newSettings: typeof settings) => {
    setSettings(newSettings)
    if (timerState === 'idle') {
      setTimeLeft(sessionType === 'focus' ? newSettings.focusTime * 60 : 
                  sessionType === 'short-break' ? newSettings.shortBreak * 60 : 
                  newSettings.longBreak * 60)
    }
    setShowSettings(false)
    toast.success('Settings updated!')
  }

  const getSessionTitle = () => {
    switch (sessionType) {
      case 'focus':
        return 'Focus Session'
      case 'short-break':
        return 'Short Break'
      case 'long-break':
        return 'Long Break'
    }
  }

  const getSessionColor = () => {
    switch (sessionType) {
      case 'focus':
        return 'text-blue-600'
      case 'short-break':
        return 'text-green-600'
      case 'long-break':
        return 'text-purple-600'
    }
  }

  const getBackgroundColor = () => {
    switch (sessionType) {
      case 'focus':
        return 'from-blue-50 via-indigo-50 to-purple-50'
      case 'short-break':
        return 'from-green-50 via-emerald-50 to-teal-50'
      case 'long-break':
        return 'from-purple-50 via-violet-50 to-indigo-50'
    }
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getBackgroundColor()} transition-all duration-1000`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Focus Timer</h1>
          <p className="text-gray-600">Stay productive with the Pomodoro Technique</p>
        </div>

        {/* Main Timer Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="text-center">
            {/* Session Type */}
            <div className="flex items-center justify-center mb-6">
              {sessionType === 'focus' ? (
                <Timer className={`h-8 w-8 ${getSessionColor()} mr-3`} />
              ) : (
                <Coffee className={`h-8 w-8 ${getSessionColor()} mr-3`} />
              )}
              <h2 className={`text-2xl font-semibold ${getSessionColor()}`}>
                {getSessionTitle()}
              </h2>
            </div>

            {/* Task Input (only for focus sessions) */}
            {sessionType === 'focus' && (
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="What are you working on?"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  disabled={timerState === 'running'}
                  className="w-full max-w-md px-4 py-2 text-center text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                />
              </div>
            )}

            {/* Timer Display */}
            <div className="mb-8">
              <div className="text-6xl md:text-8xl font-mono font-bold text-gray-900 mb-4">
                {formatTime(timeLeft)}
              </div>
              <div className="text-gray-600">
                Session {sessionCount + 1} • {sessionType === 'focus' ? 'Focus' : 'Break'} Time
              </div>
            </div>

            {/* Timer Controls */}
            <div className="flex justify-center space-x-4 mb-6">
              {timerState === 'idle' || timerState === 'paused' ? (
                <button
                  onClick={startTimer}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  <Play className="h-5 w-5" />
                  <span>{timerState === 'paused' ? 'Resume' : 'Start'}</span>
                </button>
              ) : (
                <button
                  onClick={pauseTimer}
                  className="flex items-center space-x-2 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  <Pause className="h-5 w-5" />
                  <span>Pause</span>
                </button>
              )}
              
              <button
                onClick={stopTimer}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                <Square className="h-5 w-5" />
                <span>Stop</span>
              </button>
            </div>

            {/* Additional Controls */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={resetToFocus}
                className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
              >
                Reset to Focus
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors duration-200"
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">{sessionCount}</div>
            <div className="text-gray-600">Sessions Completed</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {Math.floor(sessionCount * settings.focusTime / 60)}h {(sessionCount * settings.focusTime) % 60}m
            </div>
            <div className="text-gray-600">Total Focus Time</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="text-2xl font-bold text-purple-600 mb-2">
              {Math.ceil(sessionCount / settings.sessionsUntilLongBreak)}
            </div>
            <div className="text-gray-600">Cycles Completed</div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Timer Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Focus Time (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={settings.focusTime}
                  onChange={(e) => setSettings({...settings, focusTime: parseInt(e.target.value) || 25})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Short Break (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={settings.shortBreak}
                  onChange={(e) => setSettings({...settings, shortBreak: parseInt(e.target.value) || 5})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Long Break (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={settings.longBreak}
                  onChange={(e) => setSettings({...settings, longBreak: parseInt(e.target.value) || 15})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sessions until Long Break
                </label>
                <input
                  type="number"
                  min="2"
                  max="10"
                  value={settings.sessionsUntilLongBreak}
                  onChange={(e) => setSettings({...settings, sessionsUntilLongBreak: parseInt(e.target.value) || 4})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => updateSettings(settings)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Save
              </button>
              <button
                onClick={() => setShowSettings(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
