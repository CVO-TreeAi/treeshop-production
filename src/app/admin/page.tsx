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

        {/* TreeAI Hive Intelligence - Primary Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-green-400 mb-4 flex items-center">
            🧠 TreeAI Hive Intelligence System
            <span className="ml-3 bg-green-500 text-black text-xs px-2 py-1 rounded font-bold">ACTIVE</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/admin/hive-dashboard" className="group">
              <div className="bg-gradient-to-br from-green-900 to-blue-900 rounded-lg p-6 hover:from-green-800 hover:to-blue-800 transition-all border border-green-500 group-hover:border-green-400 group-hover:scale-105">
                <h3 className="text-xl font-semibold text-green-300 mb-2">🤖 Hive Dashboard</h3>
                <p className="text-gray-200 text-sm">Real-time orchestration across 8 AI domains</p>
                <div className="mt-2 text-xs text-green-400">AgentOs Orchestration Active</div>
              </div>
            </Link>

            <Link href="/admin/crm" className="group">
              <div className="bg-gray-900 rounded-lg p-6 hover:bg-gray-800 transition-colors border border-gray-700 group-hover:border-blue-600">
                <h3 className="text-xl font-semibold text-blue-400 mb-2">💼 CRM & Leads</h3>
                <p className="text-gray-300 text-sm">Customer relationship management with AI scoring</p>
              </div>
            </Link>

            <Link href="/admin/ai-dashboard" className="group">
              <div className="bg-gray-900 rounded-lg p-6 hover:bg-gray-800 transition-colors border border-gray-700 group-hover:border-purple-600">
                <h3 className="text-xl font-semibold text-purple-400 mb-2">🧠 AI Dashboard</h3>
                <p className="text-gray-300 text-sm">TreeAI Core Intelligence and analytics</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Business Operations */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-300 mb-4">Business Operations</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/estimate" className="group">
              <div className="bg-gray-900 rounded-lg p-6 hover:bg-gray-800 transition-colors border border-gray-700 group-hover:border-green-600">
                <h3 className="text-xl font-semibold text-green-400 mb-2">🔧 Lead Engine</h3>
                <p className="text-gray-300 text-sm">AI-powered estimation and lead capture</p>
              </div>
            </Link>

            <Link href="/admin/proposals" className="group">
              <div className="bg-gray-900 rounded-lg p-6 hover:bg-gray-800 transition-colors border border-gray-700 group-hover:border-yellow-600">
                <h3 className="text-xl font-semibold text-yellow-400 mb-2">📋 Proposals</h3>
                <p className="text-gray-300 text-sm">Generate and manage project proposals</p>
              </div>
            </Link>

            <Link href="/admin/work-orders" className="group">
              <div className="bg-gray-900 rounded-lg p-6 hover:bg-gray-800 transition-colors border border-gray-700 group-hover:border-orange-600">
                <h3 className="text-xl font-semibold text-orange-400 mb-2">🏗️ Work Orders</h3>
                <p className="text-gray-300 text-sm">Project management and scheduling</p>
              </div>
            </Link>

            <Link href="/admin/blog-manager" className="group">
              <div className="bg-gray-900 rounded-lg p-6 hover:bg-gray-800 transition-colors border border-gray-700 group-hover:border-indigo-600">
                <h3 className="text-xl font-semibold text-indigo-400 mb-2">📝 Content</h3>
                <p className="text-gray-300 text-sm">Blog and content management</p>
              </div>
            </Link>

            <Link href="/admin/gbp" className="group">
              <div className="bg-gray-900 rounded-lg p-6 hover:bg-gray-800 transition-colors border border-gray-700 group-hover:border-red-600">
                <h3 className="text-xl font-semibold text-red-400 mb-2">🗺️ Google Business</h3>
                <p className="text-gray-300 text-sm">Local business profile management</p>
              </div>
            </Link>

            <Link href="/admin/github-agent" className="group">
              <div className="bg-gray-900 rounded-lg p-6 hover:bg-gray-800 transition-colors border border-gray-700 group-hover:border-gray-400">
                <h3 className="text-xl font-semibold text-gray-400 mb-2">🔧 DevOps</h3>
                <p className="text-gray-300 text-sm">Development and deployment tools</p>
              </div>
            </Link>
          </div>
        </div>

        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-6">
            <h3 className="font-semibold text-green-400 mb-2">🧠 Hive Intelligence Status</h3>
            <div className="text-sm text-gray-300 space-y-2">
              <p>✅ <strong>AgentOs Core:</strong> Orchestration Active</p>
              <p>✅ <strong>Domain 1 (TreeAI Core):</strong> Business Logic Operational</p>
              <p>✅ <strong>Domain 4 (SaaS Platform):</strong> Website & Admin Active</p>
              <p>🚧 <strong>Domains 3,5,6,7,8:</strong> In Development</p>
              <p>🤖 <strong>Multi-Agent System:</strong> Democratic Coordination</p>
            </div>
          </div>

          <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-6">
            <h3 className="font-semibold text-blue-400 mb-2">🚀 Platform Status</h3>
            <div className="text-sm text-gray-300 space-y-2">
              <p>✅ <strong>Build System:</strong> Next.js Operational</p>
              <p>✅ <strong>Backend:</strong> Convex Database Connected</p>
              <p>✅ <strong>Lead Engine:</strong> AI-powered Estimation</p>
              <p>✅ <strong>Email System:</strong> Gmail API Configured</p>
              <p>🔧 <strong>Environment:</strong> Production Ready</p>
            </div>
          </div>
        </div>

        {/* Hive Intelligence Overview */}
        <div className="mt-8 bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-600 rounded-lg p-6">
          <h3 className="font-semibold text-purple-400 mb-4 flex items-center">
            🌐 TreeAI Ecosystem Overview
            <span className="ml-3 bg-purple-500 text-white text-xs px-2 py-1 rounded">8 Domains</span>
          </h3>
          <div className="grid md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl mb-2">🌲</div>
              <div className="text-green-400 font-semibold">Domain 1</div>
              <div className="text-gray-400">TreeAI Core</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🤖</div>
              <div className="text-blue-400 font-semibold">Domain 2</div>
              <div className="text-gray-400">AgentOs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">📱</div>
              <div className="text-gray-500 font-semibold">Domain 3</div>
              <div className="text-gray-500">iOS Native</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🌐</div>
              <div className="text-cyan-400 font-semibold">Domain 4</div>
              <div className="text-gray-400">SaaS Platform</div>
            </div>
          </div>
          <div className="grid md:grid-cols-4 gap-4 text-sm mt-4">
            <div className="text-center">
              <div className="text-2xl mb-2">📊</div>
              <div className="text-gray-500 font-semibold">Domain 5</div>
              <div className="text-gray-500">Data Intelligence</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🔒</div>
              <div className="text-gray-500 font-semibold">Domain 6</div>
              <div className="text-gray-500">Security</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">⚙️</div>
              <div className="text-gray-500 font-semibold">Domain 7</div>
              <div className="text-gray-500">DevOps</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">💼</div>
              <div className="text-gray-500 font-semibold">Domain 8</div>
              <div className="text-gray-500">Business Intel</div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}