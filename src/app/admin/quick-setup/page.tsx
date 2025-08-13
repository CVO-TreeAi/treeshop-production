'use client'

import { useState, useCallback, useEffect } from 'react'
// Using CSS transitions instead of framer-motion for better compatibility
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/Card'
import AIAssistantChat from '@/components/onboarding/AIAssistantChat'
import IntegrationSetupWizard from '@/components/onboarding/IntegrationSetupWizard'
import OnboardingChecklist from '@/components/onboarding/OnboardingChecklist'

// Enum for onboarding steps
enum OnboardingStep {
  BusinessProfile = 'business-profile',
  ServiceConfiguration = 'service-configuration',
  AdminTraining = 'admin-training',
  IntegrationSetup = 'integration-setup',
  ContentCustomization = 'content-customization',
  WorkflowConfiguration = 'workflow-configuration',
  GoLiveChecklist = 'go-live-checklist'
}

interface OnboardingStepConfig {
  id: OnboardingStep
  title: string
  shortTitle: string
  description: string
  businessValue: string
  icon: string
  requiredFields?: string[]
  estimatedTime?: string
  tutorialContent?: string[]
}

interface FormData {
  // Business Profile
  companyName?: string
  contactName?: string
  contactEmail?: string
  contactPhone?: string
  businessAddress?: string
  serviceRadius?: string
  businessDescription?: string
  yearsInBusiness?: string
  teamSize?: string
  licenseNumber?: string
  insuranceCertified?: boolean

  // Service Configuration
  primaryServices?: string[]
  equipmentTypes?: string[]
  priceRanges?: Record<string, { min: number; max: number }>
  emergencyServices?: boolean
  weekendAvailability?: boolean
  seasonalServices?: string[]
  coverageAreas?: string[]

  // Admin Training
  completedTutorials?: string[]
  preferredLearningStyle?: string
  trainingGoals?: string[]

  // Integration Setup
  googleBusinessConnected?: boolean
  paymentProcessorSetup?: boolean
  calendarIntegration?: boolean
  analyticsEnabled?: boolean
  reviewManagementSetup?: boolean

  // Content Customization
  brandColors?: { primary: string; secondary: string }
  logoUploaded?: boolean
  heroMessage?: string
  valuePropositions?: string[]
  testimonials?: Array<{ name: string; content: string; rating: number }>
  galleryImages?: string[]

  // Workflow Configuration
  leadScoringEnabled?: boolean
  autoResponseTemplates?: Record<string, string>
  proposalTemplates?: string[]
  followUpSchedule?: Record<string, number>
  estimateFormula?: Record<string, number>

  // Go-Live Checklist
  contentReviewed?: boolean
  testLeadSubmitted?: boolean
  paymentTested?: boolean
  mobileOptimized?: boolean
  seoOptimized?: boolean
  backupConfigured?: boolean
  domainConfigured?: boolean
  analyticsVerified?: boolean
  launchReady?: boolean
}

