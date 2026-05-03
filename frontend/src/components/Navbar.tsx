'use client'

import Link from 'next/link'
import { useAuthStore } from '@/store/auth.store'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const router             = useRouter()
  const { user, isLoggedIn, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <nav className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-xl
                    border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-3 flex
                      items-center justify-between">

        {/* Logo */}
        <Link href="/" className="text-white font-bold text-lg">
          Dev<span className="text-indigo-400">Showcase</span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <Link
            href="/explore"
            className="px-4 py-2 bg-gray-900 hover:bg-gray-800 border border-gray-700 text-gray-200 text-sm font-medium rounded-xl transition-colors"
          >
            Explore
          </Link>

          {isLoggedIn ? (
            <>
              <Link
                href="/submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500
                           text-white text-sm font-medium rounded-xl
                           transition-colors"
              >
                + Submit
              </Link>

              <Link href={`/u/${user?.username}`}>
                <div className="w-9 h-9 rounded-full bg-indigo-700
                                flex items-center justify-center
                                text-white font-bold text-sm
                                hover:bg-indigo-600 transition-colors">
                  {user?.name?.[0]?.toUpperCase() ?? '?'}
                </div>
              </Link>

              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-white text-sm
                           transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500
                         text-white text-sm font-medium rounded-xl
                         transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}