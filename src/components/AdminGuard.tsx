'use client'

import { useState, useEffect } from 'react'
import { isAuthorizedUser, getAuthError, MockUser } from '@/lib/auth'

interface AdminGuardProps {
  children: React.ReactNode
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const [user, setUser] = useState<MockUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Mock auth check - set error and finish loading
    setError('Authentication disabled - implement Convex auth')
    setLoading(false)
  }, [])

  const handleSignIn = async () => {
    console.warn('Firebase auth removed - implement Convex auth');
    setError('Authentication disabled - implement Convex auth with Clerk')
  }

  const handleSignOut = async () => {
    console.warn('Firebase auth removed - implement Convex auth');
    setUser(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // Show login screen if not authenticated or not authorized
  if (!user || !isAuthorizedUser(user)) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-gray-900 rounded-lg p-8 border border-gray-800">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">TreeAI Admin Access</h1>
              <p className="text-gray-300">Secure business operations portal</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-600/10 border border-red-600/30 rounded-lg">
                <div className="flex items-center gap-2 text-red-400 text-sm">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {!user ? (
                <button
                  onClick={handleSignIn}
                  className="w-full bg-white hover:bg-gray-100 text-gray-900 font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-3"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#9CA3AF" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#9CA3AF" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#9CA3AF" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#9CA3AF" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Auth Disabled (Implement Convex + Clerk)
                </button>
              ) : (
                <div className="text-center space-y-4">
                  <div className="p-4 bg-yellow-600/10 border border-yellow-600/30 rounded-lg">
                    <p className="text-yellow-400 text-sm mb-2">
                      You are signed in as: <span className="font-mono">{user.email}</span>
                    </p>
                    <p className="text-yellow-300 text-xs">
                      Access denied. Only @treeai.us and @fltreeshop.com email addresses are authorized.
                    </p>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                  >
                    Sign out and try different account
                  </button>
                </div>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-800">
              <div className="text-center text-xs text-gray-500 space-y-2">
                <p>🔒 This admin panel contains confidential business data</p>
                <p>📧 Access limited to authorized TreeAI team members</p>
                <p>🚫 Unauthorized access is prohibited</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // User is authenticated and authorized - show admin content
  return <>{children}</>
}