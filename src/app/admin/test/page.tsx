'use client';

import { useState } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
// import { auth } from '@/lib/firebase';
// import { GoogleAuthProvider, signInWithPopup, getIdToken } from 'firebase/auth';

export default function AdminTestPage() {
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const updateResult = (test: string, result: any) => {
    setTestResults(prev => ({ ...prev, [test]: result }));
  };

  const setLoadingState = (test: string, isLoading: boolean) => {
    setLoading(prev => ({ ...prev, [test]: isLoading }));
  };

  // Test Google Auth Login
  const testGoogleAuth = async () => {
    setLoadingState('googleAuth', true);
    try {
      if (!auth) {
        throw new Error('Firebase Auth not initialized');
      }

      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Get ID token to test API
      const idToken = await getIdToken(user);
      
      updateResult('googleAuth', {
        success: true,
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
        },
        idToken: idToken.substring(0, 20) + '...' // Show partial token for security
      });
    } catch (error: any) {
      updateResult('googleAuth', {
        success: false,
        error: error.message
      });
    } finally {
      setLoadingState('googleAuth', false);
    }
  };

  // Test API Authentication
  const testAPIAuth = async () => {
    setLoadingState('apiAuth', true);
    try {
      if (!auth?.currentUser) {
        throw new Error('Not logged in');
      }

      const idToken = await getIdToken(auth.currentUser);
      
      const response = await fetch('/api/auth/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken })
      });

      const result = await response.json();
      
      updateResult('apiAuth', {
        success: response.ok,
        status: response.status,
        data: result
      });
    } catch (error: any) {
      updateResult('apiAuth', {
        success: false,
        error: error.message
      });
    } finally {
      setLoadingState('apiAuth', false);
    }
  };

  // Test Lead Creation
  const testLeadCreation = async () => {
    setLoadingState('leadCreation', true);
    try {
      const testLead = {
        contact: {
          name: 'Test User',
          email: 'test@example.com',
          phone: '555-0123'
        },
        property: {
          address: '123 Test St, Brooksville, FL 34601',
          zipCode: '34601'
        },
        projectDetails: {
          acreage: 5,
          services: ['forestry-mulching'],
          urgency: 'planning',
          budget: '$5000-$10000',
          description: 'Test project for system validation'
        },
        source: 'website',
        notes: 'Created during system testing'
      };

      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testLead)
      });

      const result = await response.json();
      
      updateResult('leadCreation', {
        success: response.ok,
        status: response.status,
        data: result
      });
    } catch (error: any) {
      updateResult('leadCreation', {
        success: false,
        error: error.message
      });
    } finally {
      setLoadingState('leadCreation', false);
    }
  };

  // Test AI Estimate
  const testAIEstimate = async () => {
    setLoadingState('aiEstimate', true);
    try {
      const testEstimate = {
        acreage: 3.5,
        vegetationDensity: 'medium',
        terrain: 'flat',
        access: 'good',
        obstacles: ['Power lines overhead'],
        stumpRemoval: false
      };

      const response = await fetch('/api/ai/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testEstimate)
      });

      const result = await response.json();
      
      updateResult('aiEstimate', {
        success: response.ok,
        status: response.status,
        data: result
      });
    } catch (error: any) {
      updateResult('aiEstimate', {
        success: false,
        error: error.message
      });
    } finally {
      setLoadingState('aiEstimate', false);
    }
  };

  // Test Database Query
  const testDatabaseQuery = async () => {
    setLoadingState('dbQuery', true);
    try {
      const response = await fetch('/api/leads?limit=5');
      const result = await response.json();
      
      updateResult('dbQuery', {
        success: response.ok,
        status: response.status,
        count: Array.isArray(result) ? result.length : 0,
        data: result
      });
    } catch (error: any) {
      updateResult('dbQuery', {
        success: false,
        error: error.message
      });
    } finally {
      setLoadingState('dbQuery', false);
    }
  };

  const TestButton = ({ label, onClick, testKey }: { label: string; onClick: () => void; testKey: string }) => (
    <button
      onClick={onClick}
      disabled={loading[testKey]}
      className={`px-4 py-2 rounded-lg font-medium transition-all ${
        loading[testKey]
          ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
          : 'bg-green-600 hover:bg-green-500 text-black'
      }`}
    >
      {loading[testKey] ? 'Testing...' : label}
    </button>
  );

  const ResultCard = ({ title, result }: { title: string; result: any }) => (
    <div className="bg-gray-800 rounded-lg p-4">
      <h3 className="font-semibold text-white mb-2">{title}</h3>
      {result ? (
        <pre className={`text-xs overflow-auto max-h-40 p-2 rounded ${
          result.success ? 'bg-green-900/20 text-green-300' : 'bg-red-900/20 text-red-300'
        }`}>
          {JSON.stringify(result, null, 2)}
        </pre>
      ) : (
        <p className="text-gray-400 text-sm">No test run yet</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      <main className="max-w-6xl mx-auto px-4 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-green-400 mb-2">🧪 System Testing Dashboard</h1>
          <p className="text-gray-300">Test Firebase Auth, AI integration, and database operations</p>
        </header>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Test Controls */}
          <div className="space-y-6">
            <div className="bg-gray-900 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Authentication Tests</h2>
              <div className="space-y-3">
                <TestButton label="Test Google Auth Login" onClick={testGoogleAuth} testKey="googleAuth" />
                <TestButton label="Test API Authentication" onClick={testAPIAuth} testKey="apiAuth" />
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Database Tests</h2>
              <div className="space-y-3">
                <TestButton label="Test Lead Creation" onClick={testLeadCreation} testKey="leadCreation" />
                <TestButton label="Test Database Query" onClick={testDatabaseQuery} testKey="dbQuery" />
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">AI Tests</h2>
              <div className="space-y-3">
                <TestButton label="Test AI Estimate" onClick={testAIEstimate} testKey="aiEstimate" />
              </div>
            </div>

            <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-4">
              <h3 className="font-semibold text-blue-400 mb-2">🚀 Quick Test All</h3>
              <button
                onClick={async () => {
                  await testGoogleAuth();
                  setTimeout(testAPIAuth, 1000);
                  setTimeout(testDatabaseQuery, 2000);
                  setTimeout(testAIEstimate, 3000);
                }}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                Run All Tests
              </button>
            </div>
          </div>

          {/* Test Results */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white mb-4">Test Results</h2>
            <ResultCard title="Google Auth Login" result={testResults.googleAuth} />
            <ResultCard title="API Authentication" result={testResults.apiAuth} />
            <ResultCard title="Lead Creation" result={testResults.leadCreation} />
            <ResultCard title="Database Query" result={testResults.dbQuery} />
            <ResultCard title="AI Estimate" result={testResults.aiEstimate} />
          </div>
        </div>

        <div className="mt-8 bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-6">
          <h3 className="font-semibold text-yellow-400 mb-2">📝 Testing Instructions</h3>
          <div className="text-sm text-gray-300 space-y-2">
            <p>1. <strong>Google Auth:</strong> Click "Test Google Auth Login" and sign in with your Google account</p>
            <p>2. <strong>API Auth:</strong> After logging in, test API authentication to verify admin access</p>
            <p>3. <strong>Database:</strong> Test CRUD operations with the Firestore database</p>
            <p>4. <strong>AI Services:</strong> Test the AI-powered estimate generation</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}