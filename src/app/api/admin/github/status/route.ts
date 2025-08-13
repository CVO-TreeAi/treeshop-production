import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check if we're in a git repository
    const { execSync } = require('child_process')
    
    let status = {
      connected: false,
      repository: null,
      branch: 'main',
      lastCommit: null,
      deploymentStatus: 'unknown',
      webhooksConfigured: false
    }

    try {
      // Get repository info
      const remoteUrl = execSync('git remote get-url origin', { encoding: 'utf8' }).trim()
      const currentBranch = execSync('git branch --show-current', { encoding: 'utf8' }).trim()
      const lastCommitHash = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim().substring(0, 7)
      const lastCommitMessage = execSync('git log -1 --pretty=%s', { encoding: 'utf8' }).trim()

      status = {
        connected: true,
        repository: remoteUrl.replace('https://github.com/', '').replace('.git', ''),
        branch: currentBranch,
        lastCommit: `${lastCommitHash}: ${lastCommitMessage}`,
        deploymentStatus: process.env.VERCEL_ENV ? 'success' : 'local',
        webhooksConfigured: !!process.env.GITHUB_TOKEN
      }
    } catch (error) {
      console.log('Not in a git repository or git not available')
    }

    return NextResponse.json(status)
  } catch (error) {
    console.error('Error checking GitHub status:', error)
    return NextResponse.json(
      { error: 'Failed to check GitHub status' },
      { status: 500 }
    )
  }
}