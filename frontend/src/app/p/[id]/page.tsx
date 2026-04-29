'use client'

import { useEffect, useState } from 'react'
import { useParams }           from 'next/navigation'
import Image                   from 'next/image'
import Link                    from 'next/link'
import api                     from '@/lib/axios'
import { useAuthStore }        from '@/store/auth.store'
import { Portfolio }           from '@/types'
import Navbar                  from '@/components/Navbar'

export default function PortfolioPage() {
  const { id }             = useParams()
  const { isLoggedIn }     = useAuthStore()

  const [portfolio,  setPortfolio]  = useState<Portfolio | null>(null)
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState('')
  const [voteCount,  setVoteCount]  = useState(0)
  const [hasVoted,   setHasVoted]   = useState(false)
  const [voting,     setVoting]     = useState(false)

  useEffect(() => {
    api.get(`/portfolios/${id}`)
      .then(({ data }) => {
        setPortfolio(data.data)
        setVoteCount(data.data.voteCount)
        setHasVoted(data.data.hasVoted)
      })
      .catch(() => setError('Portfolio not found'))
      .finally(() => setLoading(false))
  }, [id])

  const handleVote = async () => {
    if (!isLoggedIn) {
      window.location.href = '/login'
      return
    }

    if (voting) return
    setVoting(true)

    const wasVoted  = hasVoted
    const prevCount = voteCount

    // Optimistic update
    setHasVoted(!wasVoted)
    setVoteCount(wasVoted ? voteCount - 1 : voteCount + 1)

    try {
      await api.post(`/portfolios/${id}/vote`)
    } catch {
      // Rollback
      setHasVoted(wasVoted)
      setVoteCount(prevCount)
    } finally {
      setVoting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="w-8 h-8 border-2 border-indigo-500
                          border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  if (error || !portfolio) {
    return (
      <div className="min-h-screen bg-gray-950">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-4xl mb-3">😕</p>
            <p className="text-white font-bold mb-2">Portfolio not found</p>
            <Link href="/" className="text-indigo-400 hover:underline text-sm">
              Back to home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      {/* Hero */}
      <div className="relative w-full h-72 md:h-[420px]">
        <Image
          src={portfolio.heroImageUrl}
          alt={portfolio.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t
                        from-gray-950 via-gray-950/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 -mt-20 relative z-10 pb-20">

        {/* Vote button — prominent on detail page */}
        <div className="flex justify-end mb-6">
          <button
            onClick={handleVote}
            disabled={voting}
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl
                       border-2 font-semibold transition-all duration-200
                       disabled:opacity-60 text-lg ${
              hasVoted
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                : 'bg-gray-900 border-gray-700 text-gray-300 hover:border-indigo-500 hover:text-white'
            }`}
          >
            <span className={`transition-transform duration-200
                              ${voting ? 'scale-75' : 'scale-100'}`}>
              ▲
            </span>
            <span>{voteCount}</span>
            <span className="text-sm font-normal">
              {hasVoted ? 'Voted' : 'Upvote'}
            </span>
          </button>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          {portfolio.title}
        </h1>

        {/* Author */}
        <Link
          href={`/u/${portfolio.user.username}`}
          className="flex items-center gap-3 mb-6 group w-fit"
        >
          <div className="w-11 h-11 rounded-full bg-indigo-600
                          flex items-center justify-center
                          text-white font-bold">
            {portfolio.user.name?.[0]?.toUpperCase() ?? '?'}
          </div>
          <div>
            <p className="text-white font-semibold
                          group-hover:text-indigo-400 transition-colors">
              {portfolio.user.name}
            </p>
            <p className="text-gray-500 text-sm">
              {portfolio.user.field ?? 'Developer'}
            </p>
          </div>
        </Link>

        {/* Divider */}
        <div className="border-t border-gray-800 mb-6" />

        {/* Description */}
        <p className="text-gray-300 leading-relaxed text-lg mb-8">
          {portfolio.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {portfolio.tags.map(({ tag }) => (
            <span
              key={tag.id}
              className="px-3 py-1.5 bg-gray-800 border border-gray-700
                         text-gray-400 text-sm rounded-full"
            >
              {tag.name}
            </span>
          ))}
        </div>

        {/* CTA */}
        <Link
          href={portfolio.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-4
                     bg-indigo-600 hover:bg-indigo-500 text-white
                     font-semibold rounded-2xl transition-colors text-lg"
        >
          View Live Portfolio
          <span>→</span>
        </Link>

      </div>
    </div>
  )
}