'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from "next/link"
import { Timer, Target, Users, ArrowRight, Brain } from "lucide-react"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { useAuth } from "@/components/providers/AuthProvider"

export default function LandingPageContent() {
  const { user, loading } = useAuth()

  console.log('Landing page - Loading:', loading, 'User:', !!user)

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 gradient-bg-animated particles-bg relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
            Productive Breaks,
            <span className="text-yellow-300"> Focused Mind</span>
          </h1>
          <p className="text-xl text-white mb-8 max-w-3xl mx-auto animate-fade-in-delay glass-effect p-6 rounded-xl">
            Combine casual brain games, productivity tools, and mindful break activities
            to stay focused and relaxed during work or study sessions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-delay-2">
            {user ? (
              <Link href="/dashboard" className="btn-gradient-primary text-lg px-8 py-3 rounded-xl font-semibold transform hover:scale-105 transition-all duration-200 animate-glow">
                Go to Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            ) : (
              <Link href="/signup" className="btn-gradient-primary text-lg px-8 py-3 rounded-xl font-semibold transform hover:scale-105 transition-all duration-200 animate-glow">
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            )}
            <Link href="#demo" className="btn-gradient-success text-lg px-8 py-3 rounded-xl font-semibold transform hover:scale-105 transition-all duration-200">
              Watch Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Better Focus
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A comprehensive platform designed to enhance your productivity through strategic breaks and engaging activities.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Brain Games</h3>
              <p className="text-gray-600">
                Engaging mini-games to stimulate your mind during breaks
              </p>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Timer className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Focus Timer</h3>
              <p className="text-gray-600">
                Pomodoro technique with customizable intervals and notifications
              </p>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Habit Tracker</h3>
              <p className="text-gray-600">
                Build and maintain healthy daily habits with streak tracking
              </p>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Community</h3>
              <p className="text-gray-600">
                Compete with friends and climb the leaderboards
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
