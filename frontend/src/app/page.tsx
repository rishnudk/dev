import Link from 'next/link'
import OnboardingGuard from '@/components/OnboardingGuard'

export default function HomePage() {
  return (
    <OnboardingGuard>
      <div className="min-h-screen bg-gray-950 text-white p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">DevShowcase</h1>
          <Link
            href="/submit"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500
                       rounded-xl text-sm font-medium transition-colors"
          >
            + Submit Portfolio
          </Link>
        </div>
        <p className="text-gray-400">Home Feed — Coming in Phase 6</p>
      </div>
    </OnboardingGuard>
  )
}