import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const { execSync } = require('child_process')
    
    try {
      // Fetch latest changes from remote
      execSync('git fetch origin', { stdio: 'inherit' })
      
      // Check if we're behind remote
      const status = execSync('git status --porcelain -b', { encoding: 'utf8' })
      const behind = status.includes('behind')
      
      if (behind) {
        // Pull latest changes
        execSync('git pull origin main', { stdio: 'inherit' })
        
        return NextResponse.json({ 
          message: 'Repository synced successfully - pulled latest changes',
          action: 'pulled',
          status: 'updated'
        })
      } else {
        return NextResponse.json({ 
          message: 'Repository is already up to date',
          action: 'none',
          status: 'up-to-date'
        })
      }
    } catch (error) {
      console.error('Git sync failed:', error)
      return NextResponse.json(
        { error: 'Failed to sync repository', details: error },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error syncing repository:', error)
    return NextResponse.json(
      { error: 'Failed to process sync request' },
      { status: 500 }
    )
  }
}