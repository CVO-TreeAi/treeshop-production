import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthFromRequest } from '@/lib/auth-middleware';
import { isAdminInitialized, getAdminInitError } from '@/lib/firebaseAdmin';

export const runtime = 'nodejs';

/**
 * Health check endpoint for admin functionality
 * Returns the status of Firebase Admin SDK and authentication
 */
export async function GET(req: NextRequest) {
  try {
    // Check Firebase Admin initialization
    const adminInitialized = isAdminInitialized();
    const adminError = getAdminInitError();
    
    // Check authentication if provided
    let authStatus = null;
    const authHeader = req.headers.get('authorization');
    
    if (authHeader) {
      const auth = await verifyAuthFromRequest(req);
      authStatus = {
        authorized: auth.authorized,
        error: auth.error,
        uid: auth.uid,
        email: auth.user?.email
      };
    }
    
    // Environment check
    const envStatus = {
      hasProjectId: !!process.env.FIREBASE_ADMIN_PROJECT_ID || !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      hasClientEmail: !!process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      hasPrivateKey: !!process.env.FIREBASE_ADMIN_PRIVATE_KEY,
      hasAdminDomains: !!process.env.ADMIN_EMAIL_DOMAINS,
      nodeEnv: process.env.NODE_ENV
    };
    
    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      admin: {
        initialized: adminInitialized,
        error: adminError
      },
      auth: authStatus,
      environment: envStatus,
      message: adminInitialized 
        ? 'Firebase Admin SDK is properly configured' 
        : `Firebase Admin SDK configuration issue: ${adminError}`
    });
    
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json({ 
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      admin: {
        initialized: false,
        error: getAdminInitError()
      }
    }, { status: 500 });
  }
}