'use client'

import Link from 'next/link'
import Navbar from '@/components/Navbar'
import OnboardingGuard from '@/components/OnboardingGuard'

export default function HomePage() {
  return (
    <OnboardingGuard>
      <div className="min-h-screen bg-gray-950">
        <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-16 sm:py-20">
        <section className="text-center mb-20">
          <p className="text-indigo-400 font-semibold mb-4">
            Discover real developer portfolios
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight mb-6">
            Inspiration for builders.
            <span className="block text-gray-300 mt-2">
              Discovery for hiring teams.
            </span>
          </h1>
          <p className="max-w-3xl mx-auto text-gray-400 text-lg mb-8">
            DevShowcase helps developers share standout work and helps teams
            quickly find portfolios by stack, field, and style.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/explore"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-colors"
            >
              Browse portfolios
            </Link>
            <Link
              href="/submit"
              className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-gray-100 font-medium rounded-xl border border-gray-700 transition-colors"
            >
              Submit your portfolio
            </Link>
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-6 mb-20">
          <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-8">
            <h2 className="text-2xl font-semibold text-white mb-4">
              For developers
            </h2>
            <p className="text-gray-400 mb-6">
              Explore curated portfolios, track visual trends, and get ideas
              from peers building across web, mobile, and AI products.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/explore"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl transition-colors"
              >
                Explore inspiration
              </Link>
              <Link
                href="/submit"
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-100 text-sm font-medium rounded-xl border border-gray-700 transition-colors"
              >
                Share your work
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-8">
            <h2 className="text-2xl font-semibold text-white mb-4">
              For hiring teams
            </h2>
            <p className="text-gray-400 mb-6">
              Browse candidate portfolios with practical filters and open full
              profiles to evaluate technical quality, product thinking, and
              communication.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/explore"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl transition-colors"
              >
                Discover candidates
              </Link>
              <Link
                href="/login"
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-100 text-sm font-medium rounded-xl border border-gray-700 transition-colors"
              >
                Sign in
              </Link>
            </div>
          </div>
        </section>

        <section className="mb-20">
          <h2 className="text-3xl font-bold text-white text-center mb-10">
            How it works
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
            <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-6">
              <p className="text-indigo-400 text-sm font-semibold mb-2">
                Step 1
              </p>
              <h3 className="text-white font-semibold text-lg mb-2">Browse</h3>
              <p className="text-gray-400">
                Start in Explore and filter by field or feed type to find
                relevant portfolio styles.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-6">
              <p className="text-indigo-400 text-sm font-semibold mb-2">
                Step 2
              </p>
              <h3 className="text-white font-semibold text-lg mb-2">
                Open profile
              </h3>
              <p className="text-gray-400">
                Dive into project details through each creator profile and live
                portfolio links.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-6">
              <p className="text-indigo-400 text-sm font-semibold mb-2">
                Step 3
              </p>
              <h3 className="text-white font-semibold text-lg mb-2">
                Save and share
              </h3>
              <p className="text-gray-400">
                Shortlist standout work for inspiration, hiring review, or team
                discussions.
              </p>
            </div>
          </div>
        </section>
      </main>

        <footer className="border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <p className="text-sm text-gray-500">
              Built for developers and teams discovering great portfolio work.
            </p>
            <div className="flex items-center gap-5 text-sm">
              <Link href="/explore" className="text-gray-400 hover:text-white">
                Explore
              </Link>
              <Link href="/login" className="text-gray-400 hover:text-white">
                Login
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </OnboardingGuard>
  )
}