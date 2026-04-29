'use client'

import { Inter } from 'next/font/google'
import './globals.css'
import AuthProvider from '@/components/AuthProvider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import ErrorBoundary from '@/components/ErrorBoundary'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default:  'DevShowcase — Discover Developer Portfolios',
    template: '%s | DevShowcase'
  },
  description:
    'Discover and upvote the best developer portfolio designs. ' +
    'Built by developers, for developers.',
  keywords: [
    'developer portfolio', 'portfolio showcase',
    'frontend developer', 'web developer', 'portfolio design'
  ],
  openGraph: {
    title:       'DevShowcase',
    description: 'Discover and upvote the best developer portfolio designs',
    type:        'website',
    siteName:    'DevShowcase',
  },
  twitter: {
    card:        'summary_large_image',
    title:       'DevShowcase',
    description: 'Discover and upvote the best developer portfolio designs',
  }
}

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-950 text-white`}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  )
}