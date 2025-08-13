'use client'

import { useState } from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

interface GuideStep {
  id: string
  title: string
  icon: string
  steps: string[]
  videoUrl?: string
  estimatedTime: string
  difficulty: 'easy' | 'medium' | 'advanced'
}

const guides: GuideStep[] = [
  {
    id: 'get_ga4',
    title: 'Get Google Analytics 4 ID',
    icon: '📊',
    estimatedTime: '10 min',
    difficulty: 'easy',
    steps: [
      'Go to analytics.google.com and sign in with your Google account',
      'Click the gear icon (Admin) in the bottom left corner',
      'Click "Create Property" and name it (e.g., "TreeShop Website")',
      'Enter your website URL and select your business details',
      'For Data Stream, choose "Web" and enter your domain',
      'Copy the Measurement ID that starts with "G-"',
      'Paste it in the GA4 ID field in our setup wizard',
    ],
    videoUrl: 'https://www.youtube.com/watch?v=example',
  },
  {
    id: 'setup_stripe',
    title: 'Set Up Stripe Payments',
    icon: '💳',
    estimatedTime: '20 min',
    difficulty: 'medium',
    steps: [
      'Create an account at stripe.com/register',
      'Complete the business verification (have your EIN/SSN ready)',
      'Go to Dashboard > Developers > API keys',
      'Copy the "Publishable key" (starts with pk_)',
      'Click "Reveal test key" and copy the "Secret key" (starts with sk_)',
      'Start with test keys, then switch to live when ready',
      'Paste both keys in our Stripe configuration',
    ],
  },
  {
    id: 'google_maps_api',
    title: 'Create Google Maps API Key',
    icon: '🗺️',
    estimatedTime: '15 min',
    difficulty: 'medium',
    steps: [
      'Go to console.cloud.google.com',
      'Create a new project or select an existing one',
      'Click "Enable APIs and Services"',
      'Search for and enable "Maps JavaScript API"',
      'Also enable "Places API" for address autocomplete',
      'Go to Credentials > Create Credentials > API Key',
      'Click on the new key to add restrictions',
      'Under "Application restrictions" choose "HTTP referrers"',
      'Add your website URLs (e.g., https://yourdomain.com/*)',
      'Copy the API key and paste it in our setup',
    ],
  },
  {
    id: 'firebase_setup',
    title: 'Configure Firebase Project',
    icon: '🔥',
    estimatedTime: '15 min',
    difficulty: 'easy',
    steps: [
      'Go to console.firebase.google.com',
      'Click "Create a project" or select existing',
      'Give it a name (e.g., "TreeShop-Production")',
      'Enable Google Analytics if prompted',
      'Go to Project Settings (gear icon)',
      'Scroll down to "Your apps" section',
      'Click the Web icon (</>) to add a web app',
      'Register your app with a nickname',
      'Copy the configuration values shown',
      'Paste them in our Firebase setup fields',
    ],
  },
  {
    id: 'google_tag_manager',
    title: 'Install Google Tag Manager',
    icon: '🏷️',
    estimatedTime: '15 min',
    difficulty: 'easy',
    steps: [
      'Go to tagmanager.google.com',
      'Click "Create Account"',
      'Enter your company name as the account name',
      'Add a container name (your website name)',
      'Choose "Web" as the target platform',
      'Accept the terms of service',
      'Copy the GTM-XXXXXXX ID from the installation instructions',
      'Paste it in our GTM configuration',
      'We will handle the code installation automatically',
    ],
  },
  {
    id: 'google_business_profile',
    title: 'Connect Google Business Profile',
    icon: '🏪',
    estimatedTime: '30 min',
    difficulty: 'advanced',
    steps: [
      'Go to business.google.com',
      'Search for your business or create a new listing',
      'Verify ownership (postcard, phone, email, or instant)',
      'Complete your profile to 100% (all fields)',
      'Go to the API section in settings',
      'Enable API access for your account',
      'Generate OAuth credentials',
      'Use our OAuth flow to connect',
      'Your reviews will sync automatically',
    ],
  },
  {
    id: 'test_lead_submission',
    title: 'Test Lead Capture System',
    icon: '🧪',
    estimatedTime: '5 min',
    difficulty: 'easy',
    steps: [
      'Open your website in an incognito/private window',
      'Go to the estimate calculator',
      'Fill out the form with test data',
      'Use a real email address you can check',
      'Submit the form',
      'Check that you receive the lead notification',
      'Verify the lead appears in your admin dashboard',
      'Test the follow-up email system',
    ],
  },
  {
    id: 'optimize_seo',
    title: 'Optimize for Local SEO',
    icon: '🔍',
    estimatedTime: '30 min',
    difficulty: 'advanced',
    steps: [
      'Add your business to Google Business Profile',
      'Ensure NAP (Name, Address, Phone) consistency',
      'Create location-specific service pages',
      'Add schema markup for local business',
      'Build citations on local directories',
      'Encourage customer reviews',
      'Create local content (area guides, tips)',
      'Submit sitemap to Google Search Console',
    ],
  },
]

