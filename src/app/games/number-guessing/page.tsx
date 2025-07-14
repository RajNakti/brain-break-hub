'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/AuthProvider'
import NumberGuessingGame from '@/components/games/NumberGuessingGame'
import Header from '@/components/layout/Header'
import { Brain } from 'lucide-react'

export default function NumberGuessingPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <Brain className="h-16 w-16 text-green-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading Number Guessing Game...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <Header />
      <NumberGuessingGame user={user} />
    </div>
  )
}
