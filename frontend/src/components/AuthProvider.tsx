'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/store/auth.store'
import api from '@/lib/axios'

export default function AuthProvider({
  children
}: {
  children: React.ReactNode
}) {
  const { setAuth, logout } = useAuthStore()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return

    // Token exists — fetch current user
    api.get('/auth/me')
      .then(({ data }) => {
        setAuth(data.data, token)
      })
      .catch(() => {
        // Token invalid or expired — clear it
        logout()
      })
  }, [])

  return <>{children}</>
}