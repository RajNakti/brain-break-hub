'use client'

import { useState, useEffect, useRef } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { Zap, RotateCcw, Home, Trophy, Timer, Target } from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'

interface ReactionTestProps {
  user: User
}

type GameState = 'instructions' | 'waiting' | 'ready' | 'clicked' | 'results'

export default function ReactionTest({ user }: ReactionTestProps) {
  const [gameState, setGameState] = useState<GameState>('instructions')
  const [reactionTimes, setReactionTimes] = useState<number[]>([])
  const [currentRound, setCurrentRound] = useState(0)
  const [startTime, setStartTime] = useState<number>(0)
  const [waitTimeout, setWaitTimeout] = useState<NodeJS.Timeout | null>(null)
  const [averageTime, setAverageTime] = useState<number>(0)
  const [bestTime, setBestTime] = useState<number>(0)
  const [score, setScore] = useState<number>(0)
  
  const totalRounds = 5
  const gameAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    return () => {
      if (waitTimeout) {
        clearTimeout(waitTimeout)
      }
    }
  }, [waitTimeout])

  useEffect(() => {
    if (reactionTimes.length === totalRounds) {
      calculateResults()
    }
  }, [reactionTimes])

  const startGame = () => {
    setGameState('waiting')
    setReactionTimes([])
    setCurrentRound(0)
    startRound()
  }

  const startRound = () => {
    setGameState('waiting')
    
    // Random delay between 1-5 seconds
    const delay = Math.random() * 4000 + 1000
    
    const timeout = setTimeout(() => {
      setStartTime(performance.now())
      setGameState('ready')
    }, delay)
    
    setWaitTimeout(timeout)
  }

  const handleClick = () => {
    if (gameState === 'waiting') {
      // Clicked too early
      if (waitTimeout) {
        clearTimeout(waitTimeout)
        setWaitTimeout(null)
      }
      setGameState('instructions')
      toast.error('Too early! Wait for the green signal.')
      return
    }

    if (gameState === 'ready') {
      const reactionTime = performance.now() - startTime
      const newReactionTimes = [...reactionTimes, reactionTime]
      setReactionTimes(newReactionTimes)
      setCurrentRound(prev => prev + 1)
      setGameState('clicked')

      // Show reaction time for this round
      toast.success(`${Math.round(reactionTime)}ms`)

      // Start next round after a short delay
      if (newReactionTimes.length < totalRounds) {
        setTimeout(() => {
          startRound()
        }, 1500)
      }
    }
  }

  const calculateResults = async () => {
    const avg = reactionTimes.reduce((sum, time) => sum + time, 0) / reactionTimes.length
    const best = Math.min(...reactionTimes)
    
    setAverageTime(avg)
    setBestTime(best)
    
    // Calculate score (lower reaction time = higher score)
    const baseScore = Math.max(0, 1000 - avg)
    const consistencyBonus = Math.max(0, 200 - (Math.max(...reactionTimes) - best))
    const finalScore = Math.round(baseScore + consistencyBonus)
    
    setScore(finalScore)
    setGameState('results')

    // Save score to database
    try {
      await supabase.from('game_scores').insert({
        user_id: user.id,
        game_type: 'reaction',
        score: finalScore,
        difficulty: 'medium', // Reaction test has fixed difficulty
        duration: Math.round(avg / 1000) // Average reaction time in seconds
      })
      
      toast.success('Results saved!')
    } catch (error) {
      console.error('Error saving score:', error)
      toast.error('Failed to save results.')
    }
  }

  const resetGame = () => {
    if (waitTimeout) {
      clearTimeout(waitTimeout)
      setWaitTimeout(null)
    }
    setGameState('instructions')
    setReactionTimes([])
    setCurrentRound(0)
    setAverageTime(0)
    setBestTime(0)
    setScore(0)
  }

  const getPerformanceRating = (time: number) => {
    if (time < 200) return { rating: 'Excellent', color: 'text-green-600' }
    if (time < 250) return { rating: 'Good', color: 'text-blue-600' }
    if (time < 300) return { rating: 'Average', color: 'text-yellow-600' }
    if (time < 400) return { rating: 'Below Average', color: 'text-orange-600' }
    return { rating: 'Slow', color: 'text-red-600' }
  }

  const getBackgroundColor = () => {
    switch (gameState) {
      case 'waiting':
        return 'bg-red-500'
      case 'ready':
        return 'bg-green-500'
      case 'clicked':
        return 'bg-blue-500'
      default:
        return 'bg-gray-200'
    }
  }

  const getInstructions = () => {
    switch (gameState) {
      case 'waiting':
        return 'Wait for GREEN...'
      case 'ready':
        return 'CLICK NOW!'
      case 'clicked':
        return `Round ${currentRound}/${totalRounds} Complete`
      default:
        return 'Click to start'
    }
  }

  if (gameState === 'instructions') {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <Zap className="h-16 w-16 text-yellow-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reaction Test</h1>
          <p className="text-gray-600">Test your reflexes and reaction time</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">How to Play</h3>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-start space-x-3">
              <div className="bg-red-100 text-red-600 rounded-full p-2 flex-shrink-0">
                <span className="text-sm font-bold">1</span>
              </div>
              <div>
                <p className="text-gray-700">Click the "Start Test" button to begin</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="bg-yellow-100 text-yellow-600 rounded-full p-2 flex-shrink-0">
                <span className="text-sm font-bold">2</span>
              </div>
              <div>
                <p className="text-gray-700">Wait for the screen to turn <span className="font-semibold text-green-600">GREEN</span></p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="bg-green-100 text-green-600 rounded-full p-2 flex-shrink-0">
                <span className="text-sm font-bold">3</span>
              </div>
              <div>
                <p className="text-gray-700">Click as fast as possible when you see green!</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="bg-blue-100 text-blue-600 rounded-full p-2 flex-shrink-0">
                <span className="text-sm font-bold">4</span>
              </div>
              <div>
                <p className="text-gray-700">Complete {totalRounds} rounds for your final score</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800 text-sm">
              <strong>Warning:</strong> Don't click too early! If you click before the screen turns green, 
              you'll have to start over.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={startGame}
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Start Test
            </button>
            <Link
              href="/games"
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors duration-200 text-center block"
            >
              Back to Games
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (gameState === 'results') {
    const avgRating = getPerformanceRating(averageTime)
    const bestRating = getPerformanceRating(bestTime)

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <Trophy className="h-16 w-16 text-yellow-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Test Complete!</h1>
          <p className="text-gray-600">Here are your reaction test results</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-4xl font-bold text-yellow-600 mb-2">{score}</div>
            <div className="text-gray-600">Final Score</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {Math.round(averageTime)}ms
              </div>
              <div className="text-sm text-gray-600 mb-2">Average Time</div>
              <div className={`text-sm font-medium ${avgRating.color}`}>
                {avgRating.rating}
              </div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {Math.round(bestTime)}ms
              </div>
              <div className="text-sm text-gray-600 mb-2">Best Time</div>
              <div className={`text-sm font-medium ${bestRating.color}`}>
                {bestRating.rating}
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Individual Rounds</h4>
            <div className="grid grid-cols-5 gap-2">
              {reactionTimes.map((time, index) => (
                <div key={index} className="text-center p-2 bg-gray-100 rounded">
                  <div className="text-sm font-medium text-gray-900">
                    {Math.round(time)}ms
                  </div>
                  <div className="text-xs text-gray-600">Round {index + 1}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={resetGame}
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Test Again
            </button>
            <Link
              href="/games"
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors duration-200 text-center block"
            >
              Back to Games
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Game Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reaction Test</h1>
          <p className="text-gray-600">Round {currentRound + 1} of {totalRounds}</p>
        </div>
        <div className="flex space-x-4">
          <Link
            href="/games"
            className="flex items-center space-x-2 text-gray-600 hover:text-yellow-600 transition-colors"
          >
            <Home className="h-4 w-4" />
            <span>Games</span>
          </Link>
          <button
            onClick={resetGame}
            className="flex items-center space-x-2 text-gray-600 hover:text-yellow-600 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="bg-gray-200 rounded-full h-2">
          <div 
            className="bg-yellow-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentRound / totalRounds) * 100}%` }}
          />
        </div>
      </div>

      {/* Game Area */}
      <div 
        ref={gameAreaRef}
        onClick={handleClick}
        className={`${getBackgroundColor()} rounded-xl shadow-lg cursor-pointer transition-all duration-200 flex items-center justify-center min-h-96 select-none`}
      >
        <div className="text-center text-white">
          <div className="text-4xl md:text-6xl font-bold mb-4">
            {getInstructions()}
          </div>
          {gameState === 'waiting' && (
            <div className="text-lg opacity-75">
              Don't click yet...
            </div>
          )}
          {gameState === 'ready' && (
            <div className="text-lg opacity-75">
              Click anywhere!
            </div>
          )}
          {gameState === 'clicked' && reactionTimes.length > 0 && (
            <div className="text-lg opacity-75">
              {Math.round(reactionTimes[reactionTimes.length - 1])}ms
            </div>
          )}
        </div>
      </div>

      {/* Previous Times */}
      {reactionTimes.length > 0 && (
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Previous Times</h3>
          <div className="flex flex-wrap gap-2">
            {reactionTimes.map((time, index) => (
              <div key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                Round {index + 1}: {Math.round(time)}ms
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
