'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/AuthProvider'
import TriviaGame from '@/components/games/TriviaGame'
import Header from '@/components/layout/Header'
import { Brain } from 'lucide-react'

export default function TriviaPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-pink-50 to-orange-50">
        <div className="text-center">
          <Brain className="h-16 w-16 text-red-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading Trivia Game...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-orange-50">
      <Header />
      <TriviaGame user={user} />
    </div>
  )
}
