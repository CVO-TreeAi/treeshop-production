'use client';

import { useState } from 'react';

export default function TestGmailPage() {
  const [status, setStatus] = useState<string>('');
  const [result, setResult] = useState<any>(null);

  const handleOAuthTest = async () => {
    setStatus('Initiating OAuth flow...');
    window.location.href = '/api/auth/gmail';
  };

  const testGmailSend = async () => {
    setStatus('Testing Gmail send...');
    try {
      const response = await fetch('/api/test/gmail-send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: 'test@example.com',
          subject: 'Test Email',
          html: '<h1>Test Email from TreeShop</h1><p>This is a test email.</p>'
        })
      });
      
      const result = await response.json();
      setResult(result);
      setStatus(response.ok ? 'Success!' : 'Error');
    } catch (error) {
      setStatus('Error: ' + error.message);
      setResult({ error: error.message });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Gmail API OAuth Test</h1>
      
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Step 1: OAuth Authorization</h2>
          <p className="text-gray-600 mb-4">
            Click the button below to initiate the Gmail OAuth flow. This will redirect you to Google's consent screen.
          </p>
          <button
            onClick={handleOAuthTest}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Gmail OAuth Flow
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Step 2: Test Email Sending</h2>
          <p className="text-gray-600 mb-4">
            After OAuth is complete and you have a refresh token, test email sending:
          </p>
          <button
            onClick={testGmailSend}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Test Gmail Send
          </button>
        </div>

        {status && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold">Status:</h3>
            <p className={status.includes('Error') ? 'text-red-600' : 'text-green-600'}>
              {status}
            </p>
          </div>
        )}

        {result && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Result:</h3>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h3 className="font-semibold text-yellow-800 mb-2">Debug Information:</h3>
          <div className="text-sm space-y-1">
            <p><strong>Client ID:</strong> 729882174896-f5c7lt1lhn2bnik6clfoc9qvs6devdp2.apps.googleusercontent.com</p>
            <p><strong>Redirect URI:</strong> http://localhost:3232/api/auth/gmail/callback</p>
            <p><strong>Required Scopes:</strong></p>
            <ul className="list-disc list-inside ml-4">
              <li>https://www.googleapis.com/auth/gmail.send</li>
              <li>https://www.googleapis.com/auth/gmail.compose</li>
            </ul>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-2">Google Console Setup Requirements:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Go to <a href="https://console.cloud.google.com/" className="text-blue-600 underline" target="_blank">Google Cloud Console</a></li>
            <li>Enable Gmail API for your project</li>
            <li>Create OAuth 2.0 credentials (Web application)</li>
            <li>Add these Authorized redirect URIs:
              <ul className="list-disc list-inside ml-6">
                <li>http://localhost:3232/api/auth/gmail/callback</li>
                <li>https://yourdomain.com/api/auth/gmail/callback (for production)</li>
              </ul>
            </li>
            <li>Make sure the OAuth consent screen is configured</li>
          </ol>
        </div>
      </div>
    </div>
  );
}