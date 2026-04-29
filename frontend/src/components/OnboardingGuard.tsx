'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'

export default function OnboardingGuard({
  children,
  requireAuth = false  // ← new prop
}: {
  children:    React.ReactNode
  requireAuth?: boolean
}) {
  const router             = useRouter()
  const { user, isLoggedIn } = useAuthStore()

  useEffect(() => {
    if (requireAuth && !isLoggedIn) {
      router.replace('/login')
      return
    }

    if (isLoggedIn && user && !user.isOnboarded) {
      router.replace('/onboarding')
    }
  }, [isLoggedIn, user, requireAuth])

  return <>{children}</>
}