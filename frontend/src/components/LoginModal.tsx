'use client'

import { signIn } from 'next-auth/react'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />

          {/* Modal */}
          <motion.div
            initial={{ x: 320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 320, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-4 right-4 w-full max-w-[360px] bg-gray-900 border border-gray-800 
                       rounded-2xl p-6 shadow-2xl z-70 overflow-hidden"
          >
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Login</h2>
                <p className="text-gray-400 text-sm mt-1">Welcome back to DevShowcase</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-800 rounded-full transition-all group"
                aria-label="Close modal"
              >
                <X size={20} className="text-gray-500 group-hover:text-white" />
              </button>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => signIn('google', { callbackUrl: '/' })}
                className="w-full flex items-center justify-center gap-3 py-3.5 
                           bg-white hover:bg-gray-100 text-gray-950 font-bold 
                           rounded-xl transition-all active:scale-[0.98]"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.67-.35-1.39-.35-2.09s.13-1.42.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </button>
            </div>

            <p className="mt-8 text-center text-xs text-gray-500 leading-relaxed">
              By continuing, you agree to our{' '}
              <a href="#" className="hover:text-white underline underline-offset-2">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="hover:text-white underline underline-offset-2">Privacy Policy</a>.
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
