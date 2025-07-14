import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Shield, Eye, Lock, Users, Database, Settings } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="bg-gradient-to-r from-blue-400 to-purple-600 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <Shield className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
          <p className="text-sm text-gray-500 mt-4">Last updated: January 2024</p>
        </div>

        {/* Quick Overview */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Privacy at a Glance</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 p-3 rounded-lg w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Eye className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Transparency</h3>
              <p className="text-sm text-gray-600">We're clear about what data we collect and why</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 p-3 rounded-lg w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Lock className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Security</h3>
              <p className="text-sm text-gray-600">Your data is encrypted and securely stored</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 p-3 rounded-lg w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Settings className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Control</h3>
              <p className="text-sm text-gray-600">You control your data and privacy settings</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Account Information</h3>
                <p className="text-gray-600">When you create an account, we collect your email address, name, and password (encrypted).</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Usage Data</h3>
                <p className="text-gray-600">We collect information about how you use our platform, including game scores, focus session data, and habit tracking information.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Technical Information</h3>
                <p className="text-gray-600">We automatically collect technical information such as your IP address, browser type, and device information to improve our service.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>Provide and improve our services</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>Personalize your experience and track your progress</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>Send you important updates and notifications</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>Analyze usage patterns to improve our platform</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>Ensure security and prevent fraud</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
            <p className="text-gray-600 mb-4">
              We implement industry-standard security measures to protect your personal information:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Encryption</h4>
                <p className="text-sm text-gray-600">All data is encrypted in transit and at rest</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Access Control</h4>
                <p className="text-sm text-gray-600">Limited access to authorized personnel only</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Regular Audits</h4>
                <p className="text-sm text-gray-600">Regular security assessments and updates</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Secure Infrastructure</h4>
                <p className="text-sm text-gray-600">Hosted on secure, compliant cloud platforms</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
            <p className="text-gray-600 mb-4">You have the following rights regarding your personal data:</p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Database className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">Access</h4>
                  <p className="text-sm text-gray-600">Request a copy of your personal data</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Settings className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">Correction</h4>
                  <p className="text-sm text-gray-600">Update or correct your information</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Lock className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">Deletion</h4>
                  <p className="text-sm text-gray-600">Request deletion of your account and data</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">Portability</h4>
                  <p className="text-sm text-gray-600">Export your data in a portable format</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies and Tracking</h2>
            <p className="text-gray-600 mb-4">
              We use cookies and similar technologies to enhance your experience. These help us:
            </p>
            <ul className="space-y-2 text-gray-600">
              <li>• Remember your preferences and settings</li>
              <li>• Keep you logged in securely</li>
              <li>• Analyze how our platform is used</li>
              <li>• Improve performance and functionality</li>
            </ul>
            <p className="text-gray-600 mt-4">
              You can control cookie settings through your browser preferences.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-600 mb-4">
              If you have any questions about this Privacy Policy or how we handle your data, please contact us:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600">
                <strong>Email:</strong> privacy@brainbreakhub.com<br />
                <strong>Address:</strong> 123 Innovation Drive, Tech Valley, CA 94000
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
