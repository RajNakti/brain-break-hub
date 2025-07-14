import DashboardWrapper from '@/components/dashboard/DashboardWrapper'
import ProtectedRoute from '@/components/auth/ProtectedRoute'

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardWrapper />
    </ProtectedRoute>
  )
}
