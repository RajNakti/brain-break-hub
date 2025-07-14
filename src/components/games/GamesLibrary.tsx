'use client'

import { useState } from 'react'
import { User } from '@supabase/supabase-js'
import Link from 'next/link'
import { Brain, Zap, Type, Grid3X3, HelpCircle, Filter, Trophy, Clock, Star, Hash, Target } from 'lucide-react'
import { getGameDifficultyColor } from '@/lib/utils'

interface GameScore {
  id: string
  game_type: string
  score: number
  difficulty: string
  duration: number
  created_at: string
}

interface GamesLibraryProps {
  user: User
  gameScores: GameScore[]
}

interface Game {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  difficulty: 'easy' | 'medium' | 'hard'
  category: 'logic' | 'memory' | 'speed' | 'word'
  estimatedTime: string
  href: string
  color: string
}

const games: Game[] = [
  {
    id: 'memory',
    title: 'Memory Match',
    description: 'Test your memory by matching pairs of cards',
    icon: <Brain className="h-8 w-8" />,
    difficulty: 'easy',
    category: 'memory',
    estimatedTime: '2-5 min',
    href: '/games/memory',
    color: 'blue'
  },
  {
    id: 'reaction',
    title: 'Reaction Test',
    description: 'Measure your reaction time and reflexes',
    icon: <Zap className="h-8 w-8" />,
    difficulty: 'easy',
    category: 'speed',
    estimatedTime: '1-2 min',
    href: '/games/reaction',
    color: 'yellow'
  },
  {
    id: 'word-puzzle',
    title: 'Word Puzzle',
    description: 'Unscramble letters to form words',
    icon: <Type className="h-8 w-8" />,
    difficulty: 'medium',
    category: 'word',
    estimatedTime: '3-7 min',
    href: '/games/word-puzzle',
    color: 'green'
  },
  {
    id: 'sudoku',
    title: 'Sudoku',
    description: 'Classic number puzzle game',
    icon: <Grid3X3 className="h-8 w-8" />,
    difficulty: 'hard',
    category: 'logic',
    estimatedTime: '10-20 min',
    href: '/games/sudoku',
    color: 'purple'
  },
  {
    id: 'trivia',
    title: 'Quick Trivia',
    description: 'Test your general knowledge',
    icon: <HelpCircle className="h-8 w-8" />,
    difficulty: 'medium',
    category: 'logic',
    estimatedTime: '3-5 min',
    href: '/games/trivia',
    color: 'red'
  },
  {
    id: 'tic-tac-toe',
    title: 'Tic-Tac-Toe',
    description: 'Classic strategy game against AI',
    icon: <Hash className="h-8 w-8" />,
    difficulty: 'medium',
    category: 'logic',
    estimatedTime: '1-3 min',
    href: '/games/tic-tac-toe',
    color: 'indigo'
  },
  {
    id: 'number-guessing',
    title: 'Number Guessing',
    description: 'Guess the secret number within limited attempts',
    icon: <Target className="h-8 w-8" />,
    difficulty: 'easy',
    category: 'logic',
    estimatedTime: '2-5 min',
    href: '/games/number-guessing',
    color: 'teal'
  }
]

export default function GamesLibrary({ user, gameScores }: GamesLibraryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')

  const categories = [
    { id: 'all', name: 'All Games' },
    { id: 'memory', name: 'Memory' },
    { id: 'logic', name: 'Logic' },
    { id: 'speed', name: 'Speed' },
    { id: 'word', name: 'Word' }
  ]

  const difficulties = [
    { id: 'all', name: 'All Levels' },
    { id: 'easy', name: 'Easy' },
    { id: 'medium', name: 'Medium' },
    { id: 'hard', name: 'Hard' }
  ]

  const filteredGames = games.filter(game => {
    const categoryMatch = selectedCategory === 'all' || game.category === selectedCategory
    const difficultyMatch = selectedDifficulty === 'all' || game.difficulty === selectedDifficulty
    return categoryMatch && difficultyMatch
  })

  const getGameStats = (gameId: string) => {
    const gameScoresForGame = gameScores.filter(score => score.game_type === gameId)
    if (gameScoresForGame.length === 0) {
      return { bestScore: null, timesPlayed: 0, averageScore: null }
    }

    const bestScore = Math.max(...gameScoresForGame.map(score => score.score))
    const timesPlayed = gameScoresForGame.length
    const averageScore = Math.round(gameScoresForGame.reduce((sum, score) => sum + score.score, 0) / timesPlayed)

    return { bestScore, timesPlayed, averageScore }
  }

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
      yellow: 'from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700',
      green: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
      purple: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
      red: 'from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
    }
    return colorMap[color as keyof typeof colorMap] || colorMap.blue
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Brain Games</h1>
        <p className="text-gray-600">Challenge your mind with these engaging mini-games</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <Filter className="h-5 w-5 text-gray-600" />
          <span className="font-medium text-gray-900">Filter Games</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {difficulties.map(difficulty => (
                <option key={difficulty.id} value={difficulty.id}>
                  {difficulty.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGames.map(game => {
          const stats = getGameStats(game.id)
          
          return (
            <div key={game.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              {/* Game Header */}
              <div className={`bg-gradient-to-r ${getColorClasses(game.color)} p-6 text-white`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-white/90">
                    {game.icon}
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGameDifficultyColor(game.difficulty)} bg-white/20 text-white`}>
                    {game.difficulty}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2">{game.title}</h3>
                <p className="text-white/90 text-sm">{game.description}</p>
              </div>

              {/* Game Stats */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Trophy className="h-4 w-4 text-yellow-600 mr-1" />
                      <span className="text-sm text-gray-600">Best Score</span>
                    </div>
                    <div className="font-bold text-lg text-gray-900">
                      {stats.bestScore || '-'}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Star className="h-4 w-4 text-blue-600 mr-1" />
                      <span className="text-sm text-gray-600">Times Played</span>
                    </div>
                    <div className="font-bold text-lg text-gray-900">
                      {stats.timesPlayed}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-1" />
                    {game.estimatedTime}
                  </div>
                  <span className="text-xs text-gray-500 capitalize">
                    {game.category}
                  </span>
                </div>

                {/* Play Button */}
                <Link
                  href={game.href}
                  className={`w-full bg-gradient-to-r ${getColorClasses(game.color)} text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 text-center block hover:shadow-lg`}
                >
                  Play Now
                </Link>
              </div>
            </div>
          )
        })}
      </div>

      {/* No Games Message */}
      {filteredGames.length === 0 && (
        <div className="text-center py-12">
          <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No games found</h3>
          <p className="text-gray-600">Try adjusting your filters to see more games.</p>
        </div>
      )}

      {/* Overall Stats */}
      <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Gaming Stats</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {gameScores.length}
            </div>
            <div className="text-gray-600">Total Games Played</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {new Set(gameScores.map(score => score.game_type)).size}
            </div>
            <div className="text-gray-600">Different Games Tried</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 mb-2">
              {gameScores.length > 0 ? Math.round(gameScores.reduce((sum, score) => sum + score.score, 0) / gameScores.length) : 0}
            </div>
            <div className="text-gray-600">Average Score</div>
          </div>
        </div>
      </div>
    </div>
  )
}
