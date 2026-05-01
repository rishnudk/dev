'use client'

import { useState } from 'react'
import LoginModal from '@/components/LoginModal'

export default function LoginPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">
          Ready to showcase your work?
        </h1>
        <p className="text-gray-400 max-w-md mx-auto">
          Join the community of world-class developers and share your latest projects with the world.
        </p>
      </div>

      <button
        onClick={() => setIsModalOpen(true)}
        className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 
                   text-white font-bold rounded-2xl transition-all 
                   shadow-lg shadow-indigo-500/20 active:scale-[0.98]"
      >
        Open Login Modal
      </button>

      <LoginModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  )
}