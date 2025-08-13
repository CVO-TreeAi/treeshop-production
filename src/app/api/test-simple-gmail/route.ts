import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

export async function POST(request: NextRequest) {
  try {
    const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
    const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;
    const SENDER_EMAIL = process.env.GMAIL_SENDER_EMAIL || "office@fltreeshop.com";

    console.log('Simple Gmail test credentials:', {
      CLIENT_ID: CLIENT_ID ? `${CLIENT_ID.substring(0, 20)}...` : 'missing',
      CLIENT_SECRET: CLIENT_SECRET ? 'present' : 'missing',
      REFRESH_TOKEN: REFRESH_TOKEN ? 'present' : 'missing',
      SENDER_EMAIL
    });

    if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
      return NextResponse.json({ error: 'Gmail API not configured' }, { status: 500 });
    }

    // Set up OAuth2 client
    const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET);
    oauth2Client.setCredentials({
      refresh_token: REFRESH_TOKEN,
    });

    // Initialize Gmail API
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    // Simple email content
    const subject = 'TreeShop Gmail Test';
    const to = 'office@fltreeshop.com';
    const htmlContent = '<h1>Test Email</h1><p>Gmail API is working!</p>';

    // Create simple MIME message
    const message = [
      'MIME-Version: 1.0',
      'Content-Type: text/html; charset=utf-8',
      `From: ${SENDER_EMAIL}`,
      `To: ${to}`,
      `Subject: ${subject}`,
      '',
      htmlContent
    ].join('\n');

    // Encode message
    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    console.log('Sending simple Gmail API email...');

    // Send email
    const response = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });

    return NextResponse.json({
      success: true,
      messageId: response.data.id,
      message: 'Simple Gmail test email sent successfully!'
    });

  } catch (error) {
    console.error('Simple Gmail test error:', error);
    return NextResponse.json({
      error: 'Failed to send simple Gmail test',
      details: error.message
    }, { status: 500 });
  }
}