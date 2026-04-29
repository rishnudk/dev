'use client'

import { FeedType } from '@/types'

const TABS: { id: FeedType; label: string; emoji: string }[] = [
  { id: 'trending', label: 'Trending',   emoji: '🔥' },
  { id: 'newest',   label: 'Newest',     emoji: '✨' },
  { id: 'top',      label: 'Top Voted',  emoji: '🏆' },
]

interface Props {
  active:   FeedType
  onChange: (feed: FeedType) => void
}

export default function FeedTabs({ active, onChange }: Props) {
  return (
    <div className="flex gap-1 bg-gray-900 border border-gray-800
                    rounded-xl p-1 w-fit">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`px-4 py-2 rounded-lg text-sm font-medium
                     transition-all duration-150 ${
            active === tab.id
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          {tab.emoji} {tab.label}
        </button>
      ))}
    </div>
  )
}