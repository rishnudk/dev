'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import api from '@/lib/axios'
import { Portfolio } from '@/types'

export default function PortfolioPage() {
  const { id }  = useParams()
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState('')

  useEffect(() => {
    api.get(`/portfolios/${id}`)
      .then(({ data }) => setPortfolio(data.data))
      .catch(() => setError('Portfolio not found'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    )
  }

  if (error || !portfolio) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl mb-2">😕</p>
          <p className="text-white font-bold mb-1">Portfolio not found</p>
          <Link href="/" className="text-indigo-400 hover:underline text-sm">
            Back to home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950">

      {/* Hero Image */}
      <div className="relative w-full h-72 md:h-96">
        <Image
          src={portfolio.heroImageUrl}
          alt={portfolio.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-gray-950 via-gray-950/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 -mt-16 relative z-10 pb-16">

        {/* Title + Vote */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-3xl font-bold text-white">
            {portfolio.title}
          </h1>
          <div className="flex flex-col items-center bg-gray-800
                          border border-gray-700 rounded-xl px-4 py-2 min-w-16">
            <span className="text-2xl">▲</span>
            <span className="text-white font-bold">{portfolio.voteCount}</span>
          </div>
        </div>

        {/* Author */}
        <Link
          href={`/u/${portfolio.user.username}`}
          className="flex items-center gap-3 mb-6 group"
        >
          <div className="w-10 h-10 rounded-full bg-indigo-600
                          flex items-center justify-center text-white font-bold">
            {portfolio.user.name?.[0]?.toUpperCase() ?? '?'}
          </div>
          <div>
            <p className="text-white font-medium group-hover:text-indigo-400 transition-colors">
              {portfolio.user.name}
            </p>
            <p className="text-gray-500 text-sm">{portfolio.user.field}</p>
          </div>
        </Link>

        {/* Description */}
        <p className="text-gray-300 leading-relaxed mb-6">
          {portfolio.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {portfolio.tags.map(({ tag }) => (
            <span
              key={tag.id}
              className="px-3 py-1 bg-gray-800 border border-gray-700
                         text-gray-400 text-sm rounded-full"
            >
              {tag.name}
            </span>
          ))}
        </div>

        {/* Live URL button */}
        <Link
          href={portfolio.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3
                     bg-indigo-600 hover:bg-indigo-500 text-white
                     font-semibold rounded-xl transition-colors"
        >
          View Live Portfolio →
        </Link>

      </div>
    </div>
  )
}