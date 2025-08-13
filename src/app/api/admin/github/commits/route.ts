import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const { execSync } = require('child_process')
    
    let commits = []

    try {
      // Get recent commits
      const gitLog = execSync('git log --oneline -10 --pretty=format:"%H|%s|%an|%ad" --date=iso', { 
        encoding: 'utf8' 
      }).trim()

      if (gitLog) {
        commits = gitLog.split('\n').map(line => {
          const [sha, message, author, date] = line.split('|')
          return {
            sha,
            message: message || 'No message',
            author: author || 'Unknown',
            date: date || new Date().toISOString(),
            url: `https://github.com/${process.env.GITHUB_REPOSITORY || 'repo'}/commit/${sha}`
          }
        })
      }
    } catch (error) {
      console.log('Could not fetch git commits:', error)
      // Return empty array if git is not available
    }

    return NextResponse.json(commits)
  } catch (error) {
    console.error('Error fetching commits:', error)
    return NextResponse.json(
      { error: 'Failed to fetch commits' },
      { status: 500 }
    )
  }
}