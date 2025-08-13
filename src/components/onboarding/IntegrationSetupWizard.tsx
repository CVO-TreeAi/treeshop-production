'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

interface Integration {
  id: string
  name: string
  description: string
  icon: string
  category: 'analytics' | 'payment' | 'marketing' | 'operations' | 'ai'
  required: boolean
  setupTime: string
  monthlyValue: string
  fields: Field[]
  helpUrl?: string
  setupSteps?: string[]
  businessImpact?: string[]
}

interface Field {
  key: string
  label: string
  type: 'text' | 'password' | 'textarea' | 'select'
  placeholder?: string
  required?: boolean
  helpText?: string
  validation?: string
  options?: { value: string; label: string }[]
}

interface IntegrationSetupWizardProps {
  onComplete?: (data: Record<string, any>) => void
  onValidation?: (integration: string, valid: boolean) => void
}

const integrations: Integration[] = [
  {
    id: 'google_analytics',
    name: 'Google Analytics 4',
    description: 'Track website visitors, lead sources, and conversion rates',
    icon: '📊',
    category: 'analytics',
    required: true,
    setupTime: '10 min',
    monthlyValue: '$2,000+',
    businessImpact: [
      'Understand which marketing channels drive the most leads',
      'Track visitor behavior to optimize conversion rates',
      'Measure ROI on advertising spend',
      'Identify top-performing content and pages',
    ],
    fields: [
      {
        key: 'ga4_id',
        label: 'GA4 Measurement ID',
        type: 'text',
        placeholder: 'G-XXXXXXXXXX',
        required: true,
        helpText: 'Found in Admin > Data Streams > Web Stream Details',
        validation: '^G-[A-Z0-9]{10}$',
      },
      {
        key: 'ga4_api_secret',
        label: 'Measurement Protocol API Secret (Optional)',
        type: 'password',
        placeholder: 'Your API secret',
        helpText: 'For server-side tracking. Found in Admin > Data Streams > Measurement Protocol',
      },
    ],
    helpUrl: 'https://analytics.google.com',
    setupSteps: [
      'Go to analytics.google.com and sign in',
      'Click Admin (gear icon) in bottom left',
      'Create a new GA4 property for your website',
      'Set up a Web data stream with your domain',
      'Copy the Measurement ID (starts with G-)',
    ],
  },
  {
    id: 'google_tag_manager',
    name: 'Google Tag Manager',
    description: 'Manage all tracking codes and marketing pixels in one place',
    icon: '🏷️',
    category: 'analytics',
    required: false,
    setupTime: '15 min',
    monthlyValue: '$500+',
    businessImpact: [
      'Add tracking codes without developer help',
      'Track form submissions and phone calls',
      'Implement Facebook and Google Ads pixels',
      'A/B test different tracking configurations',
    ],
    fields: [
      {
        key: 'gtm_id',
        label: 'GTM Container ID',
        type: 'text',
        placeholder: 'GTM-XXXXXXX',
        helpText: 'Found in your GTM container',
        validation: '^GTM-[A-Z0-9]{7}$',
      },
    ],
    helpUrl: 'https://tagmanager.google.com',
    setupSteps: [
      'Go to tagmanager.google.com',
      'Create a new container for your website',
      'Choose "Web" as the platform',
      'Copy the GTM ID from the install instructions',
      'We will handle the installation automatically',
    ],
  },
  {
    id: 'stripe',
    name: 'Stripe Payments',
    description: 'Accept secure online payments and proposal deposits',
    icon: '💳',
    category: 'payment',
    required: true,
    setupTime: '20 min',
    monthlyValue: '$5,000+',
    businessImpact: [
      'Collect instant deposits on proposals (10-20% typical)',
      'Reduce payment collection time by 70%',
      'Accept all major credit cards and digital wallets',
      'Automatic payment receipts and invoicing',
    ],
    fields: [
      {
        key: 'stripe_publishable_key',
        label: 'Publishable Key',
        type: 'text',
        placeholder: 'pk_live_... or pk_test_...',
        required: true,
        helpText: 'Safe to use in browser. Found in Stripe Dashboard > API keys',
      },
      {
        key: 'stripe_secret_key',
        label: 'Secret Key',
        type: 'password',
        placeholder: 'sk_live_... or sk_test_...',
        required: true,
        helpText: 'Keep this secure! Never share or expose in code',
      },
      {
        key: 'stripe_webhook_secret',
        label: 'Webhook Signing Secret (Optional)',
        type: 'password',
        placeholder: 'whsec_...',
        helpText: 'For payment notifications. Set up in Stripe Dashboard > Webhooks',
      },
    ],
    helpUrl: 'https://dashboard.stripe.com',
    setupSteps: [
      'Create account at stripe.com',
      'Complete business verification (takes 5-10 min)',
      'Go to Dashboard > Developers > API keys',
      'Copy both publishable and secret keys',
      'Use test keys first, then switch to live when ready',
    ],
  },
  {
    id: 'google_maps',
    name: 'Google Maps',
    description: 'Display service areas and enable address autocomplete',
    icon: '🗺️',
    category: 'operations',
    required: true,
    setupTime: '15 min',
    monthlyValue: '$1,000+',
    businessImpact: [
      'Show exact service coverage areas to visitors',
      'Auto-complete addresses for faster lead capture',
      'Display your business location on a map',
      'Calculate service radius automatically',
    ],
    fields: [
      {
        key: 'maps_api_key',
        label: 'Google Maps API Key',
        type: 'text',
        placeholder: 'AIza...',
        required: true,
        helpText: 'Enable Maps JavaScript API and Places API',
      },
    ],
    helpUrl: 'https://console.cloud.google.com',
    setupSteps: [
      'Go to console.cloud.google.com',
      'Create a new project or select existing',
      'Enable Maps JavaScript API and Places API',
      'Go to Credentials and create an API key',
      'Add your website domain to key restrictions',
    ],
  },
  {
    id: 'google_business',
    name: 'Google Business Profile',
    description: 'Manage reviews and business information across Google',
    icon: '🏪',
    category: 'marketing',
    required: false,
    setupTime: '30 min',
    monthlyValue: '$3,000+',
    businessImpact: [
      'Display star ratings on your website',
      'Automatically import Google reviews',
      'Update business hours and info from one place',
      'Improve local SEO rankings',
    ],
    fields: [
      {
        key: 'gbp_account_id',
        label: 'Business Profile Account ID',
        type: 'text',
        placeholder: 'accounts/1234567890',
        helpText: 'We will help you find this during OAuth setup',
      },
    ],
    helpUrl: 'https://business.google.com',
    setupSteps: [
      'Claim your business at business.google.com',
      'Verify ownership (postcard, phone, or email)',
      'Complete your business profile (100%)',
      'Enable API access through OAuth',
      'We will guide you through the connection',
    ],
  },
  {
    id: 'google_ads',
    name: 'Google Ads',
    description: 'Track conversions and optimize ad campaigns',
    icon: '📢',
    category: 'marketing',
    required: false,
    setupTime: '25 min',
    monthlyValue: '$4,000+',
    businessImpact: [
      'Track which ads generate real leads',
      'Optimize bidding for better ROI',
      'Create remarketing audiences automatically',
      'Measure cost per lead accurately',
    ],
    fields: [
      {
        key: 'ads_conversion_id',
        label: 'Conversion ID',
        type: 'text',
        placeholder: 'AW-123456789',
        helpText: 'Found in Google Ads > Tools > Conversions',
      },
      {
        key: 'ads_conversion_label',
        label: 'Conversion Label',
        type: 'text',
        placeholder: 'AbC-D_efG-h12_34-567',
        helpText: 'Specific to your lead conversion action',
      },
    ],
    helpUrl: 'https://ads.google.com',
    setupSteps: [
      'Set up Google Ads account if needed',
      'Create a "Lead" conversion action',
      'Get the conversion ID and label',
      'We will implement the tracking code',
      'Start seeing ROI data within 24 hours',
    ],
  },
  {
    id: 'openai',
    name: 'OpenAI (AI Assistant)',
    description: 'Power intelligent features and automated responses',
    icon: '🤖',
    category: 'ai',
    required: false,
    setupTime: '5 min',
    monthlyValue: '$1,500+',
    businessImpact: [
      'Intelligent lead qualification and scoring',
      'Automated proposal customization',
      'Smart email response suggestions',
      'Natural language estimate descriptions',
    ],
    fields: [
      {
        key: 'openai_api_key',
        label: 'OpenAI API Key',
        type: 'password',
        placeholder: 'sk-...',
        required: true,
        helpText: 'Keep this secure! Found at platform.openai.com/api-keys',
      },
    ],
    helpUrl: 'https://platform.openai.com',
    setupSteps: [
      'Create account at platform.openai.com',
      'Add billing information (pay as you go)',
      'Generate a new API key',
      'Set usage limits for safety ($50/month recommended)',
      'Copy the key (you can only see it once)',
    ],
  },
  {
    id: 'DISABLED_FIREBASE',
    name: 'Firebase',
    description: 'Database, authentication, and real-time features',
    icon: '🔥',
    category: 'operations',
    required: true,
    setupTime: '15 min',
    monthlyValue: 'Infrastructure',
    businessImpact: [
      'Secure user authentication and access control',
      'Real-time lead notifications',
      'Automatic data backups',
      'Scale to handle growth automatically',
    ],
    fields: [
      {
        key: 'DISABLED_FIREBASE_project_id',
        label: 'Project ID',
        type: 'text',
        placeholder: 'your-project-id',
        required: true,
        helpText: 'Found in Firebase Console > Project Settings',
      },
      {
        key: 'DISABLED_FIREBASE_api_key',
        label: 'Web API Key',
        type: 'text',
        placeholder: 'AIza...',
        required: true,
        helpText: 'Found in Project Settings > General',
      },
      {
        key: 'DISABLED_FIREBASE_auth_domain',
        label: 'Auth Domain',
        type: 'text',
        placeholder: 'your-project.DISABLED_FIREBASEapp.com',
        required: true,
        helpText: 'Usually your-project-id.DISABLED_FIREBASEapp.com',
      },
    ],
    helpUrl: 'https://console.DISABLED_FIREBASE.google.com',
    setupSteps: [
      'Go to console.DISABLED_FIREBASE.google.com',
      'Create a new project or select existing',
      'Enable Authentication and Firestore',
      'Go to Project Settings > General',
      'Copy the configuration values',
    ],
  },
]

