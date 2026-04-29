'use client'

import { useEffect, useState }  from 'react'
import { useParams }            from 'next/navigation'
import Link                     from 'next/link'
import { motion }               from 'framer-motion'
import api                      from '@/lib/axios'
import { useAuthStore }         from '@/store/auth.store'
import { UserProfile }          from '@/types'
import Navbar                   from '@/components/Navbar'
import PortfolioCard            from '@/components/PortfolioCard'
import SkeletonCard             from '@/components/SkeletonCard'
import StatCard                 from '@/components/StatCard'
import EditProfileModal         from '@/components/EditProfileModal'
import { getFieldLabel, getInitials, formatDate } from '@/lib/helper'

export default function ProfilePage() {
  const { username }         = useParams<{ username: string }>()
  const { user: currentUser } = useAuthStore()

  const [profile,     setProfile]     = useState<UserProfile | null>(null)
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState('')
  const [showEdit,    setShowEdit]    = useState(false)

  const isOwnProfile = currentUser?.username === username

  useEffect(() => {
    setLoading(true)
    api.get(`/users/${username}/profile`)
      .then(({ data }) => setProfile(data.data))
      .catch(() => setError('User not found'))
      .finally(() => setLoading(false))
  }, [username])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950">
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 py-12">
          {/* Profile header skeleton */}
          <div className="flex items-start gap-6 mb-12 animate-pulse">
            <div className="w-24 h-24 rounded-full bg-gray-800 flex-shrink-0" />
            <div className="flex-1 pt-2">
              <div className="h-6 w-48 bg-gray-800 rounded mb-3" />
              <div className="h-4 w-32 bg-gray-700 rounded mb-2" />
              <div className="h-4 w-64 bg-gray-800 rounded" />
            </div>
          </div>
          {/* Card skeletons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
          </div>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-950">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-5xl mb-4">👤</p>
            <h2 className="text-white font-bold text-xl mb-2">
              User not found
            </h2>
            <p className="text-gray-500 mb-4">
              @{username} doesn't exist
            </p>
            <Link href="/" className="text-indigo-400 hover:underline">
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

      <main className="max-w-5xl mx-auto px-4 py-12">

        {/* ── Profile Header ─────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-12"
        >
          <div className="flex flex-col sm:flex-row items-start gap-6">

            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-indigo-600
                            flex items-center justify-center
                            text-white text-3xl font-bold flex-shrink-0
                            border-4 border-gray-800">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                getInitials(profile.name)
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row
                              sm:items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-white">
                  {profile.name}
                </h1>

                {/* Edit button — only for own profile */}
                {isOwnProfile && (
                  <button
                    onClick={() => setShowEdit(true)}
                    className="px-4 py-1.5 bg-gray-800 hover:bg-gray-700
                               border border-gray-700 text-gray-300
                               text-sm rounded-xl transition-colors w-fit"
                  >
                    ✏️ Edit Profile
                  </button>
                )}
              </div>

              <p className="text-indigo-400 font-medium mb-1">
                @{profile.username}
              </p>

              <p className="text-gray-400 text-sm mb-3">
                {getFieldLabel(profile.field)}
                <span className="text-gray-600 mx-2">·</span>
                Joined {formatDate(profile.createdAt)}
              </p>

              {/* Bio */}
              {profile.bio && (
                <p className="text-gray-300 max-w-xl mb-4">
                  {profile.bio}
                </p>
              )}

              {/* Links */}
              <div className="flex gap-3 flex-wrap">
                {profile.portfolioUrl && (
                  <a
                    href={profile.portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-gray-400
                               hover:text-white text-sm transition-colors"
                  >
                    🌐 Portfolio
                  </a>
                )}
                {profile.githubUrl && (
                  <a
                    href={profile.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-gray-400
                               hover:text-white text-sm transition-colors"
                  >
                    🐙 GitHub
                  </a>
                )}
                {profile.linkedinUrl && (
                  <a
                    href={profile.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-gray-400
                               hover:text-white text-sm transition-colors"
                  >
                    💼 LinkedIn
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* ── Stats Row ──────────────────────────────────── */}
          <div className="grid grid-cols-3 gap-4 mt-8 max-w-sm">
            <StatCard
              emoji="🗂️"
              label="Portfolios"
              value={profile.totalPortfolios}
            />
            <StatCard
              emoji="▲"
              label="Total Votes"
              value={profile.totalVotesReceived}
            />
            <StatCard
              emoji="🛠️"
              label="Technologies"
              value={profile.techStack.length}
            />
          </div>

          {/* ── Tech Stack ─────────────────────────────────── */}
          {profile.techStack.length > 0 && (
            <div className="mt-6">
              <p className="text-gray-500 text-sm mb-3">Tech Stack</p>
              <div className="flex flex-wrap gap-2">
                {profile.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-gray-800 border border-gray-700
                               text-gray-400 text-sm rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* ── Portfolios Section ─────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">
              Portfolios
              <span className="text-gray-600 font-normal ml-2 text-base">
                ({profile.totalPortfolios})
              </span>
            </h2>

            {isOwnProfile && (
              <Link
                href="/submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500
                           text-white text-sm font-medium rounded-xl
                           transition-colors"
              >
                + Submit New
              </Link>
            )}
          </div>

          {/* Empty state */}
          {profile.portfolios.length === 0 && (
            <div className="text-center py-16 border border-dashed
                            border-gray-800 rounded-2xl">
              <p className="text-4xl mb-3">🌱</p>
              <p className="text-white font-semibold mb-1">
                No portfolios yet
              </p>
              {isOwnProfile ? (
                <>
                  <p className="text-gray-500 text-sm mb-4">
                    Submit your first portfolio to get votes
                  </p>
                  <Link
                    href="/submit"
                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500
                               text-white text-sm rounded-xl transition-colors"
                  >
                    Submit Portfolio →
                  </Link>
                </>
              ) : (
                <p className="text-gray-500 text-sm">
                  {profile.name} hasn't submitted anything yet
                </p>
              )}
            </div>
          )}

          {/* Portfolio grid */}
          {profile.portfolios.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {profile.portfolios.map((portfolio, index) => (
                <PortfolioCard
                  key={portfolio.id}
                  portfolio={portfolio}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>

      </main>

      {/* Edit Profile Modal */}
      {showEdit && (
        <EditProfileModal
          profile={profile}
          onClose={() => setShowEdit(false)}
          onSaved={(updated) => {
            setProfile((prev) =>
              prev ? { ...prev, ...updated } : prev
            )
            setShowEdit(false)
          }}
        />
      )}
    </div>
  )
}