export default function QuickStartGuide() {
  const [selectedGuide, setSelectedGuide] = useState<string | null>(null)
  const [completedSteps, setCompletedSteps] = useState<Record<string, Set<number>>>(
    {}
  )

  const toggleStep = (guideId: string, stepIndex: number) => {
    setCompletedSteps(prev => {
      const guideSteps = new Set(prev[guideId] || [])
      if (guideSteps.has(stepIndex)) {
        guideSteps.delete(stepIndex)
      } else {
        guideSteps.add(stepIndex)
      }
      return {
        ...prev,
        [guideId]: guideSteps,
      }
    })
  }

  const getGuideProgress = (guideId: string) => {
    const guide = guides.find(g => g.id === guideId)
    if (!guide) return 0
    const completed = completedSteps[guideId]?.size || 0
    return Math.round((completed / guide.steps.length) * 100)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-400 bg-green-900/20'
      case 'medium':
        return 'text-yellow-400 bg-yellow-900/20'
      case 'advanced':
        return 'text-red-400 bg-red-900/20'
      default:
        return 'text-gray-400 bg-gray-900/20'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="glass-surface border-blue-500/30">
        <CardHeader>
          <h2 className="text-2xl font-bold text-white">Quick Start Guides</h2>
          <p className="text-gray-300 mt-1">
            Step-by-step instructions for setting up each integration
          </p>
        </CardHeader>
      </Card>

      {/* Guide Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {guides.map(guide => {
          const progress = getGuideProgress(guide.id)
          const isSelected = selectedGuide === guide.id
          
          return (
            <Card
              key={guide.id}
              className={`cursor-pointer transition-all duration-300 ${
                isSelected
                  ? 'border-blue-500 bg-blue-900/10 scale-105'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
              onClick={() => setSelectedGuide(isSelected ? null : guide.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="text-3xl">{guide.icon}</div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(guide.difficulty)}`}>
                    {guide.difficulty}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-white mb-1">
                  {guide.title}
                </h3>
                
                <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                  <span>⏱️ {guide.estimatedTime}</span>
                  <span>{guide.steps.length} steps</span>
                </div>
                
                {/* Progress Bar */}
                {progress > 0 && (
                  <div className="mb-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-green-400">{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-1.5">
                      <div
                        className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}
                
                <Button
                  variant={isSelected ? 'primary' : 'outline'}
                  size="sm"
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedGuide(isSelected ? null : guide.id)
                  }}
                >
                  {isSelected ? 'Hide Steps' : 'View Steps'}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Selected Guide Details */}
      {selectedGuide && (
        <Card className="glass-surface border-blue-500/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">
                  {guides.find(g => g.id === selectedGuide)?.icon}
                </span>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {guides.find(g => g.id === selectedGuide)?.title}
                  </h3>
                  <div className="flex items-center gap-3 text-sm text-gray-400 mt-1">
                    <span>⏱️ {guides.find(g => g.id === selectedGuide)?.estimatedTime}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      getDifficultyColor(guides.find(g => g.id === selectedGuide)?.difficulty || '')
                    }`}>
                      {guides.find(g => g.id === selectedGuide)?.difficulty}
                    </span>
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedGuide(null)}
              >
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {guides.find(g => g.id === selectedGuide)?.steps.map((step, index) => {
                const isCompleted = completedSteps[selectedGuide]?.has(index)
                
                return (
                  <div
                    key={index}
                    className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
                      isCompleted
                        ? 'bg-green-900/20 border border-green-700/30'
                        : 'bg-gray-800/50 hover:bg-gray-800'
                    }`}
                  >
                    <button
                      onClick={() => toggleStep(selectedGuide, index)}
                      className={`flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                        isCompleted
                          ? 'bg-green-600 border-green-600'
                          : 'border-gray-600 hover:border-green-500'
                      }`}
                    >
                      {isCompleted ? (
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <span className="text-xs text-gray-400">{index + 1}</span>
                      )}
                    </button>
                    <p className={`text-sm ${isCompleted ? 'text-green-300 line-through' : 'text-gray-300'}`}>
                      {step}
                    </p>
                  </div>
                )
              })}
            </div>
            
            {guides.find(g => g.id === selectedGuide)?.videoUrl && (
              <div className="mt-6 p-4 bg-blue-900/20 border border-blue-600/30 rounded-lg">
                <p className="text-blue-300 text-sm mb-2">📹 Video Tutorial Available</p>
                <a
                  href={guides.find(g => g.id === selectedGuide)?.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 text-sm underline"
                >
                  Watch step-by-step video guide →
                </a>
              </div>
            )}
            
            {/* Copy to Clipboard Button */}
            <div className="mt-6 flex justify-end">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  const guide = guides.find(g => g.id === selectedGuide)
                  if (guide) {
                    const text = guide.steps.map((step, i) => `${i + 1}. ${step}`).join('\n')
                    navigator.clipboard.writeText(text)
                    console.log('Steps copied to clipboard!')
                  }
                }}
              >
                📋 Copy Steps
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}