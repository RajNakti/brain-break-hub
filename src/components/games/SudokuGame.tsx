'use client'

import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { Grid3X3, RotateCcw, Home, Trophy, Timer, Lightbulb, Eraser } from 'lucide-react'
import { formatTime } from '@/lib/utils'
import toast from 'react-hot-toast'
import Link from 'next/link'

interface SudokuGameProps {
  user: User
}

type GameState = 'setup' | 'playing' | 'completed'
type Difficulty = 'easy' | 'medium' | 'hard'

// Simple Sudoku puzzles for demo
const sudokuPuzzles = {
  easy: [
    [
      [5, 3, 0, 0, 7, 0, 0, 0, 0],
      [6, 0, 0, 1, 9, 5, 0, 0, 0],
      [0, 9, 8, 0, 0, 0, 0, 6, 0],
      [8, 0, 0, 0, 6, 0, 0, 0, 3],
      [4, 0, 0, 8, 0, 3, 0, 0, 1],
      [7, 0, 0, 0, 2, 0, 0, 0, 6],
      [0, 6, 0, 0, 0, 0, 2, 8, 0],
      [0, 0, 0, 4, 1, 9, 0, 0, 5],
      [0, 0, 0, 0, 8, 0, 0, 7, 9]
    ]
  ],
  medium: [
    [
      [0, 0, 0, 6, 0, 0, 4, 0, 0],
      [7, 0, 0, 0, 0, 3, 6, 0, 0],
      [0, 0, 0, 0, 9, 1, 0, 8, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 5, 0, 1, 8, 0, 0, 0, 3],
      [0, 0, 0, 3, 0, 6, 0, 4, 5],
      [0, 4, 0, 2, 0, 0, 0, 6, 0],
      [9, 0, 3, 0, 0, 0, 0, 0, 0],
      [0, 2, 0, 0, 0, 0, 1, 0, 0]
    ]
  ],
  hard: [
    [
      [0, 0, 0, 0, 0, 0, 6, 8, 0],
      [0, 0, 0, 0, 0, 3, 0, 0, 0],
      [7, 0, 0, 0, 9, 0, 0, 0, 0],
      [5, 0, 0, 0, 0, 7, 0, 0, 0],
      [0, 0, 0, 0, 4, 5, 7, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 3, 0],
      [0, 0, 1, 0, 0, 0, 0, 6, 8],
      [0, 0, 8, 5, 0, 0, 0, 1, 0],
      [0, 9, 0, 0, 0, 0, 4, 0, 0]
    ]
  ]
}

