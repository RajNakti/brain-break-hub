'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/AuthProvider'
import Header from '@/components/layout/Header'
import HabitsTracker from '@/components/habits/HabitsTracker'
import { Brain } from 'lucide-react'

export default function HabitsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50">
        <div className="text-center">
          <Brain className="h-16 w-16 text-orange-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading habits tracker...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50">
      <Header />
      <HabitsTracker user={user} />
    </div>
  )
}
