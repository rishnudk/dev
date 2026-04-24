'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/axios'
import { useAuthStore } from '@/store/auth.store'
import { TECH_STACK_OPTIONS, FIELD_OPTIONS } from '../../lib/constants'

// ─── Step indicator ───────────────────────────────────────
function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex gap-2 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
            i < current ? 'bg-indigo-500' : 'bg-gray-700'
          }`}
        />
      ))}
    </div>
  )
}

// ─── Step 1: Basic Info ───────────────────────────────────
function StepOne({ data, onChange }: {
  data: { name: string; username: string }
  onChange: (key: string, value: string) => void
}) {
  const [usernameStatus, setUsernameStatus] = useState<
    'idle' | 'checking' | 'available' | 'taken'
  >('idle')

  const checkUsername = async (username: string) => {
    if (username.length < 3) return
    setUsernameStatus('checking')
    try {
      const { data: res } = await api.get(
        `/users/check-username/${username}`
      )
      setUsernameStatus(res.data.available ? 'available' : 'taken')
    } catch {
      setUsernameStatus('idle')
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm text-gray-400 mb-1 block">
          Full Name *
        </label>
        <input
          type="text"
          placeholder="Alice Johnson"
          value={data.name}
          onChange={(e) => onChange('name', e.target.value)}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700
                     rounded-xl text-white placeholder-gray-500
                     focus:outline-none focus:border-indigo-500"
        />
      </div>

      <div>
        <label className="text-sm text-gray-400 mb-1 block">
          Username *
        </label>
        <div className="relative">
          <span className="absolute left-4 top-3.5 text-gray-500">@</span>
          <input
            type="text"
            placeholder="alice"
            value={data.username}
            onChange={(e) => {
              const val = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')
              onChange('username', val)
              checkUsername(val)
            }}
            className="w-full pl-8 pr-4 py-3 bg-gray-800 border border-gray-700
                       rounded-xl text-white placeholder-gray-500
                       focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Username availability feedback */}
        {usernameStatus === 'checking' && (
          <p className="text-gray-400 text-xs mt-1">Checking...</p>
        )}
        {usernameStatus === 'available' && (
          <p className="text-green-400 text-xs mt-1">✓ Available</p>
        )}
        {usernameStatus === 'taken' && (
          <p className="text-red-400 text-xs mt-1">✗ Already taken</p>
        )}
      </div>
    </div>
  )
}

// ─── Step 2: Role + Bio ───────────────────────────────────
function StepTwo({ data, onChange }: {
  data: { field: string; bio: string; portfolioUrl: string; githubUrl: string; linkedinUrl: string }
  onChange: (key: string, value: string) => void
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm text-gray-400 mb-1 block">
          Your Field *
        </label>
        <select
          value={data.field}
          onChange={(e) => onChange('field', e.target.value)}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700
                     rounded-xl text-white focus:outline-none
                     focus:border-indigo-500"
        >
          <option value="">Select your role</option>
          {FIELD_OPTIONS.map((f) => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm text-gray-400 mb-1 block">Bio</label>
        <textarea
          placeholder="Tell the community about yourself..."
          value={data.bio}
          onChange={(e) => onChange('bio', e.target.value)}
          rows={3}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700
                     rounded-xl text-white placeholder-gray-500
                     focus:outline-none focus:border-indigo-500 resize-none"
        />
      </div>

      <div>
        <label className="text-sm text-gray-400 mb-1 block">
          Portfolio URL
        </label>
        <input
          type="url"
          placeholder="https://yourportfolio.dev"
          value={data.portfolioUrl}
          onChange={(e) => onChange('portfolioUrl', e.target.value)}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700
                     rounded-xl text-white placeholder-gray-500
                     focus:outline-none focus:border-indigo-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm text-gray-400 mb-1 block">GitHub</label>
          <input
            type="url"
            placeholder="https://github.com/you"
            value={data.githubUrl}
            onChange={(e) => onChange('githubUrl', e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700
                       rounded-xl text-white placeholder-gray-500
                       focus:outline-none focus:border-indigo-500 text-sm"
          />
        </div>
        <div>
          <label className="text-sm text-gray-400 mb-1 block">LinkedIn</label>
          <input
            type="url"
            placeholder="https://linkedin.com/in/you"
            value={data.linkedinUrl}
            onChange={(e) => onChange('linkedinUrl', e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700
                       rounded-xl text-white placeholder-gray-500
                       focus:outline-none focus:border-indigo-500 text-sm"
          />
        </div>
      </div>
    </div>
  )
}

// ─── Step 3: Tech Stack ───────────────────────────────────
function StepThree({ selected, onToggle }: {
  selected: string[]
  onToggle: (tech: string) => void
}) {
  return (
    <div>
      <p className="text-gray-400 text-sm mb-4">
        Pick your stack — select everything you work with
        <span className="text-indigo-400 ml-1">
          ({selected.length} selected)
        </span>
      </p>
      <div className="flex flex-wrap gap-2 max-h-72 overflow-y-auto pr-1">
        {TECH_STACK_OPTIONS.map((tech:string   )  => {
          const isSelected = selected.includes(tech)
          return (
            <button
              key={tech}
              onClick={() => onToggle(tech)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium
                         transition-all duration-150 ${
                isSelected
                  ? 'bg-indigo-600 text-white border border-indigo-500'
                  : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-500'
              }`}
            >
              {tech}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Main Onboarding Page ─────────────────────────────────
