import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Brain, Target, Users, Zap, Heart, Award } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="bg-gradient-to-r from-blue-400 to-purple-600 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <Brain className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            About Brain Break Hub
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're on a mission to revolutionize how people balance productivity and well-being through 
            engaging brain games, mindful breaks, and smart productivity tools.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-gray-600 mb-4">
                In today's fast-paced world, finding the right balance between productivity and mental well-being 
                is more important than ever. Brain Break Hub was created to bridge this gap by providing a 
                comprehensive platform that makes taking breaks both enjoyable and beneficial.
              </p>
              <p className="text-gray-600">
                We believe that the best breaks are those that engage your mind in different ways, helping you 
                return to work refreshed, focused, and more creative than before.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-6 rounded-xl text-center">
                <Target className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Focus</h3>
                <p className="text-sm text-gray-600">Enhanced concentration through structured breaks</p>
              </div>
              <div className="bg-purple-50 p-6 rounded-xl text-center">
                <Zap className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Energy</h3>
                <p className="text-sm text-gray-600">Revitalized mind through engaging activities</p>
              </div>
              <div className="bg-green-50 p-6 rounded-xl text-center">
                <Heart className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Wellness</h3>
                <p className="text-sm text-gray-600">Mental health through mindful practices</p>
              </div>
              <div className="bg-orange-50 p-6 rounded-xl text-center">
                <Award className="h-8 w-8 text-orange-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Growth</h3>
                <p className="text-sm text-gray-600">Personal development through habit building</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">What Makes Us Different</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="bg-gradient-to-r from-blue-400 to-blue-600 p-3 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Science-Based Games</h3>
              <p className="text-gray-600">
                Our brain games are designed based on cognitive science research to improve memory, 
                attention, and problem-solving skills while being genuinely fun to play.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="bg-gradient-to-r from-green-400 to-green-600 p-3 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Productivity Integration</h3>
              <p className="text-gray-600">
                Seamlessly integrate breaks into your workflow with our focus timer, habit tracker, 
                and progress monitoring tools designed for modern professionals.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="bg-gradient-to-r from-purple-400 to-purple-600 p-3 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Community Driven</h3>
              <p className="text-gray-600">
                Join a community of like-minded individuals who understand the importance of 
                balanced productivity and support each other's growth journey.
              </p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white p-12 text-center">
          <h2 className="text-3xl font-bold mb-6">Our Values</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-2">Innovation</h3>
              <p className="text-blue-100">Constantly improving and evolving our platform</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Accessibility</h3>
              <p className="text-blue-100">Making wellness tools available to everyone</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Quality</h3>
              <p className="text-blue-100">Delivering exceptional user experiences</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Community</h3>
              <p className="text-blue-100">Building connections and supporting growth</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
