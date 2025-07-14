'use client'

import { useState, useEffect } from 'react'
import { Play, Pause, RotateCcw, Heart, Zap, Moon, Sun } from 'lucide-react'

interface GuidedBreaksProps {
  user: any
}

interface BreakActivity {
  id: string
  name: string
  description: string
  duration: number
  type: 'breathing' | 'meditation' | 'stretching' | 'mindfulness'
  icon: any
  color: string
  instructions: string[]
}

const breakActivities: BreakActivity[] = [
  {
    id: 'deep-breathing',
    name: 'Deep Breathing',
    description: 'Calm your mind with guided breathing exercises',
    duration: 300, // 5 minutes
    type: 'breathing',
    icon: Heart,
    color: 'blue',
    instructions: [
      'Sit comfortably with your back straight',
      'Close your eyes or soften your gaze',
      'Breathe in slowly through your nose for 4 counts',
      'Hold your breath for 4 counts',
      'Exhale slowly through your mouth for 6 counts',
      'Repeat this cycle'
    ]
  },
  {
    id: 'quick-meditation',
    name: 'Quick Meditation',
    description: 'A short mindfulness session to reset your focus',
    duration: 600, // 10 minutes
    type: 'meditation',
    icon: Moon,
    color: 'purple',
    instructions: [
      'Find a quiet, comfortable position',
      'Close your eyes and relax your body',
      'Focus on your natural breathing',
      'When thoughts arise, gently return to your breath',
      'Notice sensations without judgment',
      'Stay present in this moment'
    ]
  },
  {
    id: 'desk-stretches',
    name: 'Desk Stretches',
    description: 'Simple stretches to relieve tension and improve posture',
    duration: 420, // 7 minutes
    type: 'stretching',
    icon: Zap,
    color: 'green',
    instructions: [
      'Neck rolls: Slowly roll your head in circles',
      'Shoulder shrugs: Lift shoulders up and release',
      'Arm circles: Extend arms and make small circles',
      'Spinal twist: Rotate your torso left and right',
      'Wrist stretches: Flex and extend your wrists',
      'Take deep breaths throughout'
    ]
  },
  {
    id: 'mindful-moment',
    name: 'Mindful Moment',
    description: 'Practice present-moment awareness',
    duration: 180, // 3 minutes
    type: 'mindfulness',
    icon: Sun,
    color: 'orange',
    instructions: [
      'Notice 5 things you can see around you',
      'Listen for 4 different sounds',
      'Feel 3 different textures',
      'Identify 2 scents in the air',
      'Notice 1 taste in your mouth',
      'Take a moment to appreciate this awareness'
    ]
  }
]

export default function GuidedBreaks({ user }: GuidedBreaksProps) {
  const [selectedActivity, setSelectedActivity] = useState<BreakActivity | null>(null)
  const [isActive, setIsActive] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false)
      // Activity completed
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, timeLeft])

  const startActivity = (activity: BreakActivity) => {
    setSelectedActivity(activity)
    setTimeLeft(activity.duration)
    setCurrentStep(0)
    setIsActive(true)
  }

  const toggleTimer = () => {
    setIsActive(!isActive)
  }

  const resetTimer = () => {
    if (selectedActivity) {
      setTimeLeft(selectedActivity.duration)
      setIsActive(false)
      setCurrentStep(0)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
      purple: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
      green: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
      orange: 'from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700'
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  if (selectedActivity) {
    const Icon = selectedActivity.icon
    const progress = ((selectedActivity.duration - timeLeft) / selectedActivity.duration) * 100

    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r ${getColorClasses(selectedActivity.color)} mb-4`}>
              <Icon className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedActivity.name}</h1>
            <p className="text-gray-600">{selectedActivity.description}</p>
          </div>

          <div className="text-center mb-8">
            <div className="text-6xl font-bold text-gray-900 mb-4">
              {formatTime(timeLeft)}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
              <div 
                className={`h-3 rounded-full bg-gradient-to-r ${getColorClasses(selectedActivity.color)} transition-all duration-1000`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="flex justify-center gap-4">
              <button
                onClick={toggleTimer}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r ${getColorClasses(selectedActivity.color)} transition-all duration-200 hover:scale-105`}
              >
                {isActive ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                {isActive ? 'Pause' : 'Start'}
              </button>
              <button
                onClick={resetTimer}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition-all duration-200"
              >
                <RotateCcw className="h-5 w-5" />
                Reset
              </button>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Instructions</h3>
            <div className="space-y-3">
              {selectedActivity.instructions.map((instruction, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold text-white bg-gradient-to-r ${getColorClasses(selectedActivity.color)}`}>
                    {index + 1}
                  </div>
                  <p className="text-gray-700">{instruction}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => setSelectedActivity(null)}
              className="text-gray-600 hover:text-gray-800 font-medium"
            >
              ← Back to Activities
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Guided Breaks</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Take a moment to recharge with our guided break activities. Choose from breathing exercises, 
          meditation, stretches, or mindfulness practices.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {breakActivities.map((activity) => {
          const Icon = activity.icon
          return (
            <div
              key={activity.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 cursor-pointer transform hover:-translate-y-2"
              onClick={() => startActivity(activity)}
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${getColorClasses(activity.color)} mb-6`}>
                <Icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{activity.name}</h3>
              <p className="text-gray-600 mb-4">{activity.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">
                  {Math.floor(activity.duration / 60)} minutes
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium text-white bg-gradient-to-r ${getColorClasses(activity.color)}`}>
                  {activity.type}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