export default function BusinessOnboardingPage() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(OnboardingStep.BusinessProfile)
  const [completedSteps, setCompletedSteps] = useState<OnboardingStep[]>([])
  const [formData, setFormData] = useState<FormData>({})
  const [loading, setLoading] = useState(false)
  const [showTutorial, setShowTutorial] = useState(false)
  const [currentTutorialStep, setCurrentTutorialStep] = useState(0)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [savedProgress, setSavedProgress] = useState(false)
  const [showAIAssistant, setShowAIAssistant] = useState(true)
  const [integrationValidation, setIntegrationValidation] = useState<Record<string, boolean>>({})

  const onboardingSteps: OnboardingStepConfig[] = [
    {
      id: OnboardingStep.BusinessProfile,
      title: 'Business Profile Setup',
      shortTitle: 'Profile',
      description: 'Establish your company identity and basic business information',
      businessValue: 'Creates your professional online presence and ensures accurate client communications',
      icon: '🏢',
      requiredFields: ['companyName', 'contactName', 'contactEmail', 'contactPhone', 'businessAddress'],
      estimatedTime: '10 minutes',
      tutorialContent: [
        'Your business profile is the foundation of your TreeAI ProWebsite',
        'This information appears on your website, proposals, and client communications',
        'Complete, professional information builds trust with potential clients',
        'Your service radius helps us show your coverage area to visitors'
      ]
    },
    {
      id: OnboardingStep.ServiceConfiguration,
      title: 'Service Configuration',
      shortTitle: 'Services',
      description: 'Define your forestry services, equipment, and pricing structure',
      businessValue: 'Enables accurate estimates and helps clients understand your capabilities',
      icon: '🌲',
      requiredFields: ['primaryServices', 'equipmentTypes', 'coverageAreas'],
      estimatedTime: '15 minutes',
      tutorialContent: [
        'Service configuration powers your AI estimation system',
        'Choose services that match your equipment and expertise',
        'Pricing ranges help generate accurate estimates for clients',
        'Coverage areas ensure you only receive relevant leads'
      ]
    },
    {
      id: OnboardingStep.AdminTraining,
      title: 'Admin Platform Training',
      shortTitle: 'Training',
      description: 'Learn to use your admin dashboard effectively',
      businessValue: 'Maximizes your return on investment and operational efficiency',
      icon: '🎓',
      requiredFields: ['completedTutorials'],
      estimatedTime: '20 minutes',
      tutorialContent: [
        'Master the lead management system to convert more prospects',
        'Learn proposal generation to close deals faster',
        'Understand analytics to optimize your marketing',
        'Discover automation features to save time'
      ]
    },
    {
      id: OnboardingStep.IntegrationSetup,
      title: 'System Integrations',
      shortTitle: 'Integrations',
      description: 'Connect Google services, payments, and business tools',
      businessValue: 'Streamlines operations and provides comprehensive business insights',
      icon: '🔗',
      requiredFields: ['googleBusinessConnected', 'paymentProcessorSetup'],
      estimatedTime: '25 minutes',
      tutorialContent: [
        'Google Business Profile integration manages your online reputation',
        'Payment processing enables instant deposits and proposals',
        'Calendar integration prevents double-booking',
        'Analytics provide insights into your website performance'
      ]
    },
    {
      id: OnboardingStep.ContentCustomization,
      title: 'Website Content Personalization',
      shortTitle: 'Content',
      description: 'Customize your website with your brand, story, and media',
      businessValue: 'Differentiates your business and builds emotional connections with clients',
      icon: '✨',
      requiredFields: ['heroMessage', 'valuePropositions', 'brandColors'],
      estimatedTime: '30 minutes',
      tutorialContent: [
        'Your hero message is the first thing visitors see - make it compelling',
        'Value propositions explain why clients should choose you',
        'Professional photos showcase your work quality',
        'Testimonials build trust and credibility'
      ]
    },
    {
      id: OnboardingStep.WorkflowConfiguration,
      title: 'Lead Management Workflow',
      shortTitle: 'Workflow',
      description: 'Configure automated lead processing and client communications',
      businessValue: 'Maximizes conversion rates and ensures no leads are lost',
      icon: '⚙️',
      requiredFields: ['leadScoringEnabled', 'autoResponseTemplates'],
      estimatedTime: '20 minutes',
      tutorialContent: [
        'Lead scoring helps you prioritize high-value opportunities',
        'Auto-responses ensure immediate client engagement',
        'Proposal templates speed up your sales process',
        'Follow-up schedules maintain client relationships'
      ]
    },
    {
      id: OnboardingStep.GoLiveChecklist,
      title: 'Go-Live Readiness Checklist',
      shortTitle: 'Launch',
      description: 'Final validation and launch preparation',
      businessValue: 'Ensures a smooth launch and professional first impression',
      icon: '🚀',
      requiredFields: ['contentReviewed', 'testLeadSubmitted', 'mobileOptimized'],
      estimatedTime: '15 minutes',
      tutorialContent: [
        'Review all content for accuracy and professionalism',
        'Test the lead capture system to ensure it works properly',
        'Verify mobile optimization for all devices',
        'Confirm SEO settings are properly configured'
      ]
    }
  ]

  // Load saved progress on component mount
  useEffect(() => {
    const saved = localStorage.getItem('treeai-onboarding-progress')
    if (saved) {
      try {
        const { formData: savedFormData, completedSteps: savedCompleted, currentStep: savedStep } = JSON.parse(saved)
        setFormData(savedFormData || {})
        setCompletedSteps(savedCompleted || [])
        if (savedStep && Object.values(OnboardingStep).includes(savedStep)) {
          setCurrentStep(savedStep)
        }
      } catch (error) {
        console.error('Failed to load saved progress:', error)
      }
    }
  }, [])

  // Auto-save progress
  useEffect(() => {
    const saveProgress = () => {
      const progressData = {
        formData,
        completedSteps,
        currentStep,
        lastSaved: new Date().toISOString()
      }
      localStorage.setItem('treeai-onboarding-progress', JSON.stringify(progressData))
      setSavedProgress(true)
      setTimeout(() => setSavedProgress(false), 2000)
    }

    const timeoutId = setTimeout(saveProgress, 1000)
    return () => clearTimeout(timeoutId)
  }, [formData, completedSteps, currentStep])

  const isStepComplete = (step: OnboardingStep) => {
    const stepConfig = onboardingSteps.find(s => s.id === step)
    if (!stepConfig?.requiredFields) return true
    
    return stepConfig.requiredFields.every(field => {
      const value = formData[field as keyof FormData]
      if (Array.isArray(value)) {
        return value.length > 0
      }
      if (typeof value === 'boolean') {
        return value === true
      }
      return value !== undefined && value !== '' && value !== null
    })
  }

  const getStepCompletionPercentage = (step: OnboardingStep) => {
    const stepConfig = onboardingSteps.find(s => s.id === step)
    if (!stepConfig?.requiredFields) return 100
    
    const completedFields = stepConfig.requiredFields.filter(field => {
      const value = formData[field as keyof FormData]
      if (Array.isArray(value)) return value.length > 0
      if (typeof value === 'boolean') return value === true
      return value !== undefined && value !== '' && value !== null
    })
    
    return Math.round((completedFields.length / stepConfig.requiredFields.length) * 100)
  }

  const validateStep = (step: OnboardingStep): Record<string, string> => {
    const stepErrors: Record<string, string> = {}
    const stepConfig = onboardingSteps.find(s => s.id === step)
    
    if (!stepConfig?.requiredFields) return stepErrors
    
    stepConfig.requiredFields.forEach(field => {
      const value = formData[field as keyof FormData]
      
      switch (field) {
        case 'contactEmail':
          if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value as string)) {
            stepErrors[field] = 'Please enter a valid email address'
          }
          break
        case 'contactPhone':
          if (!value || !/^[\d\s()+-]+$/.test(value as string)) {
            stepErrors[field] = 'Please enter a valid phone number'
          }
          break
        case 'serviceRadius':
          if (!value || isNaN(Number(value)) || Number(value) < 1) {
            stepErrors[field] = 'Please enter a valid service radius in miles'
          }
          break
        default:
          if (Array.isArray(value)) {
            if (value.length === 0) stepErrors[field] = 'Please select at least one option'
          } else if (typeof value === 'boolean') {
            if (!value) stepErrors[field] = 'This option must be enabled'
          } else {
            if (!value || value === '') stepErrors[field] = 'This field is required'
          }
      }
    })
    
    return stepErrors
  }

  const handleNextStep = useCallback(() => {
    const stepErrors = validateStep(currentStep)
    setErrors(stepErrors)
    
    if (Object.keys(stepErrors).length > 0) {
      return
    }
    
    const currentStepIndex = onboardingSteps.findIndex(step => step.id === currentStep)
    setCompletedSteps(prev => [...new Set([...prev, currentStep])])
    
    if (currentStepIndex < onboardingSteps.length - 1) {
      setCurrentStep(onboardingSteps[currentStepIndex + 1].id)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      // Final step completed
      handleCompleteOnboarding()
    }
  }, [currentStep, formData])

  const handlePreviousStep = useCallback(() => {
    const currentStepIndex = onboardingSteps.findIndex(step => step.id === currentStep)
    if (currentStepIndex > 0) {
      setCurrentStep(onboardingSteps[currentStepIndex - 1].id)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [currentStep])

  const handleCompleteOnboarding = async () => {
    setLoading(true)
    try {
      // Here you would save the final configuration to your backend
      console.log('Saving onboarding data:', formData)
      
      // Clear saved progress
      localStorage.removeItem('treeai-onboarding-progress')
      
      // Redirect to admin dashboard or show success message
      window.location.href = '/admin'
    } catch (error) {
      console.error('Failed to complete onboarding:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleStepClick = (step: OnboardingStep) => {
    const stepIndex = onboardingSteps.findIndex(s => s.id === step)
    const currentIndex = onboardingSteps.findIndex(s => s.id === currentStep)
    
    // Allow navigation to previous steps or the next immediate step
    if (stepIndex <= currentIndex || completedSteps.includes(onboardingSteps[stepIndex - 1]?.id)) {
      setCurrentStep(step)
    }
  }

  const renderBusinessProfileStep = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Company Name *
          </label>
          <input
            type="text"
            className={`w-full p-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 ${
              errors.companyName ? 'border-red-500' : 'border-gray-700'
            }`}
            placeholder="Florida Tree Services LLC"
            value={formData.companyName || ''}
            onChange={(e) => updateFormData('companyName', e.target.value)}
          />
          {errors.companyName && <p className="text-red-400 text-sm mt-1">{errors.companyName}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Contact Name *
          </label>
          <input
            type="text"
            className={`w-full p-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 ${
              errors.contactName ? 'border-red-500' : 'border-gray-700'
            }`}
            placeholder="John Smith"
            value={formData.contactName || ''}
            onChange={(e) => updateFormData('contactName', e.target.value)}
          />
          {errors.contactName && <p className="text-red-400 text-sm mt-1">{errors.contactName}</p>}
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Contact Email *
          </label>
          <input
            type="email"
            className={`w-full p-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 ${
              errors.contactEmail ? 'border-red-500' : 'border-gray-700'
            }`}
            placeholder="john@floridatreeservices.com"
            value={formData.contactEmail || ''}
            onChange={(e) => updateFormData('contactEmail', e.target.value)}
          />
          {errors.contactEmail && <p className="text-red-400 text-sm mt-1">{errors.contactEmail}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Contact Phone *
          </label>
          <input
            type="tel"
            className={`w-full p-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 ${
              errors.contactPhone ? 'border-red-500' : 'border-gray-700'
            }`}
            placeholder="(555) 123-4567"
            value={formData.contactPhone || ''}
            onChange={(e) => updateFormData('contactPhone', e.target.value)}
          />
          {errors.contactPhone && <p className="text-red-400 text-sm mt-1">{errors.contactPhone}</p>}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Business Address *
        </label>
        <input
          type="text"
          className={`w-full p-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 ${
            errors.businessAddress ? 'border-red-500' : 'border-gray-700'
          }`}
          placeholder="123 Oak Street, Tampa, FL 33601"
          value={formData.businessAddress || ''}
          onChange={(e) => updateFormData('businessAddress', e.target.value)}
        />
        {errors.businessAddress && <p className="text-red-400 text-sm mt-1">{errors.businessAddress}</p>}
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Service Radius (miles)
          </label>
          <input
            type="number"
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="50"
            value={formData.serviceRadius || ''}
            onChange={(e) => updateFormData('serviceRadius', e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Years in Business
          </label>
          <input
            type="number"
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="10"
            value={formData.yearsInBusiness || ''}
            onChange={(e) => updateFormData('yearsInBusiness', e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Team Size
          </label>
          <input
            type="number"
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="5"
            value={formData.teamSize || ''}
            onChange={(e) => updateFormData('teamSize', e.target.value)}
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Business Description
        </label>
        <textarea
          rows={4}
          className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Describe your business, specialties, and what makes you unique..."
          value={formData.businessDescription || ''}
          onChange={(e) => updateFormData('businessDescription', e.target.value)}
        />
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            License Number
          </label>
          <input
            type="text"
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="FL-TREE-2024-001"
            value={formData.licenseNumber || ''}
            onChange={(e) => updateFormData('licenseNumber', e.target.value)}
          />
        </div>
        
        <div className="flex items-center mt-8">
          <input
            type="checkbox"
            id="insuranceCertified"
            className="w-5 h-5 text-green-600 bg-gray-800 border-gray-700 rounded focus:ring-green-500 focus:ring-2"
            checked={formData.insuranceCertified || false}
            onChange={(e) => updateFormData('insuranceCertified', e.target.checked)}
          />
          <label htmlFor="insuranceCertified" className="ml-3 text-sm text-gray-300">
            Fully Insured & Bonded
          </label>
        </div>
      </div>
    </div>
  )

  const renderServiceConfigurationStep = () => (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">Primary Services</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            'Forestry Mulching',
            'Land Clearing',
            'Tree Removal',
            'Stump Grinding',
            'Emergency Services',
            'Storm Cleanup',
            'Brush Clearing',
            'Fire Break Creation',
            'ROW Clearing',
          ].map((service) => (
            <label key={service} className="flex items-center gap-2 p-3 bg-gray-800 border border-gray-700 rounded-lg hover:border-green-500 cursor-pointer transition-colors">
              <input
                type="checkbox"
                className="w-4 h-4 text-green-600 bg-gray-800 border-gray-600 rounded focus:ring-green-500"
                checked={formData.primaryServices?.includes(service) || false}
                onChange={(e) => {
                  const services = formData.primaryServices || []
                  if (e.target.checked) {
                    updateFormData('primaryServices', [...services, service])
                  } else {
                    updateFormData('primaryServices', services.filter(s => s !== service))
                  }
                }}
              />
              <span className="text-sm text-gray-300">{service}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">Equipment Types</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            'Forestry Mulcher',
            'Excavator',
            'Skid Steer',
            'Bulldozer',
            'Dump Truck',
            'Chipper',
            'Grapple Truck',
            'Boom Truck',
          ].map((equipment) => (
            <label key={equipment} className="flex items-center gap-2 p-3 bg-gray-800 border border-gray-700 rounded-lg hover:border-green-500 cursor-pointer transition-colors">
              <input
                type="checkbox"
                className="w-4 h-4 text-green-600 bg-gray-800 border-gray-600 rounded focus:ring-green-500"
                checked={formData.equipmentTypes?.includes(equipment) || false}
                onChange={(e) => {
                  const types = formData.equipmentTypes || []
                  if (e.target.checked) {
                    updateFormData('equipmentTypes', [...types, equipment])
                  } else {
                    updateFormData('equipmentTypes', types.filter(t => t !== equipment))
                  }
                }}
              />
              <span className="text-sm text-gray-300">{equipment}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">Service Coverage Areas</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            'Tampa',
            'St. Petersburg',
            'Clearwater',
            'Brandon',
            'Lakeland',
            'Sarasota',
            'Fort Myers',
            'Orlando',
            'Ocala',
          ].map((area) => (
            <label key={area} className="flex items-center gap-2 p-3 bg-gray-800 border border-gray-700 rounded-lg hover:border-green-500 cursor-pointer transition-colors">
              <input
                type="checkbox"
                className="w-4 h-4 text-green-600 bg-gray-800 border-gray-600 rounded focus:ring-green-500"
                checked={formData.coverageAreas?.includes(area) || false}
                onChange={(e) => {
                  const areas = formData.coverageAreas || []
                  if (e.target.checked) {
                    updateFormData('coverageAreas', [...areas, area])
                  } else {
                    updateFormData('coverageAreas', areas.filter(a => a !== area))
                  }
                }}
              />
              <span className="text-sm text-gray-300">{area}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )

  const renderIntegrationSetupStep = () => (
    <div>
      <IntegrationSetupWizard
        onComplete={(data) => {
          console.log('Integration data:', data)
          updateFormData('integrations', data)
        }}
        onValidation={(integration, valid) => {
          setIntegrationValidation(prev => ({
            ...prev,
            [integration]: valid,
          }))
        }}
      />
    </div>
  )

  const renderGoLiveChecklistStep = () => (
    <div>
      <OnboardingChecklist
        onItemComplete={(itemId) => {
          console.log('Checklist item completed:', itemId)
        }}
        onAllComplete={() => {
          console.log('All required items complete!')
        }}
      />
    </div>
  )

  const renderStepContent = () => {
    switch (currentStep) {
      case OnboardingStep.BusinessProfile:
        return renderBusinessProfileStep()
      case OnboardingStep.ServiceConfiguration:
        return renderServiceConfigurationStep()
      case OnboardingStep.IntegrationSetup:
        return renderIntegrationSetupStep()
      case OnboardingStep.GoLiveChecklist:
        return renderGoLiveChecklistStep()
      // Other steps will be implemented in the next iteration
      default:
        return (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">{onboardingSteps.find(s => s.id === currentStep)?.icon}</div>
            <h3 className="text-2xl font-bold text-white mb-4">
              {onboardingSteps.find(s => s.id === currentStep)?.title}
            </h3>
            <p className="text-gray-300 mb-8">
              This step is coming soon. We're building an amazing experience for you!
            </p>
            <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4">
              <p className="text-yellow-300 text-sm">
                🚧 Under Construction - Skip to next step for now
              </p>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      
      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Business Onboarding
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-6">
            Transform your tree service into a lead-generating machine with our comprehensive setup guide
          </p>
          
          {/* Auto-save indicator */}
          {savedProgress && (
            <div className="inline-flex items-center gap-2 text-green-400 text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Progress saved automatically
            </div>
          )}
        </div>

        {/* Progress Tracker */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-300">Setup Progress</h2>
            <div className="text-sm text-gray-400">
              {completedSteps.length} of {onboardingSteps.length} steps completed
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 md:gap-3">
            {onboardingSteps.map((step, index) => {
              const isActive = currentStep === step.id
              const isCompleted = completedSteps.includes(step.id)
              const isAccessible = index === 0 || completedSteps.includes(onboardingSteps[index - 1]?.id)
              const completionPercentage = getStepCompletionPercentage(step.id)
              
              return (
                <div
                  key={step.id}
                  className={`group relative cursor-pointer ${
                    !isAccessible && !isCompleted ? 'cursor-not-allowed opacity-50' : ''
                  }`}
                  onClick={() => isAccessible && handleStepClick(step.id)}
                >
                  <Card
                    className={`p-3 text-center transition-all duration-300 ${
                      isActive
                        ? 'border-green-500 bg-green-600/10 scale-105'
                        : isCompleted
                        ? 'border-green-700 bg-green-900/20'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <div className="text-2xl mb-2">{step.icon}</div>
                    <div className={`text-xs font-medium mb-1 ${
                      isActive ? 'text-green-400' : isCompleted ? 'text-green-300' : 'text-gray-400'
                    }`}>
                      {step.shortTitle}
                    </div>
                    
                    {/* Progress bar */}
                    <div className="w-full bg-gray-800 rounded-full h-1.5 mb-1">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-500 ${
                          isCompleted ? 'bg-green-500' : isActive ? 'bg-green-400' : 'bg-gray-600'
                        }`}
                        style={{ width: `${completionPercentage}%` }}
                      />
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      {completionPercentage}%
                    </div>
                  </Card>
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                    <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap border border-gray-700 shadow-lg">
                      <div className="font-medium">{step.title}</div>
                      <div className="text-gray-400 mt-1">{step.estimatedTime}</div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Current Step Info */}
        <div className="mb-8">
          <Card className="glass-surface border-white/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">
                    {onboardingSteps.find(s => s.id === currentStep)?.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {onboardingSteps.find(s => s.id === currentStep)?.title}
                    </h2>
                    <p className="text-gray-300">
                      {onboardingSteps.find(s => s.id === currentStep)?.description}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400 mb-1">Estimated Time</div>
                  <div className="text-lg font-semibold text-green-400">
                    {onboardingSteps.find(s => s.id === currentStep)?.estimatedTime}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-4">
                <h3 className="text-blue-300 font-medium mb-2">✨ Business Value</h3>
                <p className="text-blue-200 text-sm">
                  {onboardingSteps.find(s => s.id === currentStep)?.businessValue}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Step Content */}
        <div className="transition-all duration-300 ease-in-out">
          <Card className="mb-8">
            <CardContent className="p-8">
              {renderStepContent()}
            </CardContent>
          </Card>
        </div>

        {/* Tutorial Sidebar */}
        {showTutorial && onboardingSteps.find(s => s.id === currentStep)?.tutorialContent && (
          <Card className="mb-8 glass-surface border-purple-500/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-purple-300">🎓 Quick Tips</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTutorial(false)}
                >
                  Hide Tips
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {onboardingSteps.find(s => s.id === currentStep)?.tutorialContent?.map((tip, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-gray-300 text-sm">{tip}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {currentStep !== OnboardingStep.BusinessProfile && (
              <Button variant="secondary" onClick={handlePreviousStep}>
                ← Previous Step
              </Button>
            )}
            
            {!showTutorial && onboardingSteps.find(s => s.id === currentStep)?.tutorialContent && (
              <Button variant="outline" onClick={() => setShowTutorial(true)}>
                🎓 Show Tips
              </Button>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-400">
              Step {onboardingSteps.findIndex(s => s.id === currentStep) + 1} of {onboardingSteps.length}
            </div>
            
            <Button
              variant="primary"
              onClick={handleNextStep}
              loading={loading}
              size="lg"
            >
              {currentStep === OnboardingStep.GoLiveChecklist ? (
                loading ? 'Launching...' : '🚀 Launch Your Website'
              ) : (
                'Continue →'
              )}
            </Button>
          </div>
        </div>
      </main>

      {/* AI Assistant Chat */}
      {showAIAssistant && (
        <AIAssistantChat
          context={{
            currentStep,
            completedSteps,
            businessInfo: formData,
            integrationStatus: integrationValidation,
          }}
          onSuggestionClick={(suggestion) => {
            // Handle AI suggestion clicks
            console.log('AI suggestion clicked:', suggestion)
          }}
        />
      )}

      <Footer />
    </div>
  )
}