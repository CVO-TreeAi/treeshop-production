import { NextResponse } from 'next/server'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

export async function POST() {
  try {
    const workflowsDir = join(process.cwd(), '../../.github/workflows')
    
    // Ensure .github/workflows directory exists
    if (!existsSync(workflowsDir)) {
      mkdirSync(workflowsDir, { recursive: true })
    }

    const workflows = {
      'deploy.yml': `name: 🚀 Deploy TreeAI ProWebsite

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  workflow_dispatch:

jobs:
  test:
    name: 🧪 Test & Build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: 'apps/web/package-lock.json'
      
      - name: Install dependencies
        working-directory: apps/web
        run: npm ci
      
      - name: Run lint
        working-directory: apps/web
        run: npm run lint
      
      - name: Build application
        working-directory: apps/web
        run: npm run build

  deploy:
    name: 🌐 Deploy
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to Vercel
        if: \${{ secrets.VERCEL_TOKEN }}
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: \${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: \${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: \${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: apps/web
          vercel-args: '--prod'`,

      'auto-commit.yml': `name: 🤖 Auto-Commit Media Changes

on:
  schedule:
    - cron: '*/30 * * * *'
  workflow_dispatch:

jobs:
  auto-commit:
    name: 🔄 Auto-Commit Changes
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          token: \${{ secrets.GITHUB_TOKEN }}
          fetch-depth: 0

      - name: Configure Git
        run: |
          git config --global user.name 'TreeAI Agent'
          git config --global user.email 'agent@treeai.app'

      - name: Check and commit changes
        run: |
          if [[ -n \$(git status --porcelain) ]]; then
            git add .
            git commit -m "🤖 Auto-commit: Media updates via TreeAI Admin Agent"
            git push origin main
            echo "✅ Changes committed and pushed"
          else
            echo "✅ No changes to commit"
          fi`
    }

    // Write workflow files
    let created = []
    for (const [filename, content] of Object.entries(workflows)) {
      const filePath = join(workflowsDir, filename)
      writeFileSync(filePath, content)
      created.push(filename)
    }

    // Create Vercel configuration
    const vercelConfig = {
      "version": 2,
      "name": "treeai-prowebsite",
      "builds": [
        {
          "src": "apps/web/package.json",
          "use": "@vercel/next"
        }
      ],
      "routes": [
        {
          "src": "/(.*)",
          "dest": "apps/web/$1"
        }
      ],
      "env": {
        "NODE_ENV": "production"
      }
    }

    const vercelPath = join(process.cwd(), '../../vercel.json')
    writeFileSync(vercelPath, JSON.stringify(vercelConfig, null, 2))
    created.push('vercel.json')

    return NextResponse.json({
      message: 'CI/CD workflows created successfully',
      created,
      instructions: [
        '1. Add these secrets to your GitHub repository:',
        '   - VERCEL_TOKEN (from Vercel dashboard)',
        '   - VERCEL_ORG_ID (from Vercel dashboard)', 
        '   - VERCEL_PROJECT_ID (from Vercel dashboard)',
        '2. Enable GitHub Actions in your repository',
        '3. Push these changes to trigger the first deployment',
        '4. The auto-commit workflow will run every 30 minutes'
      ]
    })
  } catch (error) {
    console.error('Error setting up workflows:', error)
    return NextResponse.json(
      { error: 'Failed to setup workflows', details: error },
      { status: 500 }
    )
  }
}