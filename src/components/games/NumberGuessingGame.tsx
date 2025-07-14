'use client'

import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { RotateCcw, Home, Trophy, Timer, Target, Hash } from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'

interface NumberGuessingGameProps {
  user: User
}

type GameState = 'setup' | 'playing' | 'completed'
type Difficulty = 'easy' | 'medium' | 'hard'

export default function NumberGuessingGame({ user }: NumberGuessingGameProps) {
  const [gameState, setGameState] = useState<GameState>('setup')
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [targetNumber, setTargetNumber] = useState(0)
  const [guess, setGuess] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [maxAttempts, setMaxAttempts] = useState(10)
  const [range, setRange] = useState({ min: 1, max: 100 })
  const [score, setScore] = useState(0)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [gameStartTime, setGameStartTime] = useState<number>(0)
  const [guessHistory, setGuessHistory] = useState<{ guess: number; hint: string }[]>([])
  const [gameWon, setGameWon] = useState(false)

  const difficultySettings = {
    easy: { min: 1, max: 50, attempts: 10, baseScore: 100 },
    medium: { min: 1, max: 100, attempts: 8, baseScore: 200 },
    hard: { min: 1, max: 200, attempts: 6, baseScore: 300 }
  }

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (gameState === 'playing') {
      interval = setInterval(() => {
        setTimeElapsed(Math.floor((Date.now() - gameStartTime) / 1000))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [gameState, gameStartTime])

  const startGame = () => {
    const settings = difficultySettings[difficulty]
    const newTargetNumber = Math.floor(Math.random() * (settings.max - settings.min + 1)) + settings.min
    
    setTargetNumber(newTargetNumber)
    setRange({ min: settings.min, max: settings.max })
    setMaxAttempts(settings.attempts)
    setAttempts(0)
    setGuess('')
    setGuessHistory([])
    setTimeElapsed(0)
    setGameStartTime(Date.now())
    setGameWon(false)
    setGameState('playing')
  }

  const makeGuess = () => {
    const guessNumber = parseInt(guess)
    
    if (isNaN(guessNumber) || guessNumber < range.min || guessNumber > range.max) {
      toast.error(`Please enter a number between ${range.min} and ${range.max}`)
      return
    }

    const newAttempts = attempts + 1
    setAttempts(newAttempts)

    let hint = ''
    if (guessNumber === targetNumber) {
      // Correct guess!
      hint = '🎉 Correct!'
      setGameWon(true)
      endGame(true)
    } else if (guessNumber < targetNumber) {
      hint = '📈 Too low!'
    } else {
      hint = '📉 Too high!'
    }

    setGuessHistory(prev => [...prev, { guess: guessNumber, hint }])
    setGuess('')

    if (guessNumber !== targetNumber && newAttempts >= maxAttempts) {
      // Game over
      endGame(false)
    }
  }

  const endGame = (won: boolean) => {
    setGameState('completed')
    
    let gameScore = 0
    if (won) {
      const settings = difficultySettings[difficulty]
      const attemptsBonus = Math.max(0, (maxAttempts - attempts) * 20)
      const timeBonus = Math.max(0, 120 - timeElapsed) * 2
      gameScore = settings.baseScore + attemptsBonus + timeBonus
      
      toast.success(`Congratulations! +${gameScore} points`)
    } else {
      toast.error(`Game over! The number was ${targetNumber}`)
    }
    
    setScore(gameScore)
    saveScore(gameScore)
  }

  const saveScore = async (gameScore: number) => {
    try {
      await supabase.from('game_scores').insert({
        user_id: user.id,
        game_type: 'number-guessing',
        score: gameScore,
        difficulty,
        duration: timeElapsed
      })
    } catch (error) {
      console.error('Error saving score:', error)
    }
  }

  const resetGame = () => {
    setGameState('setup')
    setScore(0)
    setAttempts(0)
    setGuess('')
    setGuessHistory([])
    setTimeElapsed(0)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      makeGuess()
    }
  }

  if (gameState === 'setup') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-green-400 to-blue-600 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <Target className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Number Guessing Game</h1>
          <p className="text-gray-600 text-lg">Can you guess the secret number?</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Game Settings</h2>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Difficulty Level</label>
            <div className="space-y-3">
              {(['easy', 'medium', 'hard'] as Difficulty[]).map((level) => {
                const settings = difficultySettings[level]
                return (
                  <button
                    key={level}
                    onClick={() => setDifficulty(level)}
                    className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                      difficulty === level
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium capitalize">{level}</div>
                        <div className="text-sm text-gray-500">
                          Range: {settings.min}-{settings.max} • {settings.attempts} attempts
                        </div>
                      </div>
                      <div className="text-sm font-medium">
                        {settings.baseScore} pts
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          <button
            onClick={startGame}
            className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold py-4 px-6 rounded-xl hover:from-green-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105"
          >
            Start Game
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Number Guessing Game</h1>
          <p className="text-gray-600">
            Guess the number between {range.min} and {range.max} • 
            <span className="capitalize font-medium"> {difficulty}</span>
          </p>
        </div>
        <div className="flex gap-4">
          <Link
            href="/games"
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <Home className="h-4 w-4" />
            Games
          </Link>
          <button
            onClick={resetGame}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            New Game
          </button>
        </div>
      </div>

      {/* Game Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg p-4 shadow-md text-center">
          <Timer className="h-6 w-6 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{formatTime(timeElapsed)}</div>
          <div className="text-sm text-gray-600">Time</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-md text-center">
          <Target className="h-6 w-6 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{attempts}</div>
          <div className="text-sm text-gray-600">Attempts</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-md text-center">
          <Hash className="h-6 w-6 text-purple-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{maxAttempts - attempts}</div>
          <div className="text-sm text-gray-600">Remaining</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-md text-center">
          <Trophy className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{score}</div>
          <div className="text-sm text-gray-600">Score</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Game Input */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {gameState === 'playing' && (
            <>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Make Your Guess</h2>
              <div className="flex gap-3 mb-4">
                <input
                  type="number"
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  onKeyPress={handleKeyPress}
                  min={range.min}
                  max={range.max}
                  placeholder={`Enter ${range.min}-${range.max}`}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                />
                <button
                  onClick={makeGuess}
                  disabled={!guess.trim()}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Guess
                </button>
              </div>
              <p className="text-sm text-gray-600">
                You have {maxAttempts - attempts} attempts remaining
              </p>
            </>
          )}

          {gameState === 'completed' && (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {gameWon ? '🎉 Congratulations!' : '😔 Game Over!'}
              </h2>
              <p className="text-lg text-gray-600 mb-4">
                The number was <span className="font-bold text-blue-600">{targetNumber}</span>
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Final Score: <span className="font-bold text-green-600">{score}</span>
              </p>
              <button
                onClick={startGame}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Play Again
              </button>
            </div>
          )}
        </div>

        {/* Guess History */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Guess History</h2>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {guessHistory.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No guesses yet</p>
            ) : (
              guessHistory.map((entry, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                >
                  <span className="font-medium text-gray-900">#{index + 1}: {entry.guess}</span>
                  <span className="text-sm">{entry.hint}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
