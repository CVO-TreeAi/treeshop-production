'use client'

import { useState, useEffect } from 'react'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'

interface GitHubStatus {
  connected: boolean
  repository: string | null
  branch: string
  lastCommit: string | null
  deploymentStatus: string
  webhooksConfigured: boolean
}

interface CommitInfo {
  sha: string
  message: string
  author: string
  date: string
  url: string
}

export default function GitHubAgentPage() {
  const [status, setStatus] = useState<GitHubStatus>({
    connected: false,
    repository: null,
    branch: 'main',
    lastCommit: null,
    deploymentStatus: 'unknown',
    webhooksConfigured: false
  })
  const [commits, setCommits] = useState<CommitInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    fetchGitHubStatus()
    fetchRecentCommits()
  }, [])

  const fetchGitHubStatus = async () => {
    try {
      const response = await fetch('/api/admin/github/status')
      if (response.ok) {
        const data = await response.json()
        setStatus(data)
      }
    } catch (error) {
      console.error('Failed to fetch GitHub status:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRecentCommits = async () => {
    try {
      const response = await fetch('/api/admin/github/commits')
      if (response.ok) {
        const data = await response.json()
        setCommits(data)
      }
    } catch (error) {
      console.error('Failed to fetch commits:', error)
    }
  }

  const handleAction = async (action: string, data?: any) => {
    setActionLoading(action)
    try {
      const response = await fetch(`/api/admin/github/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: data ? JSON.stringify(data) : undefined
      })

      if (response.ok) {
        const result = await response.json()
        alert(result.message || `${action} completed successfully`)
        await fetchGitHubStatus()
        if (action === 'commit' || action === 'deploy') {
          await fetchRecentCommits()
        }
      } else {
        const error = await response.json()
        alert(`Error: ${error.error || 'Operation failed'}`)
      }
    } catch (error) {
      console.error(`Action ${action} failed:`, error)
      alert(`Failed to ${action}`)
    } finally {
      setActionLoading(null)
    }
  }

  const createCommitAndDeploy = async () => {
    const message = prompt('Enter commit message:', 'Update website content via admin interface')
    if (!message) return

    setActionLoading('commit-deploy')
    try {
      // First commit changes
      await handleAction('commit', { message })
      
      // Then trigger deployment
      setTimeout(() => {
        handleAction('deploy')
      }, 2000)
    } catch (error) {
      console.error('Commit and deploy failed:', error)
      setActionLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p>Loading GitHub agent...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      
      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">GitHub Management Agent</h1>
          <p className="text-gray-300">Automated repository management and deployment</p>
        </div>

        {/* Status Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-3 h-3 rounded-full ${status.connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <h3 className="text-lg font-semibold">Repository Status</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Connected:</span>
                <span className={status.connected ? 'text-green-400' : 'text-red-400'}>
                  {status.connected ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Repository:</span>
                <span className="text-white">{status.repository || 'Not configured'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Branch:</span>
                <span className="text-white">{status.branch}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-3 h-3 rounded-full ${
                status.deploymentStatus === 'success' ? 'bg-green-500' :
                status.deploymentStatus === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
              }`}></div>
              <h3 className="text-lg font-semibold">Deployment Status</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <span className={`capitalize ${
                  status.deploymentStatus === 'success' ? 'text-green-400' :
                  status.deploymentStatus === 'pending' ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {status.deploymentStatus}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Webhooks:</span>
                <span className={status.webhooksConfigured ? 'text-green-400' : 'text-red-400'}>
                  {status.webhooksConfigured ? 'Configured' : 'Not configured'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Last Commit:</span>
                <span className="text-white truncate ml-2">
                  {status.lastCommit || 'None'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={createCommitAndDeploy}
                disabled={actionLoading === 'commit-deploy'}
                className="w-full bg-green-600 hover:bg-green-500 disabled:bg-gray-600 text-black disabled:text-gray-400 font-semibold px-4 py-2 rounded-lg transition-colors text-sm"
              >
                {actionLoading === 'commit-deploy' ? 'Processing...' : 'Commit & Deploy'}
              </button>
              
              <button
                onClick={() => handleAction('sync')}
                disabled={actionLoading === 'sync'}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 text-white disabled:text-gray-400 font-semibold px-4 py-2 rounded-lg transition-colors text-sm"
              >
                {actionLoading === 'sync' ? 'Syncing...' : 'Sync Repository'}
              </button>
              
              <button
                onClick={() => handleAction('setup-workflows')}
                disabled={actionLoading === 'setup-workflows'}
                className="w-full bg-purple-600 hover:bg-purple-500 disabled:bg-gray-600 text-white disabled:text-gray-400 font-semibold px-4 py-2 rounded-lg transition-colors text-sm"
              >
                {actionLoading === 'setup-workflows' ? 'Setting up...' : 'Setup CI/CD'}
              </button>
            </div>
          </div>
        </div>

        {/* Recent Commits */}
        <div className="bg-gray-900 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-white mb-6">Recent Commits</h3>
          
          {commits.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">📝</div>
              <h4 className="text-lg font-semibold text-white mb-2">No commits found</h4>
              <p className="text-gray-400">Connect your repository to see commit history</p>
            </div>
          ) : (
            <div className="space-y-4">
              {commits.map((commit) => (
                <div key={commit.sha} className="bg-gray-800 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium mb-1 truncate">
                        {commit.message}
                      </h4>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>By {commit.author}</span>
                        <span>{new Date(commit.date).toLocaleDateString()}</span>
                        <span className="font-mono text-xs">
                          {commit.sha.substring(0, 7)}
                        </span>
                      </div>
                    </div>
                    <a
                      href={commit.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 text-sm ml-4"
                    >
                      View
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Agent Configuration */}
        <div className="bg-gray-900 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-6">Agent Configuration</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Automated Actions</h4>
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span className="text-gray-200">Auto-commit media changes</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span className="text-gray-200">Auto-deploy on main branch</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span className="text-gray-200">Sync every 30 minutes</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-gray-200">Create backup branches</span>
                </label>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Best Practices</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-green-400">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Meaningful commit messages</span>
                </div>
                <div className="flex items-center gap-2 text-green-400">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Regular automated backups</span>
                </div>
                <div className="flex items-center gap-2 text-green-400">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Environment-specific deployments</span>
                </div>
                <div className="flex items-center gap-2 text-green-400">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Dependency security scanning</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}