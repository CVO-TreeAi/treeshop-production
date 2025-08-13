import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

export async function POST(request: NextRequest) {
  try {
    const { to, subject, html } = await request.json();
    
    const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
    const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;
    const SENDER_EMAIL = process.env.GMAIL_SENDER_EMAIL || "office@fltreeshop.com";

    console.log('Gmail test send credentials check:', {
      CLIENT_ID: CLIENT_ID ? `${CLIENT_ID.substring(0, 20)}...` : 'missing',
      CLIENT_SECRET: CLIENT_SECRET ? 'present' : 'missing',
      REFRESH_TOKEN: REFRESH_TOKEN ? 'present' : 'missing',
      SENDER_EMAIL
    });

    if (!CLIENT_ID || !CLIENT_SECRET) {
      return NextResponse.json({
        error: 'Gmail OAuth credentials not configured',
        missing: {
          CLIENT_ID: !CLIENT_ID,
          CLIENT_SECRET: !CLIENT_SECRET
        }
      }, { status: 500 });
    }

    if (!REFRESH_TOKEN) {
      return NextResponse.json({
        error: 'No refresh token available. Please complete OAuth flow first.',
        hint: 'Visit /test-gmail to complete OAuth setup'
      }, { status: 400 });
    }

    // Set up OAuth2 client
    const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET);
    oauth2Client.setCredentials({
      refresh_token: REFRESH_TOKEN,
    });

    console.log('OAuth client configured, initializing Gmail API...');

    // Initialize Gmail API
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    // Create email message
    const emailMessage = [
      `From: TreeShop Florida <${SENDER_EMAIL}>`,
      `To: ${to}`,
      `Subject: ${subject}`,
      `MIME-Version: 1.0`,
      `Content-Type: text/html; charset=utf-8`,
      ``,
      html
    ].join('\n');

    // Encode message in base64
    const encodedMessage = Buffer.from(emailMessage)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    console.log('Sending email via Gmail API...');

    // Send email via Gmail API
    const response = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });

    console.log('Gmail API response:', response.data);

    return NextResponse.json({ 
      success: true, 
      messageId: response.data.id,
      message: "Email sent successfully via Gmail API",
      from: SENDER_EMAIL,
      to: to,
      subject: subject
    });

  } catch (error) {
    console.error("Gmail test send error:", error);
    
    return NextResponse.json({ 
      error: "Failed to send test email via Gmail API",
      details: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}