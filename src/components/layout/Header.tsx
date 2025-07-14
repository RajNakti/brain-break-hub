'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Brain, Menu, X, User, LogOut, Coins } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/components/providers/AuthProvider'
import toast from 'react-hot-toast'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const { user, signOut, loading } = useAuth()
  const pathname = usePathname()

  useEffect(() => {
    if (user) {
      loadProfile(user.id)
    } else {
      setProfile(null)
    }
  }, [user])

  const loadProfile = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    setProfile(data)
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success('Signed out successfully')
    } catch (error) {
      toast.error('Error signing out')
    }
  }

  const isAuthPage = pathname === '/login' || pathname === '/signup'
  const isDashboard = pathname?.startsWith('/dashboard')

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href={user ? "/dashboard" : "/"} className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Brain Break Hub</span>
          </Link>

          {/* Desktop Navigation */}
          {!isAuthPage && (
            <nav className="hidden md:flex space-x-8">
              {user ? (
                <>
                  <Link 
                    href="/dashboard" 
                    className={`transition-colors ${
                      pathname === '/dashboard' 
                        ? 'text-blue-600 font-medium' 
                        : 'text-gray-600 hover:text-blue-600'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    href="/games" 
                    className={`transition-colors ${
                      pathname === '/games' 
                        ? 'text-blue-600 font-medium' 
                        : 'text-gray-600 hover:text-blue-600'
                    }`}
                  >
                    Games
                  </Link>
                  <Link 
                    href="/focus" 
                    className={`transition-colors ${
                      pathname === '/focus' 
                        ? 'text-blue-600 font-medium' 
                        : 'text-gray-600 hover:text-blue-600'
                    }`}
                  >
                    Focus Timer
                  </Link>
                  <Link 
                    href="/habits" 
                    className={`transition-colors ${
                      pathname === '/habits' 
                        ? 'text-blue-600 font-medium' 
                        : 'text-gray-600 hover:text-blue-600'
                    }`}
                  >
                    Habits
                  </Link>
                  <Link 
                    href="/leaderboard" 
                    className={`transition-colors ${
                      pathname === '/leaderboard' 
                        ? 'text-blue-600 font-medium' 
                        : 'text-gray-600 hover:text-blue-600'
                    }`}
                  >
                    Leaderboard
                  </Link>
                </>
              ) : (
                <>
                  <Link href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Features
                  </Link>
                  <Link href="#games" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Games
                  </Link>
                  <Link href="#about" className="text-gray-600 hover:text-blue-600 transition-colors">
                    About
                  </Link>
                </>
              )}
            </nav>
          )}

          {/* Desktop Auth/User Menu */}
          {!isAuthPage && (
            <div className="hidden md:flex items-center space-x-4">
              {loading ? (
                <div className="w-20 h-8 bg-gray-200 animate-pulse rounded"></div>
              ) : user ? (
                <>
                  {profile && (
                    <div className="flex items-center space-x-2 bg-yellow-100 px-3 py-1 rounded-full">
                      <Coins className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-800">{profile.coins || 0}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-gray-600" />
                    <span className="text-sm text-gray-700">
                      {profile?.full_name || user.email?.split('@')[0]}
                    </span>
                  </div>

                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="text-sm">Sign Out</span>
                  </button>
                </>
              ) : (
                <>

                  <Link
                    href="/login"
                    className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="btn-primary"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          )}

          {/* Mobile menu button */}
          {!isAuthPage && (
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          )}
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && !isAuthPage && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              {loading ? (
                <div className="w-32 h-6 bg-gray-200 animate-pulse rounded"></div>
              ) : user ? (
                <>
                  <Link 
                    href="/dashboard" 
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    href="/games" 
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Games
                  </Link>
                  <Link 
                    href="/focus" 
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Focus Timer
                  </Link>
                  <Link 
                    href="/habits" 
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Habits
                  </Link>
                  <Link 
                    href="/leaderboard" 
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Leaderboard
                  </Link>
                  <div className="pt-4 border-t border-gray-200">
                    {profile && (
                      <div className="flex items-center space-x-2 bg-yellow-100 px-3 py-1 rounded-full mb-4 w-fit">
                        <Coins className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm font-medium text-yellow-800">{profile.coins || 0}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2 mb-4">
                      <User className="h-5 w-5 text-gray-600" />
                      <span className="text-sm text-gray-700">
                        {profile?.full_name || user.email?.split('@')[0]}
                      </span>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="text-sm">Sign Out</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Features
                  </Link>
                  <Link href="#games" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Games
                  </Link>
                  <Link href="#about" className="text-gray-600 hover:text-blue-600 transition-colors">
                    About
                  </Link>
                  <div className="pt-4 border-t border-gray-200 flex flex-col space-y-2">
                    <Link 
                      href="/login" 
                      className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link 
                      href="/signup" 
                      className="btn-primary w-fit"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Get Started
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
