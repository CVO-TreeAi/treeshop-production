import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  
  // Security diagnostic information
  const diagnostics = {
    timestamp: new Date().toISOString(),
    security_checks: {
      client_id_format: {
        present: !!CLIENT_ID,
        format_valid: CLIENT_ID ? CLIENT_ID.endsWith('.apps.googleusercontent.com') : false,
        length: CLIENT_ID?.length || 0,
        starts_with_numbers: CLIENT_ID ? /^\d+/.test(CLIENT_ID) : false
      },
      client_secret_format: {
        present: !!CLIENT_SECRET,
        format_valid: CLIENT_SECRET ? CLIENT_SECRET.startsWith('GOCSPX-') : false,
        length: CLIENT_SECRET?.length || 0
      },
      redirect_uri_analysis: {
        hardcoded_localhost: 'http://localhost:3232/api/auth/gmail/callback',
        dynamic_from_origin: `${request.headers.get('origin') || BASE_URL || 'http://localhost:3232'}/api/auth/gmail/callback`,
        base_url_env: BASE_URL || 'not set'
      },
      request_headers: {
        origin: request.headers.get('origin'),
        host: request.headers.get('host'),
        referer: request.headers.get('referer'),
        user_agent: request.headers.get('user-agent')?.substring(0, 50) + '...'
      }
    },
    potential_issues: [],
    remediation_steps: []
  };

  // Analyze potential issues
  if (!CLIENT_ID?.endsWith('.apps.googleusercontent.com')) {
    diagnostics.potential_issues.push({
      severity: 'HIGH',
      issue: 'Invalid Client ID format',
      description: 'Client ID should end with .apps.googleusercontent.com',
      remediation: 'Verify Client ID copied correctly from Google Cloud Console'
    });
  }

  if (!CLIENT_SECRET?.startsWith('GOCSPX-')) {
    diagnostics.potential_issues.push({
      severity: 'HIGH', 
      issue: 'Invalid Client Secret format',
      description: 'Client Secret should start with GOCSPX-',
      remediation: 'Verify Client Secret copied correctly from Google Cloud Console'
    });
  }

  if (!request.headers.get('origin')) {
    diagnostics.potential_issues.push({
      severity: 'MEDIUM',
      issue: 'Missing Origin header',
      description: 'Google may reject requests without proper origin validation',
      remediation: 'Ensure requests are made from the correct domain'
    });
  }

  // Google Console Verification URLs
  const googleConsoleChecks = {
    oauth_consent_screen: 'https://console.cloud.google.com/apis/credentials/consent',
    oauth_credentials: 'https://console.cloud.google.com/apis/credentials',
    gmail_api_enabled: 'https://console.cloud.google.com/apis/library/gmail.googleapis.com',
    project_verification: `https://console.cloud.google.com/apis/credentials/oauthclient/${CLIENT_ID?.split('-')[0] || 'YOUR_CLIENT_ID'}`
  };

  // Check if this is likely a credentials mismatch
  if (CLIENT_ID && CLIENT_SECRET) {
    const projectNumber = CLIENT_ID.split('-')[0];
    diagnostics.security_checks['project_analysis'] = {
      project_number: projectNumber,
      client_id_project_match: true,
      console_verification_url: `https://console.cloud.google.com/apis/credentials/oauthclient/${CLIENT_ID}`
    };
  }

  // Common 401 invalid_client causes
  diagnostics.remediation_steps = [
    {
      step: 1,
      action: 'Verify OAuth Client Configuration',
      details: 'Check that Client ID and Secret match exactly in Google Console',
      verification_url: googleConsoleChecks.oauth_credentials
    },
    {
      step: 2,
      action: 'Confirm Redirect URI Configuration',
      details: 'Ensure redirect URI is exactly: http://localhost:3232/api/auth/gmail/callback',
      current_uris: [
        'http://localhost:3232/api/auth/gmail/callback',
        'https://yourdomain.com/api/auth/gmail/callback'
      ]
    },
    {
      step: 3,
      action: 'Verify OAuth Consent Screen',
      details: 'Ensure consent screen is published and configured correctly',
      verification_url: googleConsoleChecks.oauth_consent_screen
    },
    {
      step: 4,
      action: 'Check Gmail API Status',
      details: 'Confirm Gmail API is enabled for your project',
      verification_url: googleConsoleChecks.gmail_api_enabled
    },
    {
      step: 5,
      action: 'Test with curl',
      details: 'Test OAuth endpoint directly with curl to isolate the issue',
      example_curl: `curl -v -H "Origin: http://localhost:3232" "http://localhost:3232/api/auth/gmail"`
    }
  ];

  return NextResponse.json({
    status: 'DIAGNOSTIC_COMPLETE',
    diagnostics,
    google_console_urls: googleConsoleChecks,
    next_action: diagnostics.potential_issues.length > 0 
      ? 'Fix the identified issues above'
      : 'All basic checks passed - issue may be in Google Console configuration'
  });
}