export default function OnboardingPage() {
  const router  = useRouter()
  const setUser = useAuthStore((s) => s.setUser)
  const user    = useAuthStore((s) => s.user)

  const [step, setStep]       = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const [form, setForm] = useState({
    name:         '',
    username:     '',
    field:        '',
    bio:          '',
    portfolioUrl: '',
    githubUrl:    '',
    linkedinUrl:  '',
    techStack:    [] as string[]
  })

  // Pre-fill name if available from auth
  useEffect(() => {
    if (user?.name) setForm((f) => ({ ...f, name: user.name! }))
  }, [user])

  const updateForm = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setError('')
  }

  const toggleTech = (tech: string) => {
    setForm((prev) => ({
      ...prev,
      techStack: prev.techStack.includes(tech)
        ? prev.techStack.filter((t) => t !== tech)
        : [...prev.techStack, tech]
    }))
  }

  // ── Validate each step before moving forward
  const validateStep = () => {
    if (step === 1) {
      if (!form.name.trim()) {
        setError('Name is required')
        return false
      }
      if (!form.username.trim() || form.username.length < 3) {
        setError('Username must be at least 3 characters')
        return false
      }
    }

    if (step === 2) {
      if (!form.field) {
        setError('Please select your field')
        return false
      }
    }

    if (step === 3) {
      if (form.techStack.length === 0) {
        setError('Select at least one technology')
        return false
      }
    }

    return true
  }

  const handleNext = () => {
    if (!validateStep()) return
    setError('')
    setStep((s) => s + 1)
  }

  const handleBack = () => {
    setError('')
    setStep((s) => s - 1)
  }

  // ── Final submit on step 3
  const handleSubmit = async () => {
    if (!validateStep()) return

    setLoading(true)
    setError('')

    try {
      const { data } = await api.put('/users/profile', form)

      // Update Zustand store with complete profile
      setUser(data.data)

      router.replace('/')

    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Something went wrong'
      )
    } finally {
      setLoading(false)
    }
  }

  const STEP_TITLES = [
    'First, who are you?',
    'Tell us about yourself',
    'What do you work with?'
  ]

  const STEP_SUBTITLES = [
    'This is how others will find you on DevShowcase',
    'Help the community know your background',
    'Select your tech stack'
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 p-4">
      <div className="w-full max-w-lg">

        {/* Header */}
        <div className="mb-8">
          <p className="text-indigo-400 text-sm font-medium mb-1">
            Step {step} of 3
          </p>
          <h1 className="text-2xl font-bold text-white">
            {STEP_TITLES[step - 1]}
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {STEP_SUBTITLES[step - 1]}
          </p>
        </div>

        {/* Progress bar */}
        <StepIndicator current={step} total={3} />

        {/* Step content */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 mb-4">
          {step === 1 && (
            <StepOne
              data={{ name: form.name, username: form.username }}
              onChange={updateForm}
            />
          )}
          {step === 2 && (
            <StepTwo
              data={{
                field: form.field,
                bio: form.bio,
                portfolioUrl: form.portfolioUrl,
                githubUrl: form.githubUrl,
                linkedinUrl: form.linkedinUrl
              }}
              onChange={updateForm}
            />
          )}
          {step === 3 && (
            <StepThree
              selected={form.techStack}
              onToggle={toggleTech}
            />
          )}
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-400 text-sm mb-4 text-center">{error}</p>
        )}

        {/* Navigation buttons */}
        <div className="flex gap-3">
          {step > 1 && (
            <button
              onClick={handleBack}
              className="flex-1 py-3 bg-gray-800 hover:bg-gray-700
                         text-white font-medium rounded-xl transition-colors"
            >
              Back
            </button>
          )}

          {step < 3 ? (
            <button
              onClick={handleNext}
              className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500
                         text-white font-semibold rounded-xl transition-colors"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500
                         disabled:opacity-50 text-white font-semibold
                         rounded-xl transition-colors"
            >
              {loading ? 'Setting up your profile...' : 'Complete Setup'}
            </button>
          )}
        </div>

        {/* Skip option — optional */}
        <p className="text-center text-gray-600 text-sm mt-4">
          You can always update your profile later
        </p>

      </div>
    </div>
  )
}