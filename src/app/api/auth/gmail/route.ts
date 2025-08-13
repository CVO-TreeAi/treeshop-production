import { NextRequest, NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import crypto from 'crypto';

// Gmail OAuth2 authentication endpoint - initiates OAuth flow
export async function GET(request: NextRequest) {
  // Get origin from request for dynamic redirect URI
  const origin = request.headers.get('origin') || 'http://localhost:3232';

  const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
  
  // Dynamic redirect URI based on request origin
  const REDIRECT_URI = `${origin}/api/auth/gmail/callback`;

  console.log('Gmail OAuth initiation:', {
    CLIENT_ID: CLIENT_ID ? `${CLIENT_ID.substring(0, 20)}...` : 'missing',
    CLIENT_SECRET: CLIENT_SECRET ? 'present' : 'missing',
    REDIRECT_URI
  });

  if (!CLIENT_ID || !CLIENT_SECRET) {
    return NextResponse.json({ error: 'Gmail OAuth not configured' }, { status: 500 });
  }

  try {
    const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

    // Generate cryptographically secure state parameter
    const state = crypto.randomBytes(32).toString('hex');
    
    // Generate authorization URL with security parameters
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/gmail.send',
        'https://www.googleapis.com/auth/gmail.compose'
      ],
      prompt: 'consent', // Forces refresh token generation
      state: state, // CSRF protection
      include_granted_scopes: true, // Incremental authorization
      // hd: 'fltreeshop.com' // Domain restriction - TEMPORARILY REMOVED for testing
    });

    console.log('Generated auth URL:', authUrl.substring(0, 100) + '...');
    console.log('OAuth state generated:', state.substring(0, 8) + '...');
    
    // Create response with state cookie and redirect
    const response = NextResponse.redirect(authUrl);
    response.cookies.set('oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600 // 10 minutes
    });
    
    return response;

  } catch (error) {
    console.error('Error generating OAuth URL:', error);
    return NextResponse.json({ 
      error: 'Failed to generate OAuth URL',
      details: error.message 
    }, { status: 500 });
  }
}