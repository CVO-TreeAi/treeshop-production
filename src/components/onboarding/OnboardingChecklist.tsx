'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

interface ChecklistItem {
  id: string
  category: string
  title: string
  description: string
  required: boolean
  completed: boolean
  automatedCheck?: () => Promise<boolean>
  helpText?: string
  estimatedTime?: string
  dependencies?: string[]
}

interface OnboardingChecklistProps {
  onItemComplete?: (itemId: string) => void
  onAllComplete?: () => void
}

export default function OnboardingChecklist({ onItemComplete, onAllComplete }: OnboardingChecklistProps) {
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    // Business Setup
    {
      id: 'business_profile',
      category: 'Business Setup',
      title: 'Complete Business Profile',
      description: 'Add company name, contact info, and service area',
      required: true,
      completed: false,
      estimatedTime: '10 min',
      helpText: 'This information appears on your website and proposals',
    },
    {
      id: 'service_config',
      category: 'Business Setup',
      title: 'Configure Services & Equipment',
      description: 'Select services offered and equipment available',
      required: true,
      completed: false,
      estimatedTime: '15 min',
      helpText: 'Helps generate accurate estimates',
    },
    {
      id: 'coverage_areas',
      category: 'Business Setup',
      title: 'Define Coverage Areas',
      description: 'Specify cities and regions you serve',
      required: true,
      completed: false,
      estimatedTime: '5 min',
      helpText: 'Ensures you only receive relevant leads',
    },
    
    // Essential Integrations
    {
      id: 'google_analytics',
      category: 'Analytics',
      title: 'Connect Google Analytics 4',
      description: 'Track website visitors and conversions',
      required: true,
      completed: false,
      estimatedTime: '10 min',
      helpText: 'Essential for understanding your marketing ROI',
    },
    {
      id: 'stripe_setup',
      category: 'Payments',
      title: 'Configure Stripe Payments',
      description: 'Enable online deposits and payments',
      required: true,
      completed: false,
      estimatedTime: '20 min',
      helpText: 'Collect deposits instantly on proposals',
    },
    {
      id: 'google_maps',
      category: 'Operations',
      title: 'Add Google Maps API',
      description: 'Display service areas and enable address lookup',
      required: true,
      completed: false,
      estimatedTime: '15 min',
      helpText: 'Shows your coverage area to visitors',
    },
    {
      id: 'DISABLED_FIREBASE_config',
      category: 'Infrastructure',
      title: 'Set Up Firebase',
      description: 'Configure database and authentication',
      required: true,
      completed: false,
      estimatedTime: '15 min',
      helpText: 'Powers your lead management system',
    },
    
    // Marketing Integrations
    {
      id: 'google_tag_manager',
      category: 'Marketing',
      title: 'Install Google Tag Manager',
      description: 'Manage all tracking codes in one place',
      required: false,
      completed: false,
      estimatedTime: '15 min',
      helpText: 'Add marketing pixels without code changes',
    },
    {
      id: 'google_ads',
      category: 'Marketing',
      title: 'Connect Google Ads',
      description: 'Track ad conversions and optimize campaigns',
      required: false,
      completed: false,
      estimatedTime: '20 min',
      helpText: 'Measure which ads generate real leads',
      dependencies: ['google_analytics'],
    },
    {
      id: 'google_business',
      category: 'Marketing',
      title: 'Link Google Business Profile',
      description: 'Import reviews and manage business info',
      required: false,
      completed: false,
      estimatedTime: '30 min',
      helpText: 'Display star ratings and reviews',
    },
    
    // Content & Branding
    {
      id: 'logo_upload',
      category: 'Branding',
      title: 'Upload Company Logo',
      description: 'Add your business logo for branding',
      required: true,
      completed: false,
      estimatedTime: '5 min',
      helpText: 'Appears on website and proposals',
    },
    {
      id: 'brand_colors',
      category: 'Branding',
      title: 'Set Brand Colors',
      description: 'Customize website colors to match your brand',
      required: false,
      completed: false,
      estimatedTime: '5 min',
      helpText: 'Creates consistent brand experience',
    },
    {
      id: 'hero_message',
      category: 'Content',
      title: 'Write Hero Message',
      description: 'Create compelling homepage headline',
      required: true,
      completed: false,
      estimatedTime: '10 min',
      helpText: 'First thing visitors see - make it count',
    },
    {
      id: 'value_props',
      category: 'Content',
      title: 'Add Value Propositions',
      description: 'Explain why customers should choose you',
      required: true,
      completed: false,
      estimatedTime: '15 min',
      helpText: 'Differentiates you from competitors',
    },
    {
      id: 'gallery_photos',
      category: 'Content',
      title: 'Upload Work Photos',
      description: 'Showcase your completed projects',
      required: false,
      completed: false,
      estimatedTime: '20 min',
      helpText: 'Visual proof of your work quality',
    },
    
    // Testing & Validation
    {
      id: 'test_lead',
      category: 'Testing',
      title: 'Submit Test Lead',
      description: 'Verify lead capture system works',
      required: true,
      completed: false,
      estimatedTime: '5 min',
      helpText: 'Ensures you receive lead notifications',
    },
    {
      id: 'test_payment',
      category: 'Testing',
      title: 'Test Payment Flow',
      description: 'Process a test payment transaction',
      required: true,
      completed: false,
      estimatedTime: '5 min',
      helpText: 'Verify Stripe is working correctly',
      dependencies: ['stripe_setup'],
    },
    {
      id: 'mobile_check',
      category: 'Testing',
      title: 'Check Mobile Display',
      description: 'Verify website looks good on phones',
      required: true,
      completed: false,
      estimatedTime: '5 min',
      helpText: '60% of visitors use mobile devices',
    },
    
    // Advanced Features
    {
      id: 'openai_setup',
      category: 'AI Features',
      title: 'Configure AI Assistant',
      description: 'Enable intelligent automation features',
      required: false,
      completed: false,
      estimatedTime: '5 min',
      helpText: 'Powers smart lead scoring and responses',
    },
    {
      id: 'calendar_integration',
      category: 'Operations',
      title: 'Connect Google Calendar',
      description: 'Enable appointment scheduling',
      required: false,
      completed: false,
      estimatedTime: '15 min',
      helpText: 'Prevents double-booking',
    },
    {
      id: 'email_templates',
      category: 'Automation',
      title: 'Set Up Email Templates',
      description: 'Create automated response templates',
      required: false,
      completed: false,
      estimatedTime: '20 min',
      helpText: 'Ensures immediate lead engagement',
    },
  ])

  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['Business Setup', 'Analytics', 'Payments']))
  const [filter, setFilter] = useState<'all' | 'required' | 'optional' | 'incomplete'>('required')

  useEffect(() => {
    // Load saved checklist state
    const saved = localStorage.getItem('treeai-onboarding-checklist')
    if (saved) {
      try {
        const savedChecklist = JSON.parse(saved)
        setChecklist(prev => prev.map(item => ({
          ...item,
          completed: savedChecklist[item.id] || false,
        })))
      } catch (error) {
        console.error('Failed to load checklist state:', error)
      }
    }
  }, [])

  const toggleItem = (itemId: string) => {
    setChecklist(prev => {
      const updated = prev.map(item =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      )
      
      // Save to localStorage
      const state = updated.reduce((acc, item) => ({
        ...acc,
        [item.id]: item.completed,
      }), {})
      localStorage.setItem('treeai-onboarding-checklist', JSON.stringify(state))
      
      // Callback
      if (onItemComplete) {
        const item = updated.find(i => i.id === itemId)
        if (item?.completed) {
          onItemComplete(itemId)
        }
      }
      
      // Check if all required items are complete
      const allRequiredComplete = updated.filter(i => i.required).every(i => i.completed)
      if (allRequiredComplete && onAllComplete) {
        onAllComplete()
      }
      
      return updated
    })
  }

  const runAutomatedCheck = async (item: ChecklistItem) => {
    if (!item.automatedCheck) return
    
    try {
      const result = await item.automatedCheck()
      if (result && !item.completed) {
        toggleItem(item.id)
      }
    } catch (error) {
      console.error(`Automated check failed for ${item.id}:`, error)
    }
  }

  const getFilteredItems = () => {
    switch (filter) {
      case 'required':
        return checklist.filter(item => item.required)
      case 'optional':
        return checklist.filter(item => !item.required)
      case 'incomplete':
        return checklist.filter(item => !item.completed)
      default:
        return checklist
    }
  }

  const getCategories = () => {
    const items = getFilteredItems()
    const categories = new Map<string, ChecklistItem[]>()
    
    items.forEach(item => {
      const category = item.category
      if (!categories.has(category)) {
        categories.set(category, [])
      }
      categories.get(category)!.push(item)
    })
    
    return Array.from(categories.entries())
  }

  const getProgress = () => {
    const required = checklist.filter(i => i.required)
    const requiredComplete = required.filter(i => i.completed)
    const optional = checklist.filter(i => !i.required)
    const optionalComplete = optional.filter(i => i.completed)
    
    return {
      required: required.length,
      requiredComplete: requiredComplete.length,
      optional: optional.length,
      optionalComplete: optionalComplete.length,
      totalPercentage: Math.round(((requiredComplete.length + optionalComplete.length) / checklist.length) * 100),
      requiredPercentage: Math.round((requiredComplete.length / required.length) * 100),
    }
  }

  const progress = getProgress()

  return (
    <div className="space-y-6">
      {/* Progress Summary */}
      <Card className="glass-surface border-green-500/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Setup Checklist</h2>
              <p className="text-gray-300 mt-1">Complete these items to launch your website</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-400">{progress.requiredPercentage}%</div>
              <div className="text-sm text-gray-400">Required Complete</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Required Progress */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-300">Required Items</span>
                <span className="text-green-400">{progress.requiredComplete}/{progress.required}</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progress.requiredPercentage}%` }}
                />
              </div>
            </div>
            
            {/* Optional Progress */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-300">Optional Items</span>
                <span className="text-blue-400">{progress.optionalComplete}/{progress.optional}</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(progress.optionalComplete / progress.optional) * 100}%` }}
                />
              </div>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4 mt-6 text-center">
            <div>
              <div className="text-2xl font-bold text-white">{checklist.length}</div>
              <div className="text-xs text-gray-400">Total Items</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">{progress.requiredComplete + progress.optionalComplete}</div>
              <div className="text-xs text-gray-400">Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400">{checklist.length - progress.requiredComplete - progress.optionalComplete}</div>
              <div className="text-xs text-gray-400">Remaining</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">
                {Math.round(checklist.reduce((acc, item) => {
                  if (!item.completed && item.estimatedTime) {
                    const minutes = parseInt(item.estimatedTime)
                    return acc + (isNaN(minutes) ? 0 : minutes)
                  }
                  return acc
                }, 0) / 60)}h
              </div>
              <div className="text-xs text-gray-400">Time Left</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <Button
          variant={filter === 'all' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          All ({checklist.length})
        </Button>
        <Button
          variant={filter === 'required' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setFilter('required')}
        >
          Required ({progress.required})
        </Button>
        <Button
          variant={filter === 'optional' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setFilter('optional')}
        >
          Optional ({progress.optional})
        </Button>
        <Button
          variant={filter === 'incomplete' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setFilter('incomplete')}
        >
          Incomplete ({checklist.filter(i => !i.completed).length})
        </Button>
      </div>

      {/* Checklist Items by Category */}
      <div className="space-y-4">
        {getCategories().map(([category, items]) => (
          <Card key={category} className="border-gray-700">
            <CardHeader
              className="cursor-pointer"
              onClick={() => {
                setExpandedCategories(prev => {
                  const next = new Set(prev)
                  if (next.has(category)) {
                    next.delete(category)
                  } else {
                    next.add(category)
                  }
                  return next
                })
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      expandedCategories.has(category) ? 'rotate-90' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <h3 className="text-lg font-semibold text-white">{category}</h3>
                  <span className="text-sm text-gray-400">
                    {items.filter(i => i.completed).length}/{items.length} complete
                  </span>
                </div>
                <div className="flex gap-2">
                  {items.some(i => i.required) && (
                    <span className="text-xs bg-yellow-600/20 text-yellow-400 px-2 py-1 rounded-full">
                      Has Required
                    </span>
                  )}
                </div>
              </div>
            </CardHeader>
            
            {expandedCategories.has(category) && (
              <CardContent>
                <div className="space-y-3">
                  {items.map((item) => {
                    const isBlocked = item.dependencies?.some(dep => 
                      !checklist.find(i => i.id === dep)?.completed
                    )
                    
                    return (
                      <div
                        key={item.id}
                        className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
                          item.completed
                            ? 'bg-green-900/20 border border-green-700/30'
                            : isBlocked
                            ? 'bg-gray-900/50 opacity-50'
                            : 'bg-gray-800/50 hover:bg-gray-800'
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="w-5 h-5 mt-0.5 text-green-600 bg-gray-800 border-gray-600 rounded focus:ring-green-500"
                          checked={item.completed}
                          onChange={() => !isBlocked && toggleItem(item.id)}
                          disabled={isBlocked}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`font-medium ${item.completed ? 'text-green-400 line-through' : 'text-white'}`}>
                              {item.title}
                            </span>
                            {item.required && (
                              <span className="text-xs bg-yellow-600/20 text-yellow-400 px-2 py-0.5 rounded-full">
                                Required
                              </span>
                            )}
                            {item.estimatedTime && (
                              <span className="text-xs text-gray-500">
                                ⏱️ {item.estimatedTime}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-400 mb-1">{item.description}</p>
                          {item.helpText && (
                            <p className="text-xs text-blue-400 italic">{item.helpText}</p>
                          )}
                          {isBlocked && item.dependencies && (
                            <p className="text-xs text-red-400 mt-1">
                              ⚠️ Complete these first: {item.dependencies.join(', ')}
                            </p>
                          )}
                          {item.automatedCheck && !item.completed && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => runAutomatedCheck(item)}
                              className="mt-2"
                            >
                              Run Check
                            </Button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Launch Readiness */}
      {progress.requiredPercentage === 100 && (
        <Card className="glass-surface border-green-500/50 bg-green-900/20">
          <CardContent className="text-center py-8">
            <div className="text-5xl mb-4">🚀</div>
            <h3 className="text-2xl font-bold text-green-400 mb-2">Ready to Launch!</h3>
            <p className="text-gray-300 mb-6">
              All required items are complete. Your website is ready to go live!
            </p>
            <Button variant="primary" size="lg">
              Launch Website →
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}