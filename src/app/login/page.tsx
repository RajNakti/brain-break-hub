import AuthForm from '@/components/auth/AuthForm'

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function LoginPage() {
  return <AuthForm mode="signin" />
}
