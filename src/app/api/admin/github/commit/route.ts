import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()
    
    if (!message) {
      return NextResponse.json(
        { error: 'Commit message is required' },
        { status: 400 }
      )
    }

    const { execSync } = require('child_process')
    
    try {
      // Add all changes
      execSync('git add .', { stdio: 'inherit' })
      
      // Check if there are changes to commit
      const status = execSync('git status --porcelain', { encoding: 'utf8' }).trim()
      
      if (!status) {
        return NextResponse.json({ message: 'No changes to commit' })
      }
      
      // Create commit with agent signature
      const commitMessage = `${message}\n\n🤖 Automated commit via TreeAI Admin Agent\nCo-Authored-By: TreeAI-Agent <noreply@treeai.app>`
      
      execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' })
      
      // Push to remote if configured
      try {
        execSync('git push origin main', { stdio: 'inherit' })
      } catch (pushError) {
        console.log('Could not push to remote:', pushError)
        // Continue even if push fails
      }
      
      return NextResponse.json({ 
        message: 'Changes committed successfully',
        committed: true,
        pushed: true
      })
    } catch (error) {
      console.error('Git commit failed:', error)
      return NextResponse.json(
        { error: 'Failed to commit changes', details: error },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error committing:', error)
    return NextResponse.json(
      { error: 'Failed to process commit request' },
      { status: 500 }
    )
  }
}