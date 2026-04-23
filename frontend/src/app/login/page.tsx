'use client'

import { useState } from 'react'
import api from '@/lib/axios'

export default function LoginPage() {
  const [email, setEmail]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [sent, setSent]         = useState(false)
  const [error, setError]       = useState('')

  const handleSubmit = async () => {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email')
      return
    }

    setLoading(true)
    setError('')

    try {
      await api.post('/auth/magic-link', { email })
      setSent(true)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="text-center p-8">
          <div className="text-5xl mb-4">📬</div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Check your email
          </h1>
          <p className="text-gray-400">
            We sent a magic link to <span className="text-indigo-400">{email}</span>
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Link expires in 15 minutes
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="w-full max-w-sm p-8 bg-gray-900 rounded-2xl border border-gray-800">
        <h1 className="text-2xl font-bold text-white mb-2">
          Welcome to DevShowcase
        </h1>
        <p className="text-gray-400 mb-6 text-sm">
          Enter your email to get a magic login link
        </p>

        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 
                     rounded-xl text-white placeholder-gray-500 
                     focus:outline-none focus:border-indigo-500 mb-3"
        />

        {error && (
          <p className="text-red-400 text-sm mb-3">{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 
                     disabled:opacity-50 text-white font-semibold 
                     rounded-xl transition-colors"
        >
          {loading ? 'Sending...' : 'Send Magic Link'}
        </button>
      </div>
    </div>
  )
}