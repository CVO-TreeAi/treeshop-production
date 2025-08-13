import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

// Gmail OAuth2 callback endpoint
export async function GET(request: NextRequest) {
  // Security: Validate state parameter
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const state = searchParams.get('state');
  const storedState = request.cookies.get('oauth_state')?.value;

  console.log('Gmail OAuth callback received:', {
    code: code ? `${code.substring(0, 20)}...` : 'missing',
    error: error || 'none',
    state: state ? `${state.substring(0, 8)}...` : 'missing',
    storedState: storedState ? `${storedState.substring(0, 8)}...` : 'missing'
  });

  // Verify state parameter for CSRF protection
  if (!state || !storedState || state !== storedState) {
    console.error('Invalid or missing state parameter - possible CSRF attack');
    return NextResponse.json({ 
      error: 'Invalid state parameter',
      details: 'CSRF protection failed'
    }, { status: 400 });
  }

  if (error) {
    console.error('OAuth authorization failed:', error);
    return NextResponse.json({ 
      error: 'OAuth authorization failed', 
      details: error 
    }, { status: 400 });
  }

  if (!code) {
    console.error('No authorization code received');
    return NextResponse.json({ 
      error: 'No authorization code received' 
    }, { status: 400 });
  }

  const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
  
  // Dynamic redirect URI based on request origin
  const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3232';
  const REDIRECT_URI = `${origin}/api/auth/gmail/callback`;

  if (!CLIENT_ID || !CLIENT_SECRET) {
    return NextResponse.json({ 
      error: 'Gmail OAuth not configured' 
    }, { status: 500 });
  }

  try {
    console.log('Initializing OAuth2Client with:', {
      CLIENT_ID: CLIENT_ID ? `${CLIENT_ID.substring(0, 20)}...` : 'missing',
      CLIENT_SECRET: CLIENT_SECRET ? 'present' : 'missing',
      REDIRECT_URI
    });

    const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

    console.log('Exchanging authorization code for tokens...');
    // Exchange authorization code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    console.log('Token exchange successful:', {
      access_token: tokens.access_token ? 'present' : 'missing',
      refresh_token: tokens.refresh_token ? 'present' : 'missing',
      expiry_date: tokens.expiry_date
    });
    
    // Set credentials
    oauth2Client.setCredentials(tokens);

    // Test the connection by getting user profile
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    const profile = await gmail.users.getProfile({ userId: 'me' });

    // Clear the state cookie
    const response = NextResponse.json({
      success: true,
      message: 'Gmail OAuth setup successful!',
      tokens: {
        access_token: tokens.access_token ? 'present' : 'missing',
        refresh_token: tokens.refresh_token ? tokens.refresh_token : 'missing',
        expiry_date: tokens.expiry_date
      },
      profile: {
        emailAddress: profile.data.emailAddress,
        messagesTotal: profile.data.messagesTotal
      },
      instructions: {
        step1: 'Copy the refresh_token below',
        step2: 'Add it to your .env.local as GOOGLE_REFRESH_TOKEN=your_token_here',
        step3: 'Your Gmail API integration will be ready!'
      }
    });
    
    // Clear the state cookie for security
    response.cookies.delete('oauth_state');
    return response;

  } catch (error) {
    console.error('Gmail OAuth error:', error);
    return NextResponse.json({ 
      error: 'Failed to complete OAuth flow',
      details: error.message
    }, { status: 500 });
  }
}