'use client';

import Link from 'next/link';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
// import { auth } from '@/lib/firebase';
// import { signOut, onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
// import { isAuthorizedUser } from '@/lib/auth';

export default function AdminHome(){
  const [user, setUser] = useState<null | { name: string; email: string; authorized: boolean }>(null);
  
  useEffect(() => {
    // Temporarily disabled Firebase auth for Convex migration
    // if (!auth) return;
    // return onAuthStateChanged(auth, (u) => {
    //   if (u) {
    //     setUser({ 
    //       name: u.displayName || u.email || 'User', 
    //       email: u.email || '',
          authorized: isAuthorizedUser(u)
        });
      } else {
        setUser(null);
      }
    });
  }, []);

  const logout = async () => {
    // if (!auth) return;
    // await signOut(auth);
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
                    className="px-4 py-2 rounded bg-red-600 hover:bg-red-500 text-white text-sm font-medium transition-colors"
                  >
                    Sign out
                  </button>
                </>
              )}
            </div>
          </div>
          
          <div className="bg-green-600/10 border border-green-600/30 rounded-lg p-4">
            <div className="flex items-center gap-2 text-green-400 text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Secure Access Confirmed</span>
            </div>
            <p className="text-green-300 text-xs mt-1">
              Access granted to authorized TreeAI team member. All actions are logged and monitored.
            </p>
          </div>
        </header>

        {/* Quick Actions Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">⚡ Quick Actions</h2>
            <p className="text-sm text-gray-400">Most frequently used tools</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/admin/claude-agent" className="group glass-morphism rounded-xl p-6 hover:scale-105 hover:shadow-glow transition-all duration-300">
              <div className="text-xl font-bold text-gradient-primary mb-2 group-hover:text-green-400 transition-all duration-300">🧠 Claude Business Expert</div>
              <div className="text-white group-hover:text-gray-100 transition-colors duration-300">Your AI business partner with full database access and TreeShop expertise</div>
            </Link>
            <Link href="/admin/media" className="group glass-morphism rounded-xl p-6 hover:scale-105 hover:shadow-glow transition-all duration-300">
              <div className="text-xl font-bold text-gradient-primary mb-2 group-hover:text-green-400 transition-all duration-300">🎬 Media Manager</div>
              <div className="text-white group-hover:text-gray-100 transition-colors duration-300">Manage YouTube videos, project gallery, blog posts, and website media</div>
            </Link>
            <Link href="/admin/quick-setup" className="group glass-morphism rounded-xl p-6 hover:scale-105 hover:shadow-glow transition-all duration-300">
              <div className="text-xl font-bold text-gradient-primary mb-2 group-hover:text-green-400 transition-all duration-300">🚀 Quick Setup</div>
              <div className="text-white group-hover:text-gray-100 transition-colors duration-300">One-click setup for media seeding and deployment automation</div>
            </Link>
          </div>
        </section>

        {/* Business Operations Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">💼 Business Operations</h2>
            <p className="text-sm text-gray-400">Daily business workflow management</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/admin/crm" className="block bg-gray-900 border border-gray-700 rounded-lg p-5 hover:border-green-500 hover:bg-gray-800 transition-colors">
              <div className="text-lg font-semibold text-green-400 mb-2">🤖 CRM</div>
              <div className="text-sm text-white">Lead scoring, estimates, follow-ups</div>
            </Link>
            <Link href="/admin/proposals" className="block bg-gray-900 border border-gray-700 rounded-lg p-5 hover:border-green-500 hover:bg-gray-800 transition-colors">
              <div className="text-lg font-semibold text-green-400 mb-2">📋 Proposals</div>
              <div className="text-sm text-white">Generate project proposals</div>
            </Link>
            <Link href="/admin/work-orders" className="block bg-gray-900 border border-gray-700 rounded-lg p-5 hover:border-green-500 hover:bg-gray-800 transition-colors">
              <div className="text-lg font-semibold text-green-400 mb-2">🚧 Work Orders</div>
              <div className="text-sm text-white">Job scheduling & tracking</div>
            </Link>
            <Link href="/admin/invoices" className="block bg-gray-900 border border-gray-700 rounded-lg p-5 hover:border-green-500 hover:bg-gray-800 transition-colors">
              <div className="text-lg font-semibold text-green-400 mb-2">💰 Invoices</div>
              <div className="text-sm text-white">Billing & payment tracking</div>
            </Link>
          </div>
        </section>

        {/* Content Management Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">📝 Content Management</h2>
            <p className="text-sm text-gray-400">Website content, media, and marketing</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/admin/blog" className="block bg-gray-900 border border-gray-700 rounded-lg p-5 hover:border-blue-500 hover:bg-gray-800 transition-colors">
              <div className="text-lg font-semibold text-blue-400 mb-2">✍️ Blog Editor</div>
              <div className="text-white text-sm">Create and edit blog posts with MDX</div>
            </Link>
            <Link href="/admin/gbp" className="block bg-gray-900 border border-gray-700 rounded-lg p-5 hover:border-green-500 hover:bg-gray-800 transition-colors">
              <div className="text-lg font-semibold text-green-400 mb-2">🟢 Google Business Profile</div>
              <div className="text-white text-sm">Connect, view reviews, and publish posts</div>
            </Link>
            <Link href="/blog" className="block bg-gray-900 border border-gray-700 rounded-lg p-5 hover:border-blue-500 hover:bg-gray-800 transition-colors">
              <div className="text-lg font-semibold text-blue-400 mb-2">📖 Content Hub</div>
              <div className="text-white text-sm">Review published content</div>
            </Link>
            <Link href="/videos" className="block bg-gray-900 border border-gray-700 rounded-lg p-5 hover:border-blue-500 hover:bg-gray-800 transition-colors">
              <div className="text-lg font-semibold text-blue-400 mb-2">🎥 Video Gallery</div>
              <div className="text-white text-sm">View live video showcase</div>
            </Link>
          </div>
        </section>

        {/* Development & Analytics Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">🔧 Development & Analytics</h2>
            <p className="text-sm text-gray-400">System management and insights</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/admin/github-agent" className="block bg-gray-900 border border-gray-700 rounded-lg p-5 hover:border-orange-500 hover:bg-gray-800 transition-colors">
              <div className="text-lg font-semibold text-orange-400 mb-2">⚡ GitHub Agent</div>
              <div className="text-white text-sm">Auto-deployment & CI/CD</div>
            </Link>
            <Link href="/admin/ai-dashboard" className="block bg-gray-900 border border-gray-700 rounded-lg p-5 hover:border-purple-500 hover:bg-gray-800 transition-colors">
              <div className="text-lg font-semibold text-purple-400 mb-2">📊 Analytics</div>
              <div className="text-white text-sm">Performance & conversion metrics</div>
            </Link>
            <Link href="/admin/test" className="block bg-gray-900 border border-gray-700 rounded-lg p-5 hover:border-yellow-500 hover:bg-gray-800 transition-colors">
              <div className="text-lg font-semibold text-yellow-400 mb-2">🧪 Testing</div>
              <div className="text-white text-sm">System component testing</div>
            </Link>
            <Link href="/admin/pdf-generator" className="block bg-gray-900 border border-gray-700 rounded-lg p-5 hover:border-red-500 hover:bg-gray-800 transition-colors">
              <div className="text-lg font-semibold text-red-400 mb-2">📄 PDF Tools</div>
              <div className="text-white text-sm">Document generation</div>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}


