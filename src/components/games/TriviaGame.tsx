'use client'

import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { HelpCircle, RotateCcw, Home, Trophy, Timer, CheckCircle, XCircle } from 'lucide-react'
import { formatTime, shuffleArray } from '@/lib/utils'
import toast from 'react-hot-toast'
import Link from 'next/link'

interface TriviaGameProps {
  user: User
}

type GameState = 'setup' | 'playing' | 'completed'
type Difficulty = 'easy' | 'medium' | 'hard'

interface Question {
  question: string
  correct_answer: string
  incorrect_answers: string[]
  category: string
}

const triviaQuestions = {
  easy: [
    {
      question: "What is the capital of France?",
      correct_answer: "Paris",
      incorrect_answers: ["London", "Berlin", "Madrid"],
      category: "Geography"
    },
    {
      question: "How many legs does a spider have?",
      correct_answer: "8",
      incorrect_answers: ["6", "10", "12"],
      category: "Science"
    },
    {
      question: "What color do you get when you mix red and white?",
      correct_answer: "Pink",
      incorrect_answers: ["Purple", "Orange", "Yellow"],
      category: "Art"
    },
    {
      question: "Which planet is known as the Red Planet?",
      correct_answer: "Mars",
      incorrect_answers: ["Venus", "Jupiter", "Saturn"],
      category: "Science"
    },
    {
      question: "What is 5 + 7?",
      correct_answer: "12",
      incorrect_answers: ["10", "14", "15"],
      category: "Math"
    }
  ],
  medium: [
    {
      question: "Who painted the Mona Lisa?",
      correct_answer: "Leonardo da Vinci",
      incorrect_answers: ["Pablo Picasso", "Vincent van Gogh", "Michelangelo"],
      category: "Art"
    },
    {
      question: "What is the largest mammal in the world?",
      correct_answer: "Blue Whale",
      incorrect_answers: ["African Elephant", "Giraffe", "Hippopotamus"],
      category: "Science"
    },
    {
      question: "In which year did World War II end?",
      correct_answer: "1945",
      incorrect_answers: ["1944", "1946", "1943"],
      category: "History"
    },
    {
      question: "What is the chemical symbol for gold?",
      correct_answer: "Au",
      incorrect_answers: ["Go", "Gd", "Ag"],
      category: "Science"
    },
    {
      question: "Which Shakespeare play features the character Hamlet?",
      correct_answer: "Hamlet",
      incorrect_answers: ["Macbeth", "Romeo and Juliet", "Othello"],
      category: "Literature"
    }
  ],
  hard: [
    {
      question: "What is the smallest country in the world?",
      correct_answer: "Vatican City",
      incorrect_answers: ["Monaco", "Nauru", "San Marino"],
      category: "Geography"
    },
    {
      question: "Who developed the theory of relativity?",
      correct_answer: "Albert Einstein",
      incorrect_answers: ["Isaac Newton", "Galileo Galilei", "Stephen Hawking"],
      category: "Science"
    },
    {
      question: "What is the longest river in the world?",
      correct_answer: "Nile River",
      incorrect_answers: ["Amazon River", "Mississippi River", "Yangtze River"],
      category: "Geography"
    },
    {
      question: "In which year was the first iPhone released?",
      correct_answer: "2007",
      incorrect_answers: ["2006", "2008", "2009"],
      category: "Technology"
    },
    {
      question: "What is the hardest natural substance on Earth?",
      correct_answer: "Diamond",
      incorrect_answers: ["Quartz", "Titanium", "Graphite"],
      category: "Science"
    }
  ]
}

