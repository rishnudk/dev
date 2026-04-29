'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import api from '@/lib/axios'
import { useAuthStore } from '@/store/auth.store'
import { Portfolio } from '@/types'

const FIELD_LABELS: Record<string, string> = {
  FRONTEND:  'Frontend',
  BACKEND:   'Backend',
  FULLSTACK: 'Full Stack',
  MOBILE:    'Mobile',
  DEVOPS:    'DevOps',
  DATA:      'Data',
  DESIGN:    'Design',
  OTHER:     'Other',
}

interface Props {
  portfolio: Portfolio
  index:     number  // for staggered animation
}

export default function PortfolioCard({ portfolio, index }: Props) {
  const { isLoggedIn } = useAuthStore()

  const [voteCount, setVoteCount] = useState(portfolio.voteCount)
  const [hasVoted,  setHasVoted]  = useState(portfolio.hasVoted)
  const [voting,    setVoting]    = useState(false)

  const handleVote = async (e: React.MouseEvent) => {
    e.preventDefault()  // don't navigate to portfolio page

    if (!isLoggedIn) {
      window.location.href = '/login'
      return
    }

    if (voting) return
    setVoting(true)

    // Optimistic update — update UI instantly
    const wasVoted    = hasVoted
    const prevCount   = voteCount

    setHasVoted(!wasVoted)
    setVoteCount(wasVoted ? voteCount - 1 : voteCount + 1)

    try {
      if (wasVoted) {
        await api.delete(`/portfolios/${portfolio.id}/vote`)
      } else {
        await api.post(`/portfolios/${portfolio.id}/vote`)
      }
    } catch {
      // Rollback on error
      setHasVoted(wasVoted)
      setVoteCount(prevCount)
    } finally {
      setVoting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link href={`/p/${portfolio.id}`}>
        <div className="group relative rounded-2xl overflow-hidden border
                        border-gray-800 hover:border-gray-600
                        transition-all duration-300 hover:-translate-y-1
                        hover:shadow-2xl hover:shadow-indigo-500/10 bg-gray-900">

          {/* ── Hero Image Background ── */}
          <div className="relative h-48 overflow-hidden">
            <Image
              src={portfolio.heroImageUrl}
              alt={portfolio.title}
              fill
              className="object-cover transition-transform duration-500
                         group-hover:scale-105"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-linear-to-t
                            from-gray-900 via-gray-900/60 to-transparent" />

            {/* Tags on top of image */}
            <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
              {portfolio.tags.slice(0, 3).map(({ tag }) => (
                <span
                  key={tag.id}
                  className="px-2 py-0.5 bg-black/50 backdrop-blur-sm
                             border border-white/10 text-white/80
                             text-xs rounded-full"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>

          {/* ── Card Body ── */}
          <div className="p-4">

            {/* Author row */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">

                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex
                                items-center justify-center text-white
                                text-xs font-bold shrink-0">
                  {portfolio.user.avatarUrl ? (
                    <Image
                      src={portfolio.user.avatarUrl}
                      alt={portfolio.user.name}
                      width={32}
                      height={32}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    portfolio.user.name?.[0]?.toUpperCase() ?? '?'
                  )}
                </div>

                <div>
                  <p className="text-white text-sm font-medium leading-tight">
                    {portfolio.user.name}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {portfolio.user.field
                      ? FIELD_LABELS[portfolio.user.field]
                      : 'Developer'
                    }
                  </p>
                </div>
              </div>

              {/* Vote button */}
              <button
                onClick={handleVote}
                disabled={voting}
                className={`flex flex-col items-center px-3 py-1.5
                           rounded-xl border transition-all duration-150
                           disabled:opacity-60 ${
                  hasVoted
                    ? 'bg-indigo-600 border-indigo-500 text-white'
                    : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-indigo-500 hover:text-indigo-400'
                }`}
              >
                <span className={`text-sm leading-none transition-transform
                                  ${voting ? 'scale-75' : ''}`}>
                  ▲
                </span>
                <span className="text-xs font-bold mt-0.5">{voteCount}</span>
              </button>
            </div>

            {/* Title */}
            <h3 className="text-white font-semibold leading-snug
                           group-hover:text-indigo-300 transition-colors">
              {portfolio.title}
            </h3>

            {/* Description preview */}
            <p className="text-gray-500 text-sm mt-1 line-clamp-2">
              {portfolio.description}
            </p>

          </div>
        </div>
      </Link>
    </motion.div>
  )
}