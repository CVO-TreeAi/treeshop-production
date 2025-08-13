// Firebase auth removed - switching to Convex-only backend
// This is a placeholder file to prevent import errors during migration

// Mock user interface for compatibility
export interface MockUser {
  email?: string;
  uid?: string;
  displayName?: string;
}

// Authorized email domains and specific emails (preserved for future Convex auth)
const AUTHORIZED_DOMAINS = [
  'treeai.us',
  'fltreeshop.com'
]

const AUTHORIZED_EMAILS = [
  // Add specific authorized emails here if needed
  // 'specific-user@gmail.com'
]

export function isAuthorizedUser(user: MockUser | null): boolean {
  if (!user || !user.email) {
    return false
  }

  const email = user.email.toLowerCase()
  const domain = email.split('@')[1]

  // Check if email domain is authorized
  if (AUTHORIZED_DOMAINS.includes(domain)) {
    return true
  }

  // Check if specific email is authorized
  if (AUTHORIZED_EMAILS.includes(email)) {
    return true
  }

  return false
}

export function getAuthError(user: MockUser | null): string | null {
  if (!user) {
    return 'Please sign in to access the admin panel (Convex auth not implemented)'
  }

  if (!user.email) {
    return 'Email address is required'
  }

  if (!isAuthorizedUser(user)) {
    return `Access denied. Only @treeai.us and @fltreeshop.com email addresses are authorized.`
  }

  return null
}

// Check if current user is authorized (client-side) - mock implementation
export function checkCurrentUser(): { isAuthorized: boolean; user: MockUser | null; error: string | null } {
  console.warn('Firebase auth removed - implement Convex auth');
  const mockUser: MockUser | null = null;
  
  return {
    isAuthorized: false,
    user: mockUser,
    error: 'Authentication disabled - implement Convex auth'
  }
}