export default function TriviaGame({ user }: TriviaGameProps) {
  const [gameState, setGameState] = useState<GameState>('setup')
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [gameStartTime, setGameStartTime] = useState<Date | null>(null)
  const [questionStartTime, setQuestionStartTime] = useState<Date | null>(null)

  const difficultySettings = {
    easy: { questionsCount: 5, timeBonus: 100, baseScore: 100 },
    medium: { questionsCount: 7, timeBonus: 150, baseScore: 150 },
    hard: { questionsCount: 10, timeBonus: 200, baseScore: 200 }
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

  const initializeGame = () => {
    const { questionsCount } = difficultySettings[difficulty]
    const availableQuestions = [...triviaQuestions[difficulty]]
    const selectedQuestions = shuffleArray(availableQuestions).slice(0, questionsCount)
    
    setQuestions(selectedQuestions)
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(0)
    setCorrectAnswers(0)
    setTimeElapsed(0)
    setGameStartTime(new Date())
    setQuestionStartTime(new Date())
    setGameState('playing')
  }

  const handleAnswerSelect = (answer: string) => {
    if (selectedAnswer || showResult) return
    
    setSelectedAnswer(answer)
    setShowResult(true)
    
    const currentQuestion = questions[currentQuestionIndex]
    const isCorrect = answer === currentQuestion.correct_answer
    
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1)
      
      // Calculate score based on speed
      const questionTime = questionStartTime ? (Date.now() - questionStartTime.getTime()) / 1000 : 10
      const { baseScore, timeBonus } = difficultySettings[difficulty]
      const speedBonus = Math.max(0, timeBonus - questionTime * 10)
      const questionScore = baseScore + speedBonus
      
      setScore(prev => prev + questionScore)
      toast.success(`Correct! +${Math.round(questionScore)} points`)
    } else {
      toast.error('Incorrect!')
    }

    // Move to next question after delay
    setTimeout(() => {
      if (currentQuestionIndex + 1 < questions.length) {
        setCurrentQuestionIndex(prev => prev + 1)
        setSelectedAnswer(null)
        setShowResult(false)
        setQuestionStartTime(new Date())
      } else {
        completeGame()
      }
    }, 2000)
  }

  const completeGame = async () => {
    const finalScore = score
    setGameState('completed')

    try {
      await supabase.from('game_scores').insert({
        user_id: user.id,
        game_type: 'trivia',
        score: finalScore,
        difficulty,
        duration: timeElapsed
      })
      
      toast.success('Trivia completed! Score saved.')
    } catch (error) {
      console.error('Error saving score:', error)
      toast.error('Trivia completed, but failed to save score.')
    }
  }

  const resetGame = () => {
    setGameState('setup')
    setQuestions([])
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(0)
    setCorrectAnswers(0)
    setTimeElapsed(0)
    setGameStartTime(null)
    setQuestionStartTime(null)
  }

  const getCurrentQuestion = () => questions[currentQuestionIndex]
  const getShuffledAnswers = () => {
    const question = getCurrentQuestion()
    if (!question) return []
    
    return shuffleArray([
      question.correct_answer,
      ...question.incorrect_answers
    ])
  }

  if (gameState === 'setup') {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <HelpCircle className="h-16 w-16 text-red-600 mx-auto mb-4 animate-bounce-slow" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quick Trivia</h1>
          <p className="text-gray-600">Test your general knowledge</p>
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
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="text-left">
                    <div className="font-medium text-gray-900 capitalize">{level}</div>
                    <div className="text-sm text-gray-600">{settings.questionsCount} questions</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">
                      {level === 'easy' ? 'Basic' : level === 'medium' ? 'Moderate' : 'Challenging'}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={initializeGame}
            className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Start Quiz
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
    const accuracy = Math.round((correctAnswers / questions.length) * 100)
    
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <Trophy className="h-16 w-16 text-yellow-600 mx-auto mb-4 animate-bounce-slow" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Complete!</h1>
          <p className="text-gray-600">Great job testing your knowledge</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-red-600 mb-2">{score}</div>
            <div className="text-gray-600">Final Score</div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{correctAnswers}/{questions.length}</div>
              <div className="text-sm text-gray-600">Correct</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{accuracy}%</div>
              <div className="text-sm text-gray-600">Accuracy</div>
            </div>
          </div>

          <div className="text-center mb-6">
            <div className="text-lg font-bold text-gray-900">{formatTime(timeElapsed)}</div>
            <div className="text-sm text-gray-600">Total Time</div>
          </div>

          <div className="space-y-3">
            <button
              onClick={resetGame}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
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

  const currentQuestion = getCurrentQuestion()
  const shuffledAnswers = getShuffledAnswers()

  if (!currentQuestion) return null

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Game Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quick Trivia</h1>
          <p className="text-gray-600 capitalize">{difficulty} difficulty</p>
        </div>
        <div className="flex space-x-4">
          <Link
            href="/games"
            className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
          >
            <Home className="h-4 w-4" />
            <span>Games</span>
          </Link>
          <button
            onClick={resetGame}
            className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <span className="text-sm text-gray-600">
            Score: {score}
          </span>
        </div>
        <div className="bg-gray-200 rounded-full h-2">
          <div 
            className="bg-red-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <div className="text-center mb-6">
          <div className="text-sm text-red-600 font-medium mb-2">{currentQuestion.category}</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {currentQuestion.question}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {shuffledAnswers.map((answer, index) => {
            let buttonClass = "w-full p-4 text-left border-2 rounded-lg transition-all duration-200 "
            
            if (showResult) {
              if (answer === currentQuestion.correct_answer) {
                buttonClass += "border-green-500 bg-green-100 text-green-800"
              } else if (answer === selectedAnswer) {
                buttonClass += "border-red-500 bg-red-100 text-red-800"
              } else {
                buttonClass += "border-gray-300 bg-gray-100 text-gray-600"
              }
            } else {
              buttonClass += "border-gray-300 hover:border-red-500 hover:bg-red-50 text-gray-900"
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(answer)}
                disabled={showResult}
                className={buttonClass}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{answer}</span>
                  {showResult && answer === currentQuestion.correct_answer && (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  )}
                  {showResult && answer === selectedAnswer && answer !== currentQuestion.correct_answer && (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-lg text-center">
          <div className="text-2xl font-bold text-red-600">{correctAnswers}</div>
          <div className="text-sm text-gray-600">Correct</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-lg text-center">
          <div className="text-2xl font-bold text-blue-600">{score}</div>
          <div className="text-sm text-gray-600">Score</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-lg text-center">
          <div className="text-2xl font-bold text-purple-600">{formatTime(timeElapsed)}</div>
          <div className="text-sm text-gray-600">Time</div>
        </div>
      </div>
    </div>
  )
}
