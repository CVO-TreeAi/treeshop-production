'use client';

import Link from 'next/link';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { useEffect, useState } from 'react';

export default function AdminHome(){
  const [user, setUser] = useState<null | { name: string; email: string; authorized: boolean }>(null);
  
  useEffect(() => {
    // Temporarily disabled auth for Convex migration
    setUser({ 
      name: 'Admin User', 
      email: 'admin@treeai.us',
      authorized: true
    });
  }, []);

  const logout = async () => {
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      <main className="max-w-5xl mx-auto px-4 py-12">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">TreeAI Admin Portal</h1>
            <div className="flex items-center gap-3">
              {user && (
                <>
                  <div className="text-right">
                    <div className="text-sm font-medium text-white">{user.name}</div>
                    <div className="text-xs text-gray-400">{user.email}</div>
                  </div>
                  <button 
                    onClick={logout} 
                    className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
          <p className="text-gray-300">Manage your TreeAI platform operations</p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/estimate" className="group">
            <div className="bg-gray-900 rounded-lg p-6 hover:bg-gray-800 transition-colors border border-gray-700 group-hover:border-green-600">
              <h3 className="text-xl font-semibold text-green-400 mb-2">🔧 Lead Engine</h3>
              <p className="text-gray-300 text-sm">AI-powered estimation and lead capture system</p>
            </div>
          </Link>

          <div className="bg-gray-900 rounded-lg p-6 border border-gray-700 opacity-50">
            <h3 className="text-xl font-semibold text-gray-400 mb-2">📊 Dashboard</h3>
            <p className="text-gray-500 text-sm">Coming soon with Convex migration</p>
          </div>

          <div className="bg-gray-900 rounded-lg p-6 border border-gray-700 opacity-50">
            <h3 className="text-xl font-semibold text-gray-400 mb-2">💼 CRM</h3>
            <p className="text-gray-500 text-sm">Coming soon with Convex migration</p>
          </div>
        </div>

        <div className="mt-8 bg-blue-900/20 border border-blue-600/30 rounded-lg p-6">
          <h3 className="font-semibold text-blue-400 mb-2">🚀 System Status</h3>
          <div className="text-sm text-gray-300 space-y-2">
            <p>✅ <strong>Lead Generation:</strong> Active (PDF proposals)</p>
            <p>✅ <strong>Convex Backend:</strong> Connected</p>
            <p>✅ <strong>Gmail API:</strong> Configured</p>
            <p>❌ <strong>Firebase:</strong> Disabled (migrated to Convex)</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}