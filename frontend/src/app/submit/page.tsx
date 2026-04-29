'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import api from '@/lib/axios'
import { TECH_STACK_OPTIONS } from '@/lib/constants'
import OnboardingGuard from '@/components/OnboardingGuard'

export default function SubmitPage() {
  const router  = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    title:       '',
    description: '',
    liveUrl:     '',
    tags:        [] as string[]
  })

  const [image,    setImage]    = useState<File | null>(null)
  const [preview,  setPreview]  = useState<string | null>(null)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  const updateForm = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setError('')
  }

  const toggleTag = (tag: string) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag]
    }))
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate size — 5MB max
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5MB')
      return
    }

    setImage(file)

    // Show preview immediately
    const reader = new FileReader()
    reader.onload = () => setPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const validate = () => {
    if (!form.title.trim()) {
      setError('Title is required')
      return false
    }
    if (!form.description.trim()) {
      setError('Description is required')
      return false
    }
    if (!form.liveUrl.trim()) {
      setError('Live URL is required')
      return false
    }
    if (!image) {
      setError('Hero image is required')
      return false
    }
    if (form.tags.length === 0) {
      setError('Add at least one tag')
      return false
    }
    return true
  }

  const handleSubmit = async () => {
    if (!validate()) return

    setLoading(true)
    setError('')

    try {
      // Must use FormData for file upload
      const formData = new FormData()
      formData.append('title',       form.title)
      formData.append('description', form.description)
      formData.append('liveUrl',     form.liveUrl)
      formData.append('tags',        JSON.stringify(form.tags))
      formData.append('heroImage',   image!)

      const { data } = await api.post('/portfolios', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      // Redirect to the new portfolio page
      router.push(`/p/${data.data.id}`)

    } catch (err: any) {
      setError(err.response?.data?.message || 'Submission failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <OnboardingGuard requireAuth>
    <div className="min-h-screen bg-gray-950 py-12 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">
            Submit Your Portfolio
          </h1>
          <p className="text-gray-400 mt-1">
            Show the community what you've built
          </p>
        </div>

        <div className="space-y-6">

          {/* Hero Image Upload */}
          <div>
            <label className="text-sm text-gray-400 block mb-2">
              Hero Image * 
              <span className="text-gray-600 ml-1">
                (1200×630 recommended, max 5MB)
              </span>
            </label>

            {preview ? (
              <div className="relative group">
                <div className="relative w-full h-48 rounded-xl overflow-hidden">
                  <Image
                    src={preview}
                    alt="Hero preview"
                    fill
                    className="object-cover"
                  />
                </div>
                <button
                  onClick={() => {
                    setImage(null)
                    setPreview(null)
                  }}
                  className="absolute top-3 right-3 bg-red-600 hover:bg-red-500
                             text-white text-xs px-3 py-1 rounded-lg"
                >
                  Remove
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileRef.current?.click()}
                className="w-full h-48 border-2 border-dashed border-gray-700
                           hover:border-indigo-500 rounded-xl flex flex-col
                           items-center justify-center text-gray-500
                           hover:text-indigo-400 transition-colors"
              >
                <span className="text-4xl mb-2">🖼️</span>
                <span className="text-sm">Click to upload hero image</span>
                <span className="text-xs mt-1">JPEG, PNG or WebP</span>
              </button>
            )}

            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageSelect}
              className="hidden"
            />
          </div>

          {/* Title */}
          <div>
            <label className="text-sm text-gray-400 block mb-2">
              Portfolio Title *
            </label>
            <input
              type="text"
              placeholder="My Developer Portfolio"
              value={form.title}
              onChange={(e) => updateForm('title', e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700
                         rounded-xl text-white placeholder-gray-500
                         focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm text-gray-400 block mb-2">
              Description *
            </label>
            <textarea
              placeholder="Describe your portfolio — what makes it unique, 
what technologies you used, the design decisions you made..."
              value={form.description}
              onChange={(e) => updateForm('description', e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700
                         rounded-xl text-white placeholder-gray-500
                         focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          {/* Live URL */}
          <div>
            <label className="text-sm text-gray-400 block mb-2">
              Live URL *
            </label>
            <input
              type="url"
              placeholder="https://yourportfolio.dev"
              value={form.liveUrl}
              onChange={(e) => updateForm('liveUrl', e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700
                         rounded-xl text-white placeholder-gray-500
                         focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="text-sm text-gray-400 block mb-2">
              Tags *
              <span className="text-indigo-400 ml-1">
                ({form.tags.length} selected)
              </span>
            </label>
            <div className="flex flex-wrap gap-2">
              {TECH_STACK_OPTIONS.map((tech) => {
                const isSelected = form.tags.includes(tech)
                return (
                  <button
                    key={tech}
                    onClick={() => toggleTag(tech)}
                    className={`px-3 py-1.5 rounded-full text-sm
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

          {/* Error */}
          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500
                       disabled:opacity-50 text-white font-semibold
                       rounded-xl transition-colors text-lg"
          >
            {loading ? 'Uploading and submitting...' : 'Submit Portfolio →'}
          </button>

        </div>
      </div>
    </div>
    </OnboardingGuard>
  )
}