export default function SudokuGame({ user }: SudokuGameProps) {
  const [gameState, setGameState] = useState<GameState>('setup')
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')
  const [puzzle, setPuzzle] = useState<number[][]>([])
  const [solution, setSolution] = useState<number[][]>([])
  const [userGrid, setUserGrid] = useState<number[][]>([])
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [gameStartTime, setGameStartTime] = useState<Date | null>(null)
  const [hints, setHints] = useState(3)
  const [score, setScore] = useState(0)

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

  const initializeGame = () => {
    const puzzleIndex = Math.floor(Math.random() * sudokuPuzzles[difficulty].length)
    const selectedPuzzle = sudokuPuzzles[difficulty][puzzleIndex]
    
    setPuzzle(selectedPuzzle.map(row => [...row]))
    setUserGrid(selectedPuzzle.map(row => [...row]))
    setSolution(solveSudoku(selectedPuzzle.map(row => [...row])))
    setGameState('playing')
    setTimeElapsed(0)
    setHints(3)
    setScore(0)
    setSelectedCell(null)
    setGameStartTime(new Date())
  }

  const solveSudoku = (grid: number[][]): number[][] => {
    // Simple backtracking solver for demo
    const solved = grid.map(row => [...row])
    
    const isValid = (grid: number[][], row: number, col: number, num: number): boolean => {
      // Check row
      for (let x = 0; x < 9; x++) {
        if (grid[row][x] === num) return false
      }
      
      // Check column
      for (let x = 0; x < 9; x++) {
        if (grid[x][col] === num) return false
      }
      
      // Check 3x3 box
      const startRow = row - (row % 3)
      const startCol = col - (col % 3)
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (grid[i + startRow][j + startCol] === num) return false
        }
      }
      
      return true
    }
    
    const solve = (grid: number[][]): boolean => {
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (grid[row][col] === 0) {
            for (let num = 1; num <= 9; num++) {
              if (isValid(grid, row, col, num)) {
                grid[row][col] = num
                if (solve(grid)) return true
                grid[row][col] = 0
              }
            }
            return false
          }
        }
      }
      return true
    }
    
    solve(solved)
    return solved
  }

  const handleCellClick = (row: number, col: number) => {
    if (puzzle[row][col] === 0) {
      setSelectedCell([row, col])
    }
  }

  const handleNumberInput = (num: number) => {
    if (selectedCell) {
      const [row, col] = selectedCell
      if (puzzle[row][col] === 0) {
        const newGrid = [...userGrid]
        newGrid[row][col] = num
        setUserGrid(newGrid)
        
        // Check if puzzle is completed
        if (isPuzzleComplete(newGrid)) {
          completeGame()
        }
      }
    }
  }

  const clearCell = () => {
    if (selectedCell) {
      const [row, col] = selectedCell
      if (puzzle[row][col] === 0) {
        const newGrid = [...userGrid]
        newGrid[row][col] = 0
        setUserGrid(newGrid)
      }
    }
  }

  const useHint = () => {
    if (hints > 0 && selectedCell) {
      const [row, col] = selectedCell
      if (puzzle[row][col] === 0) {
        const newGrid = [...userGrid]
        newGrid[row][col] = solution[row][col]
        setUserGrid(newGrid)
        setHints(prev => prev - 1)
        toast.success('Hint used!')
        
        if (isPuzzleComplete(newGrid)) {
          completeGame()
        }
      }
    }
  }

  const isPuzzleComplete = (grid: number[][]): boolean => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === 0 || grid[row][col] !== solution[row][col]) {
          return false
        }
      }
    }
    return true
  }

  const calculateScore = () => {
    const baseScore = difficulty === 'easy' ? 1000 : difficulty === 'medium' ? 1500 : 2000
    const timeBonus = Math.max(0, 2000 - timeElapsed * 2)
    const hintPenalty = (3 - hints) * 200
    return Math.max(500, baseScore + timeBonus - hintPenalty)
  }

  const completeGame = async () => {
    const finalScore = calculateScore()
    setScore(finalScore)
    setGameState('completed')

    try {
      await supabase.from('game_scores').insert({
        user_id: user.id,
        game_type: 'sudoku',
        score: finalScore,
        difficulty,
        duration: timeElapsed
      })
      
      toast.success('Sudoku completed! Score saved.')
    } catch (error) {
      console.error('Error saving score:', error)
      toast.error('Sudoku completed, but failed to save score.')
    }
  }

  const resetGame = () => {
    setGameState('setup')
    setPuzzle([])
    setSolution([])
    setUserGrid([])
    setSelectedCell(null)
    setTimeElapsed(0)
    setHints(3)
    setScore(0)
    setGameStartTime(null)
  }

  if (gameState === 'setup') {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <Grid3X3 className="h-16 w-16 text-purple-600 mx-auto mb-4 animate-float" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sudoku</h1>
          <p className="text-gray-600">Fill the 9×9 grid with digits 1-9</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Choose Difficulty</h3>
          
          <div className="space-y-4">
            <button
              onClick={() => setDifficulty('easy')}
              className={`w-full p-4 rounded-lg border-2 transition-all duration-200 ${
                difficulty === 'easy'
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-left">
                <div className="font-medium text-gray-900">Easy</div>
                <div className="text-sm text-gray-600">More numbers filled in</div>
              </div>
            </button>
            
            <button
              onClick={() => setDifficulty('medium')}
              className={`w-full p-4 rounded-lg border-2 transition-all duration-200 ${
                difficulty === 'medium'
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-left">
                <div className="font-medium text-gray-900">Medium</div>
                <div className="text-sm text-gray-600">Moderate challenge</div>
              </div>
            </button>
            
            <button
              onClick={() => setDifficulty('hard')}
              className={`w-full p-4 rounded-lg border-2 transition-all duration-200 ${
                difficulty === 'hard'
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-left">
                <div className="font-medium text-gray-900">Hard</div>
                <div className="text-sm text-gray-600">Expert level</div>
              </div>
            </button>
          </div>

          <button
            onClick={initializeGame}
            className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
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
          <Trophy className="h-16 w-16 text-yellow-600 mx-auto mb-4 animate-bounce-slow" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sudoku Solved!</h1>
          <p className="text-gray-600">Excellent logical thinking</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-purple-600 mb-2">{score}</div>
            <div className="text-gray-600">Final Score</div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{formatTime(timeElapsed)}</div>
              <div className="text-sm text-gray-600">Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{hints}</div>
              <div className="text-sm text-gray-600">Hints Left</div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={resetGame}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
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
          <h1 className="text-2xl font-bold text-gray-900">Sudoku</h1>
          <p className="text-gray-600 capitalize">{difficulty} difficulty</p>
        </div>
        <div className="flex space-x-4">
          <Link
            href="/games"
            className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors"
          >
            <Home className="h-4 w-4" />
            <span>Games</span>
          </Link>
          <button
            onClick={resetGame}
            className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Game Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg p-4 shadow-lg text-center">
          <div className="text-2xl font-bold text-purple-600">{formatTime(timeElapsed)}</div>
          <div className="text-sm text-gray-600">Time</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-lg text-center">
          <div className="text-2xl font-bold text-blue-600">{hints}</div>
          <div className="text-sm text-gray-600">Hints Left</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-lg text-center">
          <div className="text-2xl font-bold text-green-600">{difficulty}</div>
          <div className="text-sm text-gray-600">Difficulty</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Sudoku Grid */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="grid grid-cols-9 gap-1 max-w-lg mx-auto">
              {userGrid.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <button
                    key={`${rowIndex}-${colIndex}`}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                    className={`
                      aspect-square flex items-center justify-center text-lg font-bold border-2 transition-all duration-200
                      ${selectedCell && selectedCell[0] === rowIndex && selectedCell[1] === colIndex
                        ? 'border-purple-500 bg-purple-100'
                        : 'border-gray-300 hover:border-purple-300'
                      }
                      ${puzzle[rowIndex][colIndex] !== 0
                        ? 'bg-gray-100 text-gray-900'
                        : 'bg-white text-purple-600 hover:bg-purple-50'
                      }
                      ${(rowIndex + 1) % 3 === 0 && rowIndex !== 8 ? 'border-b-4 border-b-gray-800' : ''}
                      ${(colIndex + 1) % 3 === 0 && colIndex !== 8 ? 'border-r-4 border-r-gray-800' : ''}
                    `}
                    disabled={puzzle[rowIndex][colIndex] !== 0}
                  >
                    {cell !== 0 ? cell : ''}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-6">
          {/* Number Pad */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Numbers</h3>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <button
                  key={num}
                  onClick={() => handleNumberInput(num)}
                  disabled={!selectedCell}
                  className="aspect-square bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white font-bold text-xl rounded-lg transition-colors duration-200"
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
            <div className="space-y-3">
              <button
                onClick={clearCell}
                disabled={!selectedCell}
                className="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
              >
                <Eraser className="h-4 w-4" />
                <span>Clear</span>
              </button>
              
              <button
                onClick={useHint}
                disabled={hints === 0 || !selectedCell}
                className="w-full flex items-center justify-center space-x-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-300 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
              >
                <Lightbulb className="h-4 w-4" />
                <span>Hint ({hints})</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
