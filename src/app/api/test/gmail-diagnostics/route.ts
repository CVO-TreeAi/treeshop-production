import { NextRequest, NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';

export async function GET(request: NextRequest) {
  const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
  const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;
  const SENDER_EMAIL = process.env.GMAIL_SENDER_EMAIL;
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: {
      CLIENT_ID: CLIENT_ID ? {
        present: true,
        length: CLIENT_ID.length,
        preview: `${CLIENT_ID.substring(0, 20)}...`,
        valid_format: CLIENT_ID.includes('.apps.googleusercontent.com')
      } : { present: false },
      CLIENT_SECRET: CLIENT_SECRET ? {
        present: true,
        length: CLIENT_SECRET.length,
        preview: `${CLIENT_SECRET.substring(0, 10)}...`,
        valid_format: CLIENT_SECRET.startsWith('GOCSPX-')
      } : { present: false },
      REFRESH_TOKEN: REFRESH_TOKEN ? {
        present: true,
        length: REFRESH_TOKEN.length,
        preview: `${REFRESH_TOKEN.substring(0, 10)}...`
      } : { present: false },
      SENDER_EMAIL: SENDER_EMAIL || 'not set',
      BASE_URL: BASE_URL || 'not set'
    },
    oauth_urls: {
      initiation: `${BASE_URL || 'http://localhost:3232'}/api/auth/gmail`,
      callback: `${BASE_URL || 'http://localhost:3232'}/api/auth/gmail/callback`,
      test_page: `${BASE_URL || 'http://localhost:3232'}/test-gmail`
    },
    required_google_console_setup: {
      api_enabled: 'Gmail API must be enabled',
      oauth_consent_screen: 'Must be configured with external user type',
      authorized_redirect_uris: [
        'http://localhost:3232/api/auth/gmail/callback',
        'https://yourdomain.com/api/auth/gmail/callback'
      ],
      required_scopes: [
        'https://www.googleapis.com/auth/gmail.send',
        'https://www.googleapis.com/auth/gmail.compose'
      ]
    }
  };

  // Test OAuth2Client initialization
  try {
    if (CLIENT_ID && CLIENT_SECRET) {
      const oauth2Client = new OAuth2Client(
        CLIENT_ID, 
        CLIENT_SECRET, 
        `${BASE_URL || 'http://localhost:3232'}/api/auth/gmail/callback`
      );
      
      // Generate a test auth URL to verify client setup
      const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: [
          'https://www.googleapis.com/auth/gmail.send',
          'https://www.googleapis.com/auth/gmail.compose'
        ],
        prompt: 'consent'
      });
      
      diagnostics['oauth_test'] = {
        client_initialization: 'SUCCESS',
        auth_url_generated: 'SUCCESS',
        auth_url: authUrl
      };
    } else {
      diagnostics['oauth_test'] = {
        client_initialization: 'FAILED - Missing credentials',
        missing: {
          CLIENT_ID: !CLIENT_ID,
          CLIENT_SECRET: !CLIENT_SECRET
        }
      };
    }
  } catch (error) {
    diagnostics['oauth_test'] = {
      client_initialization: 'FAILED',
      error: error.message
    };
  }

  // Test refresh token if available
  if (REFRESH_TOKEN && CLIENT_ID && CLIENT_SECRET) {
    try {
      const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET);
      oauth2Client.setCredentials({
        refresh_token: REFRESH_TOKEN,
      });
      
      // Try to refresh access token
      const { credentials } = await oauth2Client.refreshAccessToken();
      
      diagnostics['refresh_token_test'] = {
        status: 'SUCCESS',
        access_token_obtained: !!credentials.access_token,
        expires_in: credentials.expiry_date ? new Date(credentials.expiry_date).toISOString() : 'unknown'
      };
    } catch (error) {
      diagnostics['refresh_token_test'] = {
        status: 'FAILED',
        error: error.message,
        hint: 'Refresh token may be expired or invalid'
      };
    }
  }

  const allConfigured = CLIENT_ID && CLIENT_SECRET && REFRESH_TOKEN;
  const status = allConfigured ? 'READY' : 'NEEDS_SETUP';
  
  return NextResponse.json({
    status,
    ready_for_email_sending: allConfigured,
    diagnostics,
    next_steps: !allConfigured ? [
      'Complete OAuth flow to get refresh token',
      'Verify Google Console configuration',
      'Check environment variables'
    ] : [
      'Gmail API integration is ready',
      'Test email sending functionality'
    ]
  });
}