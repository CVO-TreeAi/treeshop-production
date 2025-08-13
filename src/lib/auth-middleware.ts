import { NextRequest, NextResponse } from 'next/server'
// FIREBASE DISABLED
// FIREBASE DISABLED

// For API routes - we need server-side auth verification
export async function verifyAuthFromRequest(request: NextRequest): Promise<{ authorized: boolean; error?: string; uid?: string; user?: any }> {
  try {
    // Check if Firebase Admin is properly initialized
    if (!isAdminInitialized()) {
      const initError = getAdminInitError()
      console.error('Firebase Admin not initialized:', initError)
      return { 
        authorized: false, 
        error: `Firebase Admin SDK not configured: ${initError}` 
      }
    }

    // Get the authorization header
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { authorized: false, error: 'No authentication token provided' }
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix
    if (!token || token === 'undefined' || token === 'null') {
      return { authorized: false, error: 'Invalid authentication token' }
    }

    // Verify Firebase ID token using Admin SDK
    const decoded = await adminAuth.verifyIdToken(token)
    const email = (decoded.email || '').toLowerCase()
    const domain = email.split('@')[1] || ''
    const allowedDomains = new Set((process.env.ADMIN_EMAIL_DOMAINS || 'treeai.us,fltreeshop.com').split(','))
    const allowedEmails = new Set((process.env.ADMIN_EMAILS || '').split(',').filter(Boolean))
    
    if (!email || (!allowedDomains.has(domain) && !allowedEmails.has(email))) {
      return { 
        authorized: false, 
        error: `Access denied: ${email} is not authorized. Must be from ${Array.from(allowedDomains).join(', ')} domains` 
      }
    }
    
    return { 
      authorized: true, 
      uid: decoded.uid,
      user: decoded
    }
  } catch (error) {
    console.error('Auth verification error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    // Provide more specific error messages
    if (errorMessage.includes('Firebase ID token has expired')) {
      return { authorized: false, error: 'Authentication token expired. Please sign in again.' }
    }
    if (errorMessage.includes('Firebase ID token has invalid signature')) {
      return { authorized: false, error: 'Invalid authentication token. Please sign in again.' }
    }
    if (errorMessage.includes('Firebase Admin not properly configured')) {
      return { authorized: false, error: 'Firebase Admin SDK configuration error' }
    }
    
    return { authorized: false, error: `Authentication verification failed: ${errorMessage}` }
  }
}

export function requireAuth() {
  return async (request: NextRequest) => {
    const auth = await verifyAuthFromRequest(request)
    
    if (!auth.authorized) {
      return NextResponse.json(
        { 
          error: 'Authentication required',
          message: auth.error || 'Please sign in to access this resource',
          code: 'UNAUTHORIZED'
        },
        { status: 401 }
      )
    }

    return null // Continue with the request
  }
}

// Client-side helper to add auth headers to requests
export async function getAuthHeaders(): Promise<Record<string, string>> {
  // Get the current user's Firebase ID token
  if (typeof window !== 'undefined' && clientAuth?.currentUser) {
    try {
      const idToken = await clientAuth.currentUser.getIdToken()
      return {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json'
      }
    } catch (error) {
      console.error('Failed to get ID token:', error)
      // Fall through to return headers without auth
    }
  }
  
  return { 'Content-Type': 'application/json' }
}

// Helper function to make authenticated requests
export async function authenticatedFetch(url: string, options: RequestInit = {}) {
  const authHeaders = await getAuthHeaders()
  const headers = {
    ...authHeaders,
    ...(options.headers || {})
  }

  return fetch(url, {
    ...options,
    headers
  })
}