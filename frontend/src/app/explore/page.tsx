'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import OnboardingGuard from '@/components/OnboardingGuard'
import Navbar from '@/components/Navbar'
import FeedTabs from '@/components/FeedTabs'
import FieldFilter from '@/components/FieldFilter'
import PortfolioCard from '@/components/PortfolioCard'
import SkeletonCard from '@/components/SkeletonCard'
import { portfolioApi } from '@/lib/api/portfolios'
import { Portfolio, FeedType, FieldType } from '@/types'
import Link from 'next/link'

const SKELETON_COUNT = 8

export default function ExplorePage() {
  const [feed, setFeed] = useState<FeedType>('trending')
  const [field, setField] = useState<FieldType>('ALL')
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [error, setError] = useState('')

  // Ref for infinite scroll sentinel element
  const sentinelRef = useRef<HTMLDivElement>(null)

  // Fetch feed from scratch
  const fetchFeed = useCallback(async () => {
    setLoading(true)
    setError('')
    setPortfolios([])
    setNextCursor(null)

    try {
      const result = await portfolioApi.getFeed(feed, field)
      setPortfolios(result.items)
      setNextCursor(result.nextCursor)
      setHasMore(result.hasMore)
    } catch {
      setError('Failed to load portfolios. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [feed, field])

  // Load more (infinite scroll)
  const loadMore = useCallback(async () => {
    if (!hasMore || !nextCursor || loadingMore) return

    setLoadingMore(true)

    try {
      const result = await portfolioApi.getFeed(feed, field, nextCursor)
      setPortfolios((prev) => [...prev, ...result.items])
      setNextCursor(result.nextCursor)
      setHasMore(result.hasMore)
    } catch {
      // Silent fail on load more
    } finally {
      setLoadingMore(false)
    }
  }, [feed, field, nextCursor, hasMore, loadingMore])

  // Re-fetch when tab or filter changes
  useEffect(() => {
    fetchFeed()
  }, [fetchFeed])

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMore()
        }
      },
      { threshold: 0.1 }
    )

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current)
    }

    return () => observer.disconnect()
  }, [hasMore, loadingMore, loadMore])

  // Tab change resets field state
  const handleFeedChange = (newFeed: FeedType) => {
    setFeed(newFeed)
    setField('ALL')
  }

  return (
    <OnboardingGuard>
      <div className="min-h-screen bg-gray-950">
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-1">
              Developer Portfolios
            </h1>
            <p className="text-gray-500">
              Discover and upvote the best developer portfolio designs
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <FeedTabs active={feed} onChange={handleFeedChange} />
          </div>

          <div className="mb-8">
            <FieldFilter active={field} onChange={setField} />
          </div>

          {error && (
            <div className="text-center py-16">
              <p className="text-red-400 mb-4">{error}</p>
              <button
                onClick={fetchFeed}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {!loading && !error && portfolios.length === 0 && (
            <div className="text-center py-24">
              <p className="text-5xl mb-4">🌱</p>
              <h3 className="text-white font-bold text-xl mb-2">
                No portfolios yet
              </h3>
              <p className="text-gray-500 mb-6">
                Be the first to submit your portfolio
              </p>

              <Link
                href="/submit"
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-colors"
              >
                Submit Yours →
              </Link>
            </div>
          )}

          {!loading && portfolios.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {portfolios.map((portfolio, index) => (
                <PortfolioCard
                  key={portfolio.id}
                  portfolio={portfolio}
                  index={index}
                />
              ))}
            </div>
          )}

          <div ref={sentinelRef} className="h-8 mt-8" />

          {loadingMore && (
            <div className="text-center py-8">
              <div className="inline-block w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!hasMore && portfolios.length > 0 && !loading && (
            <p className="text-center text-gray-600 text-sm py-8">
              You&apos;ve seen all portfolios
            </p>
          )}
        </div>
      </div>
    </OnboardingGuard>
  )
}
