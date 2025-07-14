import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { FileText, Scale, AlertTriangle, CheckCircle } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="bg-gradient-to-r from-blue-400 to-purple-600 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <FileText className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Terms of Service
          </h1>
          <p className="text-xl text-gray-600">
            Please read these terms carefully before using Brain Break Hub.
          </p>
          <p className="text-sm text-gray-500 mt-4">Last updated: January 2024</p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-600">
              By accessing and using Brain Break Hub ("the Service"), you accept and agree to be bound by the terms 
              and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
            <p className="text-gray-600 mb-4">
              Brain Break Hub provides a platform that combines:
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                <span>Brain training games and cognitive exercises</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                <span>Productivity tools including focus timers and habit trackers</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                <span>Guided break activities and mindfulness exercises</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                <span>Progress tracking and analytics</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Account Creation</h3>
                <p className="text-gray-600">
                  You must provide accurate and complete information when creating an account. 
                  You are responsible for maintaining the confidentiality of your account credentials.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Account Responsibility</h3>
                <p className="text-gray-600">
                  You are responsible for all activities that occur under your account. 
                  Notify us immediately of any unauthorized use of your account.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Acceptable Use</h2>
            <div className="bg-green-50 p-6 rounded-lg mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                You May:
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Use the service for personal productivity and wellness</li>
                <li>• Share your progress and achievements</li>
                <li>• Provide feedback and suggestions</li>
                <li>• Export your personal data</li>
              </ul>
            </div>
            
            <div className="bg-red-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                You May Not:
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Use the service for any illegal or unauthorized purpose</li>
                <li>• Attempt to gain unauthorized access to our systems</li>
                <li>• Interfere with or disrupt the service</li>
                <li>• Share your account with others</li>
                <li>• Use automated tools to access the service</li>
                <li>• Reverse engineer or copy our software</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Privacy and Data</h2>
            <p className="text-gray-600 mb-4">
              Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information. 
              By using our service, you agree to the collection and use of information in accordance with our Privacy Policy.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-blue-800 text-sm">
                <strong>Note:</strong> Please review our Privacy Policy for detailed information about data handling.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Intellectual Property</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Our Content</h3>
                <p className="text-gray-600">
                  All content, features, and functionality of the service are owned by Brain Break Hub and are protected 
                  by copyright, trademark, and other intellectual property laws.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Your Content</h3>
                <p className="text-gray-600">
                  You retain ownership of any content you create or upload. By using our service, you grant us a 
                  license to use your content to provide and improve our services.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Disclaimers and Limitations</h2>
            <div className="bg-yellow-50 p-6 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-yellow-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Important Notice</h3>
                  <p className="text-gray-600 mb-4">
                    Brain Break Hub is designed for wellness and productivity purposes. It is not intended to diagnose, 
                    treat, cure, or prevent any medical condition.
                  </p>
                  <p className="text-gray-600">
                    The service is provided "as is" without warranties of any kind. We do not guarantee that the service 
                    will be uninterrupted or error-free.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Termination</h2>
            <p className="text-gray-600 mb-4">
              We may terminate or suspend your account and access to the service at our sole discretion, without prior 
              notice, for conduct that we believe violates these Terms of Service or is harmful to other users, us, or third parties.
            </p>
            <p className="text-gray-600">
              You may terminate your account at any time by contacting us or using the account deletion feature in your settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Changes to Terms</h2>
            <p className="text-gray-600">
              We reserve the right to modify these terms at any time. We will notify users of any material changes via 
              email or through the service. Your continued use of the service after such modifications constitutes acceptance 
              of the updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contact Information</h2>
            <p className="text-gray-600 mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600">
                <strong>Email:</strong> legal@brainbreakhub.com<br />
                <strong>Address:</strong> 123 Innovation Drive, Tech Valley, CA 94000<br />
                <strong>Phone:</strong> +1 (555) 123-4567
              </p>
            </div>
          </section>

          <div className="border-t pt-8">
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <Scale className="h-5 w-5" />
              <span>By using Brain Break Hub, you acknowledge that you have read and agree to these Terms of Service.</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
