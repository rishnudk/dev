'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import api from '@/lib/axios'
import { useAuthStore } from '@/store/auth.store'

export default function VerifyPage() {
  const router       = useRouter()
  const params       = useSearchParams()
  const setAuth      = useAuthStore((s) => s.setAuth)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = params.get('token')

    if (!token) {
      setError('No token found in URL')
      return
    }

    api.get(`/auth/verify?token=${token}`)
      .then(({ data }) => {
        const { token: jwt, user, isNewUser } = data.data

        // Save to store + localStorage
        setAuth(user, jwt)

        // Redirect based on onboarding status
        if (isNewUser) {
          router.replace('/onboarding')
        } else {
          router.replace('/')
        }
      })
      .catch((err) => {
        setError(
          err.response?.data?.message || 'Invalid or expired link'
        )
      })
  }, [])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="text-center p-8">
          <div className="text-5xl mb-4">❌</div>
          <h1 className="text-xl font-bold text-white mb-2">Link Invalid</h1>
          <p className="text-gray-400 mb-4">{error}</p>
          <a href="/login" className="text-indigo-400 hover:underline">
            Request a new link
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="text-center">
        <div className="text-white text-lg">Verifying your link...</div>
      </div>
    </div>
  )
}