'use client'

import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { RotateCcw, Home, Trophy, Timer, Star, Grid3X3 } from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'

interface TicTacToeGameProps {
  user: User
}

type Player = 'X' | 'O' | null
type GameState = 'setup' | 'playing' | 'completed'
type Difficulty = 'easy' | 'medium' | 'hard'

export default function TicTacToeGame({ user }: TicTacToeGameProps) {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null))
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X')
  const [gameState, setGameState] = useState<GameState>('setup')
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [winner, setWinner] = useState<Player | 'tie' | null>(null)
  const [score, setScore] = useState(0)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [gameStartTime, setGameStartTime] = useState<number>(0)
  const [gamesWon, setGamesWon] = useState(0)
  const [gamesPlayed, setGamesPlayed] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (gameState === 'playing') {
      interval = setInterval(() => {
        setTimeElapsed(Math.floor((Date.now() - gameStartTime) / 1000))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [gameState, gameStartTime])

  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] // diagonals
  ]

  const checkWinner = (board: Player[]): Player | 'tie' | null => {
    for (const combination of winningCombinations) {
      const [a, b, c] = combination
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a]
      }
    }
    if (board.every(cell => cell !== null)) {
      return 'tie'
    }
    return null
  }

  const getEmptyCells = (board: Player[]): number[] => {
    return board.map((cell, index) => cell === null ? index : -1).filter(index => index !== -1)
  }

  const minimax = (board: Player[], depth: number, isMaximizing: boolean, alpha: number = -Infinity, beta: number = Infinity): number => {
    const result = checkWinner(board)
    
    if (result === 'O') return 10 - depth
    if (result === 'X') return depth - 10
    if (result === 'tie') return 0

    if (isMaximizing) {
      let maxEval = -Infinity
      for (const index of getEmptyCells(board)) {
        board[index] = 'O'
        const evaluation = minimax(board, depth + 1, false, alpha, beta)
        board[index] = null
        maxEval = Math.max(maxEval, evaluation)
        alpha = Math.max(alpha, evaluation)
        if (beta <= alpha) break
      }
      return maxEval
    } else {
      let minEval = Infinity
      for (const index of getEmptyCells(board)) {
        board[index] = 'X'
        const evaluation = minimax(board, depth + 1, true, alpha, beta)
        board[index] = null
        minEval = Math.min(minEval, evaluation)
        beta = Math.min(beta, evaluation)
        if (beta <= alpha) break
      }
      return minEval
    }
  }

  const getBestMove = (board: Player[]): number => {
    let bestMove = -1
    let bestValue = -Infinity

    for (const index of getEmptyCells(board)) {
      board[index] = 'O'
      const moveValue = minimax(board, 0, false)
      board[index] = null

      if (moveValue > bestValue) {
        bestValue = moveValue
        bestMove = index
      }
    }

    return bestMove
  }

  const getAIMove = (board: Player[]): number => {
    const emptyCells = getEmptyCells(board)
    
    if (difficulty === 'easy') {
      // Random move
      return emptyCells[Math.floor(Math.random() * emptyCells.length)]
    } else if (difficulty === 'medium') {
      // 70% optimal, 30% random
      if (Math.random() < 0.7) {
        return getBestMove(board)
      } else {
        return emptyCells[Math.floor(Math.random() * emptyCells.length)]
      }
    } else {
      // Hard: always optimal
      return getBestMove(board)
    }
  }

  const makeMove = (index: number) => {
    if (board[index] || winner || currentPlayer !== 'X') return

    const newBoard = [...board]
    newBoard[index] = 'X'
    setBoard(newBoard)

    const gameResult = checkWinner(newBoard)
    if (gameResult) {
      endGame(gameResult, newBoard)
      return
    }

    setCurrentPlayer('O')
    
    // AI move after a short delay
    setTimeout(() => {
      const aiMove = getAIMove(newBoard)
      if (aiMove !== -1) {
        newBoard[aiMove] = 'O'
        setBoard(newBoard)
        
        const aiGameResult = checkWinner(newBoard)
        if (aiGameResult) {
          endGame(aiGameResult, newBoard)
        } else {
          setCurrentPlayer('X')
        }
      }
    }, 500)
  }

  const endGame = (result: Player | 'tie', finalBoard: Player[]) => {
    setWinner(result)
    setGameState('completed')
    
    const newGamesPlayed = gamesPlayed + 1
    setGamesPlayed(newGamesPlayed)
    
    let gameScore = 0
    if (result === 'X') {
      const newGamesWon = gamesWon + 1
      setGamesWon(newGamesWon)
      
      // Calculate score based on difficulty and time
      const baseScore = difficulty === 'easy' ? 100 : difficulty === 'medium' ? 200 : 300
      const timeBonus = Math.max(0, 60 - timeElapsed) * 5
      gameScore = baseScore + timeBonus
      
      toast.success(`You won! +${gameScore} points`)
    } else if (result === 'tie') {
      gameScore = 50
      toast.success(`It's a tie! +${gameScore} points`)
    } else {
      toast.error('You lost! Better luck next time.')
    }
    
    setScore(prev => prev + gameScore)
    saveScore(gameScore)
  }

  const saveScore = async (gameScore: number) => {
    try {
      await supabase.from('game_scores').insert({
        user_id: user.id,
        game_type: 'tic-tac-toe',
        score: gameScore,
        difficulty,
        duration: timeElapsed
      })
    } catch (error) {
      console.error('Error saving score:', error)
    }
  }

  const startGame = () => {
    setBoard(Array(9).fill(null))
    setCurrentPlayer('X')
    setWinner(null)
    setTimeElapsed(0)
    setGameStartTime(Date.now())
    setGameState('playing')
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setCurrentPlayer('X')
    setWinner(null)
    setTimeElapsed(0)
    setScore(0)
    setGamesWon(0)
    setGamesPlayed(0)
    setGameState('setup')
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (gameState === 'setup') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-blue-400 to-purple-600 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <Grid3X3 className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Tic-Tac-Toe</h1>
          <p className="text-gray-600 text-lg">Challenge the AI in this classic strategy game</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Game Settings</h2>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Difficulty Level</label>
            <div className="grid grid-cols-3 gap-3">
              {(['easy', 'medium', 'hard'] as Difficulty[]).map((level) => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                    difficulty === level
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-sm font-medium capitalize">{level}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {level === 'easy' ? '100 pts' : level === 'medium' ? '200 pts' : '300 pts'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={startGame}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-4 px-6 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
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
          <h1 className="text-3xl font-bold text-gray-900">Tic-Tac-Toe</h1>
          <p className="text-gray-600">Difficulty: <span className="capitalize font-medium">{difficulty}</span></p>
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
          <Trophy className="h-6 w-6 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{score}</div>
          <div className="text-sm text-gray-600">Score</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-md text-center">
          <Star className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{gamesWon}</div>
          <div className="text-sm text-gray-600">Won</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-md text-center">
          <Grid3X3 className="h-6 w-6 text-purple-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{gamesPlayed}</div>
          <div className="text-sm text-gray-600">Played</div>
        </div>
      </div>

      {/* Game Board */}
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
        {gameState === 'playing' && (
          <div className="text-center mb-6">
            <p className="text-lg font-medium text-gray-700">
              {currentPlayer === 'X' ? "Your turn (X)" : "AI's turn (O)"}
            </p>
          </div>
        )}

        {gameState === 'completed' && (
          <div className="text-center mb-6">
            <p className="text-xl font-bold text-gray-900 mb-2">
              {winner === 'X' ? '🎉 You Won!' : winner === 'O' ? '😔 AI Won!' : '🤝 It\'s a Tie!'}
            </p>
            <button
              onClick={startGame}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Play Again
            </button>
          </div>
        )}

        <div className="grid grid-cols-3 gap-2">
          {board.map((cell, index) => (
            <button
              key={index}
              onClick={() => makeMove(index)}
              disabled={cell !== null || winner !== null || currentPlayer !== 'X'}
              className={`aspect-square text-4xl font-bold rounded-lg border-2 transition-all duration-200 ${
                cell === null && winner === null && currentPlayer === 'X'
                  ? 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                  : 'border-gray-200'
              } ${
                cell === 'X' ? 'text-blue-600 bg-blue-50' : 
                cell === 'O' ? 'text-red-600 bg-red-50' : 
                'text-gray-400'
              }`}
            >
              {cell}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
