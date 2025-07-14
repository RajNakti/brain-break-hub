import Link from 'next/link'
import { Brain, ExternalLink } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Brain className="h-6 w-6" />
              <span className="text-lg font-bold">Brain Break Hub</span>
            </div>
            <p className="text-gray-400">
              Your companion for productive breaks and focused work sessions.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Features</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/games" className="hover:text-white transition-colors">
                  Brain Games
                </Link>
              </li>
              <li>
                <Link href="/focus" className="hover:text-white transition-colors">
                  Focus Timer
                </Link>
              </li>
              <li>
                <Link href="/habits" className="hover:text-white transition-colors">
                  Habit Tracker
                </Link>
              </li>
              <li>
                <Link href="/breaks" className="hover:text-white transition-colors">
                  Guided Breaks
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Twitter
                </a>
              </li>
              <li>
                <a href="/https://github.com/RajNakti" className="hover:text-white transition-colors">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  GitHub
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Discord
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center text-gray-400">
          <p>&copy; 2025 Brain Break Hub. All rights reserved.</p>
          <a
            href="http://raj-nakti-portfolio.netlify.app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium mt-4 sm:mt-0"
          >
            Created & Developed by Raj Nakti
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </footer>
  )
}
