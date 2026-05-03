'use client'

import { SessionProvider } from 'next-auth/react'
import AuthProvider from '@/components/AuthProvider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import ErrorBoundary from '@/components/ErrorBoundary'

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode
}) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ErrorBoundary>{children}</ErrorBoundary>
        </AuthProvider>
      </QueryClientProvider>
    </SessionProvider>
  )
}
