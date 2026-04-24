'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'

export default function OnboardingGuard({
  children
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { user, isLoggedIn } = useAuthStore()

  useEffect(() => {
    // Not logged in → go to login
    if (!isLoggedIn) {
      router.replace('/login')
      return
    }

    // Logged in but not onboarded → go to onboarding
    if (isLoggedIn && user && !user.isOnboarded) {
      router.replace('/onboarding')
    }
  }, [isLoggedIn, user])

  return <>{children}</>
}