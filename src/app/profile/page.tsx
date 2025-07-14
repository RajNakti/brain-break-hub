import { createClient } from '@/lib/auth'
import { redirect } from 'next/navigation'
import ProfileContent from '@/components/profile/ProfileContent'
import Header from '@/components/layout/Header'

export default async function ProfilePage() {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header />
      <ProfileContent user={user} />
    </div>
  )
}
