'use client';

export default function DirectOAuthTest() {
  const handleDirectOAuth = () => {
    // Manual OAuth URL construction - bypass google-auth-library
    const clientId = '729882174896-f5c7it1ihn2bnik6cf0c9qvs6devdp2.apps.googleusercontent.com';
    const redirectUri = 'http://localhost:3232/api/auth/gmail/callback';
    const scope = 'https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/gmail.compose';
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${encodeURIComponent(clientId)}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=${encodeURIComponent(scope)}&` +
      `response_type=code&` +
      `access_type=offline&` +
      `prompt=consent`;
    
    console.log('Direct OAuth URL:', authUrl);
    window.location.href = authUrl;
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Direct OAuth Test</h1>
        
        <div className="bg-gray-900 p-6 rounded-lg mb-6">
          <p className="mb-4">This bypasses our OAuth endpoint and goes directly to Google.</p>
          <button 
            onClick={handleDirectOAuth}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded font-medium"
          >
            Direct Google OAuth
          </button>
        </div>
        
        <div className="bg-gray-800 p-4 rounded text-sm">
          <p><strong>Client ID:</strong> 729882174896-f5c7it1ihn2bnik6cf0c9qvs6devdp2.apps.googleusercontent.com</p>
          <p><strong>Redirect URI:</strong> http://localhost:3232/api/auth/gmail/callback</p>
          <p><strong>Test User:</strong> office@fltreeshop.com</p>
        </div>
      </div>
    </div>
  );
}