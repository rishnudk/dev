'use client'

import { Component, ReactNode } from 'react'

interface Props   { children: ReactNode }
interface State   { hasError: boolean; message: string }

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, message: '' }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-950 flex items-center
                        justify-center p-4">
          <div className="text-center max-w-md">
            <p className="text-5xl mb-4">💥</p>
            <h1 className="text-white text-2xl font-bold mb-2">
              Something went wrong
            </h1>
            <p className="text-gray-400 mb-6 text-sm">
              {this.state.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500
                         text-white rounded-xl transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}