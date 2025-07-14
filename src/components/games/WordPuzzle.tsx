'use client'

import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { Type, RotateCcw, Home, Trophy, Timer, Lightbulb, Shuffle } from 'lucide-react'
import { shuffleArray, formatTime } from '@/lib/utils'
import toast from 'react-hot-toast'
import Link from 'next/link'

interface WordPuzzleProps {
  user: User
}

type GameState = 'setup' | 'playing' | 'completed'
type Difficulty = 'easy' | 'medium' | 'hard'

const wordLists = {
  easy: [
    'APPLE', 'HOUSE', 'WATER', 'HAPPY', 'MUSIC', 'LIGHT', 'PEACE', 'SMILE', 'HEART', 'DREAM',
    'BEACH', 'CLOUD', 'DANCE', 'EARTH', 'FLAME', 'GRACE', 'HONEY', 'MAGIC', 'OCEAN', 'PLANT'
  ],
  medium: [
    'RAINBOW', 'FREEDOM', 'JOURNEY', 'MYSTERY', 'HARMONY', 'COURAGE', 'BALANCE', 'CRYSTAL', 'DIAMOND', 'ELEPHANT',
    'FANTASY', 'GRAVITY', 'HORIZON', 'IMAGINE', 'JUSTICE', 'KINGDOM', 'LIBRARY', 'MACHINE', 'NETWORK', 'PERFECT'
  ],
  hard: [
    'ADVENTURE', 'BEAUTIFUL', 'CHALLENGE', 'DISCOVERY', 'EDUCATION', 'FANTASTIC', 'GEOGRAPHY', 'HAPPINESS', 'IMPORTANT', 'KNOWLEDGE',
    'LANDSCAPE', 'MAGNITUDE', 'NECESSARY', 'OPERATION', 'POTENTIAL', 'QUESTIONS', 'RECOGNIZE', 'STRUCTURE', 'TECHNIQUE', 'WONDERFUL'
  ]
}

