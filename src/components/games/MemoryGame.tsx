'use client'

import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { Brain, RotateCcw, Home, Trophy, Timer, Star } from 'lucide-react'
import { shuffleArray, formatTime } from '@/lib/utils'
import toast from 'react-hot-toast'
import Link from 'next/link'

interface MemoryGameProps {
  user: User
}

interface Card {
  id: number
  symbol: string
  isFlipped: boolean
  isMatched: boolean
}

type GameState = 'setup' | 'playing' | 'completed'
type Difficulty = 'easy' | 'medium' | 'hard'

const symbols = ['🎯', '🎨', '🎭', '🎪', '🎸', '🎺', '🎻', '🎹', '🎲', '🎳', '🏆', '🏅', '⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏓', '🏸', '🥊', '🎿', '⛷️', '🏂']

export default function MemoryGame({ user }: MemoryGameProps) {
  const [gameState, setGameState] = useState<GameState>('setup')
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')
  const [cards, setCards] = useState<Card[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [matches, setMatches] = useState(0)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [gameStartTime, setGameStartTime] = useState<Date | null>(null)
  const [score, setScore] = useState(0)

  const difficultySettings = {
    easy: { pairs: 6, gridCols: 4, timeBonus: 1000 },
    medium: { pairs: 8, gridCols: 4, timeBonus: 1500 },
    hard: { pairs: 12, gridCols: 6, timeBonus: 2000 }
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
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards
      const firstCard = cards.find(card => card.id === first)
      const secondCard = cards.find(card => card.id === second)

      if (firstCard && secondCard && firstCard.symbol === secondCard.symbol) {
        // Match found
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            card.id === first || card.id === second 
              ? { ...card, isMatched: true }
              : card
          ))
          setMatches(prev => prev + 1)
          setFlippedCards([])
        }, 500)
      } else {
        // No match
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            card.id === first || card.id === second 
              ? { ...card, isFlipped: false }
              : card
          ))
          setFlippedCards([])
        }, 1000)
      }
      setMoves(prev => prev + 1)
    }
  }, [flippedCards, cards])

  useEffect(() => {
    const totalPairs = difficultySettings[difficulty].pairs
    if (matches === totalPairs && gameState === 'playing') {
      completeGame()
    }
  }, [matches, difficulty, gameState])

  const initializeGame = () => {
    const { pairs } = difficultySettings[difficulty]
    const gameSymbols = symbols.slice(0, pairs)
    const cardPairs = [...gameSymbols, ...gameSymbols]
    const shuffledCards = shuffleArray(cardPairs).map((symbol, index) => ({
      id: index,
      symbol,
      isFlipped: false,
      isMatched: false
    }))

    setCards(shuffledCards)
    setFlippedCards([])
    setMoves(0)
    setMatches(0)
    setTimeElapsed(0)
    setScore(0)
    setGameStartTime(new Date())
    setGameState('playing')
  }

  const flipCard = (cardId: number) => {
    if (flippedCards.length >= 2) return
    if (flippedCards.includes(cardId)) return
    if (cards.find(card => card.id === cardId)?.isMatched) return

    setCards(prev => prev.map(card => 
      card.id === cardId ? { ...card, isFlipped: true } : card
    ))
    setFlippedCards(prev => [...prev, cardId])
  }

  const calculateScore = () => {
    const { timeBonus } = difficultySettings[difficulty]
    const baseScore = matches * 100
    const movesPenalty = Math.max(0, moves - matches * 2) * 5
    const timeBonusPoints = Math.max(0, timeBonus - timeElapsed * 10)
    const difficultyMultiplier = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 1.5 : 2
    
    return Math.round((baseScore + timeBonusPoints - movesPenalty) * difficultyMultiplier)
  }

  const completeGame = async () => {
    const finalScore = calculateScore()
    setScore(finalScore)
    setGameState('completed')

    // Save score to database
    try {
      await supabase.from('game_scores').insert({
        user_id: user.id,
        game_type: 'memory',
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
    setCards([])
    setFlippedCards([])
    setMoves(0)
    setMatches(0)
    setTimeElapsed(0)
    setScore(0)
    setGameStartTime(null)
  }

  const getGridClass = () => {
    const { gridCols } = difficultySettings[difficulty]
    return `grid gap-4 ${gridCols === 4 ? 'grid-cols-4' : 'grid-cols-6'}`
  }

  if (gameState === 'setup') {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <Brain className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Memory Match</h1>
          <p className="text-gray-600">Test your memory by matching pairs of cards</p>
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
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="text-left">
                    <div className="font-medium text-gray-900 capitalize">{level}</div>
                    <div className="text-sm text-gray-600">{settings.pairs} pairs</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Grid: {settings.gridCols}x{Math.ceil(settings.pairs * 2 / settings.gridCols)}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={initializeGame}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
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
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <Trophy className="h-16 w-16 text-yellow-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Congratulations!</h1>
          <p className="text-gray-600">You completed the memory game</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-blue-600 mb-2">{score}</div>
            <div className="text-gray-600">Final Score</div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{moves}</div>
              <div className="text-sm text-gray-600">Moves</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{formatTime(timeElapsed)}</div>
              <div className="text-sm text-gray-600">Time</div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={resetGame}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
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
          <h1 className="text-2xl font-bold text-gray-900">Memory Match</h1>
          <p className="text-gray-600 capitalize">{difficulty} difficulty</p>
        </div>
        <div className="flex space-x-4">
          <Link
            href="/games"
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <Home className="h-4 w-4" />
            <span>Games</span>
          </Link>
          <button
            onClick={resetGame}
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Game Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg p-4 shadow-lg text-center">
          <div className="flex items-center justify-center mb-2">
            <Star className="h-5 w-5 text-blue-600 mr-1" />
            <span className="text-sm text-gray-600">Moves</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{moves}</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-lg text-center">
          <div className="flex items-center justify-center mb-2">
            <Trophy className="h-5 w-5 text-green-600 mr-1" />
            <span className="text-sm text-gray-600">Matches</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{matches}/{difficultySettings[difficulty].pairs}</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-lg text-center">
          <div className="flex items-center justify-center mb-2">
            <Timer className="h-5 w-5 text-purple-600 mr-1" />
            <span className="text-sm text-gray-600">Time</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{formatTime(timeElapsed)}</div>
        </div>
      </div>

      {/* Game Board */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className={getGridClass()}>
          {cards.map(card => (
            <button
              key={card.id}
              onClick={() => flipCard(card.id)}
              disabled={card.isFlipped || card.isMatched || flippedCards.length >= 2}
              className={`aspect-square rounded-lg text-4xl font-bold transition-all duration-300 transform hover:scale-105 ${
                card.isFlipped || card.isMatched
                  ? 'bg-blue-100 text-blue-600 shadow-lg'
                  : 'bg-gray-200 hover:bg-gray-300 shadow-md'
              } ${card.isMatched ? 'ring-2 ring-green-400' : ''}`}
            >
              {card.isFlipped || card.isMatched ? card.symbol : '?'}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
