'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/AuthProvider'
import WordPuzzle from '@/components/games/WordPuzzle'
import Header from '@/components/layout/Header'
import { Brain } from 'lucide-react'

export default function WordPuzzlePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="text-center">
          <Brain className="h-16 w-16 text-green-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading Word Puzzle...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <Header />
      <WordPuzzle user={user} />
    </div>
  )
}