export default function WordPuzzle({ user }: WordPuzzleProps) {
  const [gameState, setGameState] = useState<GameState>('setup')
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')
  const [currentWord, setCurrentWord] = useState('')
  const [scrambledWord, setScrambledWord] = useState('')
  const [userInput, setUserInput] = useState('')
  const [score, setScore] = useState(0)
  const [wordsCompleted, setWordsCompleted] = useState(0)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [gameStartTime, setGameStartTime] = useState<Date | null>(null)
  const [hints, setHints] = useState(3)
  const [usedWords, setUsedWords] = useState<string[]>([])

  const difficultySettings = {
    easy: { wordsToComplete: 5, timeBonus: 500, baseScore: 100 },
    medium: { wordsToComplete: 7, timeBonus: 750, baseScore: 150 },
    hard: { wordsToComplete: 10, timeBonus: 1000, baseScore: 200 }
  }

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (gameState === 'playing' && gameStartTime) {
      interval = setInterval(() => {
        setTimeElapsed(Math.floor((Date.now() - gameStartTime.getTime()) / 1000))
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [gameState, gameStartTime])

  useEffect(() => {
    if (wordsCompleted >= difficultySettings[difficulty].wordsToComplete) {
      completeGame()
    }
  }, [wordsCompleted, difficulty])

  const initializeGame = () => {
    setGameState('playing')
    setScore(0)
    setWordsCompleted(0)
    setTimeElapsed(0)
    setHints(3)
    setUsedWords([])
    setGameStartTime(new Date())
    generateNewWord()
  }

  const generateNewWord = () => {
    const availableWords = wordLists[difficulty].filter(word => !usedWords.includes(word))
    
    if (availableWords.length === 0) {
      completeGame()
      return
    }

    const randomWord = availableWords[Math.floor(Math.random() * availableWords.length)]
    setCurrentWord(randomWord)
    setScrambledWord(shuffleArray(randomWord.split('')).join(''))
    setUserInput('')
    setUsedWords(prev => [...prev, randomWord])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (userInput.toUpperCase() === currentWord) {
      // Correct answer
      const { baseScore, timeBonus } = difficultySettings[difficulty]
      const wordScore = baseScore + Math.max(0, timeBonus - timeElapsed * 10)
      const hintPenalty = (3 - hints) * 50
      const finalWordScore = Math.max(50, wordScore - hintPenalty)
      
      setScore(prev => prev + finalWordScore)
      setWordsCompleted(prev => prev + 1)
      
      toast.success(`Correct! +${finalWordScore} points`)
      
      setTimeout(() => {
        generateNewWord()
      }, 1000)
    } else {
      toast.error('Try again!')
      setUserInput('')
    }
  }

  const useHint = () => {
    if (hints > 0) {
      setHints(prev => prev - 1)
      
      // Show first letter that's not revealed
      const revealedLetters = userInput.toUpperCase()
      const nextLetterIndex = revealedLetters.length
      
      if (nextLetterIndex < currentWord.length) {
        const hintLetter = currentWord[nextLetterIndex]
        setUserInput(prev => prev + hintLetter.toLowerCase())
        toast.success(`Hint: Next letter is "${hintLetter}"`)
      }
    }
  }

  const reshuffleWord = () => {
    setScrambledWord(shuffleArray(currentWord.split('')).join(''))
    toast.success('Word reshuffled!')
  }

  const calculateFinalScore = () => {
    const { timeBonus } = difficultySettings[difficulty]
    const timeBonusPoints = Math.max(0, timeBonus - timeElapsed * 5)
    const difficultyMultiplier = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 1.5 : 2
    
    return Math.round((score + timeBonusPoints) * difficultyMultiplier)
  }

  const completeGame = async () => {
    const finalScore = calculateFinalScore()
    setGameState('completed')

    // Save score to database
    try {
      await supabase.from('game_scores').insert({
        user_id: user.id,
        game_type: 'word-puzzle',
        score: finalScore,
        difficulty,
        duration: timeElapsed
      })
      
      toast.success('Game completed! Score saved.')
    } catch (error) {
      console.error('Error saving score:', error)
      toast.error('Game completed, but failed to save score.')
    }
  }

  const resetGame = () => {
    setGameState('setup')
    setCurrentWord('')
    setScrambledWord('')
    setUserInput('')
    setScore(0)
    setWordsCompleted(0)
    setTimeElapsed(0)
    setHints(3)
    setUsedWords([])
    setGameStartTime(null)
  }

  if (gameState === 'setup') {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <Type className="h-16 w-16 text-green-600 mx-auto mb-4 animate-bounce-slow" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Word Puzzle</h1>
          <p className="text-gray-600">Unscramble letters to form words</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Choose Difficulty</h3>
          
          <div className="space-y-4">
            {Object.entries(difficultySettings).map(([level, settings]) => (
              <button
                key={level}
                onClick={() => setDifficulty(level as Difficulty)}
                className={`w-full p-4 rounded-lg border-2 transition-all duration-200 ${
                  difficulty === level
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="text-left">
                    <div className="font-medium text-gray-900 capitalize">{level}</div>
                    <div className="text-sm text-gray-600">{settings.wordsToComplete} words</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">
                      {level === 'easy' ? '4-5 letters' : level === 'medium' ? '6-7 letters' : '8-9 letters'}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={initializeGame}
            className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Start Game
          </button>

          <Link
            href="/games"
            className="w-full mt-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors duration-200 text-center block"
          >
            Back to Games
          </Link>
        </div>
      </div>
    )
  }

  if (gameState === 'completed') {
    const finalScore = calculateFinalScore()
    
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <Trophy className="h-16 w-16 text-yellow-600 mx-auto mb-4 animate-bounce-slow" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Puzzle Complete!</h1>
          <p className="text-gray-600">Great job solving those word puzzles</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-green-600 mb-2">{finalScore}</div>
            <div className="text-gray-600">Final Score</div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{wordsCompleted}</div>
              <div className="text-sm text-gray-600">Words Solved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{formatTime(timeElapsed)}</div>
              <div className="text-sm text-gray-600">Time</div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={resetGame}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Play Again
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Game Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Word Puzzle</h1>
          <p className="text-gray-600 capitalize">{difficulty} difficulty</p>
        </div>
        <div className="flex space-x-4">
          <Link
            href="/games"
            className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors"
          >
            <Home className="h-4 w-4" />
            <span>Games</span>
          </Link>
          <button
            onClick={resetGame}
            className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Game Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg p-4 shadow-lg text-center">
          <div className="text-2xl font-bold text-green-600">{score}</div>
          <div className="text-sm text-gray-600">Score</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-lg text-center">
          <div className="text-2xl font-bold text-blue-600">{wordsCompleted}/{difficultySettings[difficulty].wordsToComplete}</div>
          <div className="text-sm text-gray-600">Words</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-lg text-center">
          <div className="text-2xl font-bold text-purple-600">{formatTime(timeElapsed)}</div>
          <div className="text-sm text-gray-600">Time</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-lg text-center">
          <div className="text-2xl font-bold text-orange-600">{hints}</div>
          <div className="text-sm text-gray-600">Hints</div>
        </div>
      </div>

      {/* Game Area */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Unscramble this word:</h2>
          <div className="text-4xl font-bold text-green-600 mb-6 tracking-wider animate-pulse">
            {scrambledWord}
          </div>
          
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your answer..."
              className="w-full px-4 py-3 text-center text-xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent mb-4"
              autoFocus
            />
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Submit Answer
            </button>
          </form>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={useHint}
            disabled={hints === 0}
            className="flex items-center space-x-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
          >
            <Lightbulb className="h-4 w-4" />
            <span>Hint ({hints})</span>
          </button>
          
          <button
            onClick={reshuffleWord}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
          >
            <Shuffle className="h-4 w-4" />
            <span>Reshuffle</span>
          </button>
        </div>
      </div>
    </div>
  )
}
