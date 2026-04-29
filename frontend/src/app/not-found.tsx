import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center
                    justify-center p-4">
      <div className="text-center">
        <p className="text-8xl font-bold text-gray-800 mb-4">404</p>
        <p className="text-4xl mb-4">🔍</p>
        <h1 className="text-white text-2xl font-bold mb-2">
          Page not found
        </h1>
        <p className="text-gray-500 mb-8">
          The page you're looking for doesn't exist
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500
                     text-white font-medium rounded-xl transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}