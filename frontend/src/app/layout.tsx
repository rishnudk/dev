import { Inter } from 'next/font/google'
import './globals.css'
import type { Metadata } from 'next'
import ClientProviders from '@/components/ClientProviders'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DevShowcase - Portfolio Inspiration and Talent Discovery',
  description:
    'Find the best developer portfolio designs and discover standout candidates for your hiring team.',
  openGraph: {
    title: 'DevShowcase',
    description:
      'Explore developer portfolio inspiration and discover high-signal candidates for hiring teams.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-950 text-white`}>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  )
}