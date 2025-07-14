'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/AuthProvider'
import { supabase } from '@/lib/supabase'
import DashboardContent from './DashboardContent'
import Header from '@/components/layout/Header'
import { Brain } from 'lucide-react'

export default function DashboardWrapper() {
  const { user, loading } = useAuth()
  const [profile, setProfile] = useState<any>(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    console.log('DashboardWrapper - Loading:', loading, 'User:', !!user)

    if (!loading && !user) {
      // Redirect to login if not authenticated
      console.log('No user found, redirecting to login...')
      router.push('/login')
      return
    }

    if (user) {
      console.log('User found, loading profile...')
      loadProfile()
    }
  }, [user, loading, router])

  const loadProfile = async () => {
    if (!user) return

    try {
      console.log('Loading profile for user:', user.id)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('Profile query error:', error)
        // If profile doesn't exist, create one
        if (error.code === 'PGRST116') {
          console.log('Profile not found, creating new profile...')
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              email: user.email,
              full_name: user.user_metadata?.full_name || null,
              coins: 0
            })
            .select()
            .single()

          if (createError) {
            console.error('Error creating profile:', createError)
          } else {
            setProfile(newProfile)
          }
        }
      } else {
        console.log('Profile loaded successfully:', data)
        setProfile(data)
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setProfileLoading(false)
    }
  }

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <Brain className="h-16 w-16 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header />
      <DashboardContent user={user} profile={profile} />
    </div>
  )
}
