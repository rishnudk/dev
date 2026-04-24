import OnboardingGuard from '@/components/OnboardingGuard'

export default function HomePage() {
  return (
    <OnboardingGuard>
      <div className="min-h-screen bg-gray-950 text-white">
        <h1 className="text-2xl p-8">Home Feed — Coming in Phase 6</h1>
      </div>
    </OnboardingGuard>
  )
}