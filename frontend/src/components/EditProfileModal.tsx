'use client'

import { useState } from 'react'
import api from '@/lib/axios'
import { useAuthStore } from '@/store/auth.store'
import { FIELD_OPTIONS, TECH_STACK_OPTIONS } from '@/lib/constants'
import { UserProfile } from '@/types'

interface Props {
  profile:  UserProfile
  onClose:  () => void
  onSaved:  (updated: UserProfile) => void
}

export default function EditProfileModal({
  profile, onClose, onSaved
}: Props) {
  const setUser = useAuthStore((s) => s.setUser)

  const [form, setForm] = useState({
    name:         profile.name         ?? '',
    username:     profile.username     ?? '',
    field:        profile.field        ?? '',
    bio:          profile.bio          ?? '',
    portfolioUrl: profile.portfolioUrl ?? '',
    githubUrl:    profile.githubUrl    ?? '',
    linkedinUrl:  profile.linkedinUrl  ?? '',
    techStack:    profile.techStack    ?? []
  })

  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const updateField = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const toggleTech = (tech: string) => {
    setForm((prev) => ({
      ...prev,
      techStack: prev.techStack.includes(tech)
        ? prev.techStack.filter((t) => t !== tech)
        : [...prev.techStack, tech]
    }))
  }

  const handleSave = async () => {
    if (!form.name.trim()) {
      setError('Name is required')
      return
    }

    setLoading(true)
    setError('')

    try {
      const { data } = await api.put('/users/profile', form)

      // Update Zustand store
      setUser(data.data)

      // Tell parent to refresh
      onSaved({ ...profile, ...form })

    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save')
    } finally {
      setLoading(false)
    }
  }

  return (
    // Backdrop
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50
                 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="bg-gray-900 border border-gray-800 rounded-2xl
                      w-full max-w-lg max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between p-6
                        border-b border-gray-800 sticky top-0
                        bg-gray-900 z-10">
          <h2 className="text-xl font-bold text-white">Edit Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors
                       text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-5">

          {/* Name */}
          <div>
            <label className="text-sm text-gray-400 block mb-1">
              Full Name *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700
                         rounded-xl text-white focus:outline-none
                         focus:border-indigo-500"
            />
          </div>

          {/* Username */}
          <div>
            <label className="text-sm text-gray-400 block mb-1">
              Username *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-gray-500">@</span>
              <input
                type="text"
                value={form.username}
                onChange={(e) =>
                  updateField(
                    'username',
                    e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')
                  )
                }
                className="w-full pl-8 pr-4 py-3 bg-gray-800 border
                           border-gray-700 rounded-xl text-white
                           focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Field */}
          <div>
            <label className="text-sm text-gray-400 block mb-1">Field</label>
            <select
              value={form.field}
              onChange={(e) => updateField('field', e.target.value)}
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

          {/* Bio */}
          <div>
            <label className="text-sm text-gray-400 block mb-1">Bio</label>
            <textarea
              value={form.bio}
              onChange={(e) => updateField('bio', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700
                         rounded-xl text-white placeholder-gray-500
                         focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          {/* Links */}
          <div className="space-y-3">
            <label className="text-sm text-gray-400 block">Links</label>

            <input
              type="url"
              placeholder="Portfolio URL"
              value={form.portfolioUrl}
              onChange={(e) => updateField('portfolioUrl', e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700
                         rounded-xl text-white placeholder-gray-500
                         focus:outline-none focus:border-indigo-500"
            />
            <input
              type="url"
              placeholder="GitHub URL"
              value={form.githubUrl}
              onChange={(e) => updateField('githubUrl', e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700
                         rounded-xl text-white placeholder-gray-500
                         focus:outline-none focus:border-indigo-500"
            />
            <input
              type="url"
              placeholder="LinkedIn URL"
              value={form.linkedinUrl}
              onChange={(e) => updateField('linkedinUrl', e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700
                         rounded-xl text-white placeholder-gray-500
                         focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Tech Stack */}
          <div>
            <label className="text-sm text-gray-400 block mb-2">
              Tech Stack
              <span className="text-indigo-400 ml-1">
                ({form.techStack.length} selected)
              </span>
            </label>
            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
              {TECH_STACK_OPTIONS.map((tech) => {
                const isSelected = form.techStack.includes(tech)
                return (
                  <button
                    key={tech}
                    onClick={() => toggleTech(tech)}
                    className={`px-3 py-1 rounded-full text-sm
                               transition-all border ${
                      isSelected
                        ? 'bg-indigo-600 border-indigo-500 text-white'
                        : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'
                    }`}
                  >
                    {tech}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-800 flex gap-3
                        sticky bottom-0 bg-gray-900">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-gray-800 hover:bg-gray-700
                       text-white rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500
                       disabled:opacity-50 text-white font-semibold
                       rounded-xl transition-colors"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

      </div>
    </div>
  )
}