export default function IntegrationSetupWizard({ onComplete, onValidation }: IntegrationSetupWizardProps) {
  const [currentIntegration, setCurrentIntegration] = useState<string>('google_analytics')
  const [credentials, setCredentials] = useState<Record<string, Record<string, string>>>({})
  const [validationStatus, setValidationStatus] = useState<Record<string, 'pending' | 'validating' | 'valid' | 'invalid'>>({})
  const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>({})
  const [showAllIntegrations, setShowAllIntegrations] = useState(false)
  const [filter, setFilter] = useState<'all' | 'required' | 'optional'>('required')

  const validateIntegration = async (integrationId: string) => {
    const integration = integrations.find(i => i.id === integrationId)
    if (!integration) return

    setValidationStatus(prev => ({ ...prev, [integrationId]: 'validating' }))

    try {
      const response = await fetch('/api/validate/integration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: integrationId,
          credentials: credentials[integrationId] || {},
        }),
      })

      const result = await response.json()
      
      setValidationStatus(prev => ({
        ...prev,
        [integrationId]: result.valid ? 'valid' : 'invalid',
      }))

      if (onValidation) {
        onValidation(integrationId, result.valid)
      }

      // Show feedback
      if (result.valid) {
        console.log(`✅ ${integration.name} validated successfully`)
      } else {
        console.error(`❌ ${integration.name} validation failed:`, result.message)
      }
    } catch (error) {
      console.error('Validation error:', error)
      setValidationStatus(prev => ({ ...prev, [integrationId]: 'invalid' }))
    }
  }

  const handleFieldChange = (integrationId: string, field: string, value: string) => {
    setCredentials(prev => ({
      ...prev,
      [integrationId]: {
        ...prev[integrationId],
        [field]: value,
      },
    }))
    
    // Reset validation status when credentials change
    if (validationStatus[integrationId] === 'valid' || validationStatus[integrationId] === 'invalid') {
      setValidationStatus(prev => ({ ...prev, [integrationId]: 'pending' }))
    }
  }

  const getFilteredIntegrations = () => {
    if (filter === 'required') {
      return integrations.filter(i => i.required)
    }
    if (filter === 'optional') {
      return integrations.filter(i => !i.required)
    }
    return integrations
  }

  const getCompletionStats = () => {
    const required = integrations.filter(i => i.required)
    const validated = required.filter(i => validationStatus[i.id] === 'valid')
    return {
      required: required.length,
      validated: validated.length,
      percentage: Math.round((validated.length / required.length) * 100),
    }
  }

  const stats = getCompletionStats()

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card className="glass-surface border-green-500/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white">Integration Setup Progress</h3>
              <p className="text-gray-300 mt-1">
                Connect your business tools to unlock powerful features
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-400">{stats.percentage}%</div>
              <div className="text-sm text-gray-400">
                {stats.validated} of {stats.required} required
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="w-full bg-gray-800 rounded-full h-3 mb-4">
            <div
              className="bg-gradient-to-r from-green-600 to-blue-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${stats.percentage}%` }}
            />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl">📊</div>
              <div className="text-xs text-gray-400">Analytics</div>
              <div className="text-sm font-semibold text-white">
                {validationStatus.google_analytics === 'valid' ? '✅' : '⏳'}
              </div>
            </div>
            <div>
              <div className="text-2xl">💳</div>
              <div className="text-xs text-gray-400">Payments</div>
              <div className="text-sm font-semibold text-white">
                {validationStatus.stripe === 'valid' ? '✅' : '⏳'}
              </div>
            </div>
            <div>
              <div className="text-2xl">🗺️</div>
              <div className="text-xs text-gray-400">Maps</div>
              <div className="text-sm font-semibold text-white">
                {validationStatus.google_maps === 'valid' ? '✅' : '⏳'}
              </div>
            </div>
            <div>
              <div className="text-2xl">🔥</div>
              <div className="text-xs text-gray-400">Database</div>
              <div className="text-sm font-semibold text-white">
                {validationStatus.DISABLED_FIREBASE === 'valid' ? '✅' : '⏳'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <Button
          variant={filter === 'required' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setFilter('required')}
        >
          Required ({integrations.filter(i => i.required).length})
        </Button>
        <Button
          variant={filter === 'optional' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setFilter('optional')}
        >
          Optional ({integrations.filter(i => !i.required).length})
        </Button>
        <Button
          variant={filter === 'all' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          All ({integrations.length})
        </Button>
      </div>

      {/* Integration Cards */}
      <div className="grid gap-4">
        {getFilteredIntegrations().map((integration) => {
          const isExpanded = expandedSteps[integration.id]
          const status = validationStatus[integration.id]
          
          return (
            <Card
              key={integration.id}
              className={`transition-all duration-300 ${
                status === 'valid'
                  ? 'border-green-500/50 bg-green-900/10'
                  : status === 'invalid'
                  ? 'border-red-500/50 bg-red-900/10'
                  : 'border-gray-700'
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">{integration.icon}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-white">{integration.name}</h3>
                        {integration.required && (
                          <span className="text-xs bg-yellow-600/20 text-yellow-400 px-2 py-0.5 rounded-full">
                            Required
                          </span>
                        )}
                        {status === 'valid' && (
                          <span className="text-xs bg-green-600/20 text-green-400 px-2 py-0.5 rounded-full">
                            ✅ Connected
                          </span>
                        )}
                      </div>
                      <p className="text-gray-300 text-sm mt-1">{integration.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                        <span>⏱️ {integration.setupTime}</span>
                        <span>💰 Worth {integration.monthlyValue}/mo</span>
                        <span className="text-blue-400">{integration.category}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setExpandedSteps(prev => ({
                      ...prev,
                      [integration.id]: !prev[integration.id],
                    }))}
                  >
                    {isExpanded ? 'Hide' : 'Setup'}
                  </Button>
                </div>
              </CardHeader>
              
              {isExpanded && (
                <CardContent className="space-y-4">
                  {/* Business Impact */}
                  {integration.businessImpact && (
                    <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-4">
                      <h4 className="text-blue-300 font-medium mb-2">💡 Business Impact</h4>
                      <ul className="space-y-1">
                        {integration.businessImpact.map((impact, i) => (
                          <li key={i} className="text-sm text-blue-200 flex items-start gap-2">
                            <span className="text-blue-400 mt-0.5">•</span>
                            <span>{impact}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Setup Steps */}
                  {integration.setupSteps && (
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h4 className="text-gray-300 font-medium mb-3">📋 Setup Steps</h4>
                      <ol className="space-y-2">
                        {integration.setupSteps.map((step, i) => (
                          <li key={i} className="text-sm text-gray-400 flex items-start gap-3">
                            <span className="bg-gray-700 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                              {i + 1}
                            </span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                      {integration.helpUrl && (
                        <a
                          href={integration.helpUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 mt-3 text-blue-400 hover:text-blue-300 text-sm"
                        >
                          <span>Open {integration.name} →</span>
                        </a>
                      )}
                    </div>
                  )}

                  {/* Credential Fields */}
                  <div className="space-y-3">
                    {integration.fields.map((field) => (
                      <div key={field.key}>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          {field.label}
                          {field.required && <span className="text-red-400 ml-1">*</span>}
                        </label>
                        {field.type === 'select' ? (
                          <select
                            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={credentials[integration.id]?.[field.key] || ''}
                            onChange={(e) => handleFieldChange(integration.id, field.key, e.target.value)}
                          >
                            <option value="">Select...</option>
                            {field.options?.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        ) : field.type === 'textarea' ? (
                          <textarea
                            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder={field.placeholder}
                            value={credentials[integration.id]?.[field.key] || ''}
                            onChange={(e) => handleFieldChange(integration.id, field.key, e.target.value)}
                            rows={3}
                          />
                        ) : (
                          <input
                            type={field.type}
                            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder={field.placeholder}
                            value={credentials[integration.id]?.[field.key] || ''}
                            onChange={(e) => handleFieldChange(integration.id, field.key, e.target.value)}
                          />
                        )}
                        {field.helpText && (
                          <p className="text-xs text-gray-400 mt-1">{field.helpText}</p>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Validation Button */}
                  <div className="flex items-center justify-between pt-2">
                    <Button
                      variant="primary"
                      onClick={() => validateIntegration(integration.id)}
                      loading={status === 'validating'}
                      disabled={!integration.fields.filter(f => f.required).every(f => 
                        credentials[integration.id]?.[f.key]
                      )}
                    >
                      {status === 'validating' ? 'Validating...' : 'Test Connection'}
                    </Button>
                    
                    {status === 'valid' && (
                      <span className="text-green-400 text-sm flex items-center gap-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Connection successful!
                      </span>
                    )}
                    
                    {status === 'invalid' && (
                      <span className="text-red-400 text-sm flex items-center gap-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        Connection failed. Check credentials.
                      </span>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>

      {/* Save All Button */}
      <div className="flex justify-end">
        <Button
          variant="primary"
          size="lg"
          onClick={() => onComplete?.(credentials)}
          disabled={stats.validated < stats.required}
        >
          Save All Integrations ({stats.validated}/{stats.required} Complete)
        </Button>
      </div>
    </div>
  )
}