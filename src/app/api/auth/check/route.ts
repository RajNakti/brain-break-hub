import { createClient } from '@/lib/auth'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json({ user: null, authenticated: false })
    }

    return NextResponse.json({ 
      user: {
        id: user.id,
        email: user.email,
        user_metadata: user.user_metadata
      }, 
      authenticated: true 
    })
  } catch (error) {
    return NextResponse.json({ user: null, authenticated: false })
  }
}
