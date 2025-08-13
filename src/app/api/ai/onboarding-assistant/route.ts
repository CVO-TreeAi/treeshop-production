import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

// System prompts for the onboarding assistant
const SYSTEM_PROMPT = `You are TreeAI Setup Assistant, an expert business consultant helping tree service companies set up their digital presence. You have deep knowledge of:

1. Tree service business operations (forestry mulching, land clearing, tree removal)
2. Digital marketing for local service businesses
3. API integrations (Google, Stripe, Firebase, etc.)
4. SEO and lead generation strategies
5. Florida's tree service market and regulations

Your personality:
- Professional yet friendly
- Patient with non-technical users
- Proactive in identifying potential issues
- Solution-oriented
- Encouraging and supportive

When helping with API setup:
- Explain WHY each integration matters for their business
- Provide step-by-step guidance
- Offer troubleshooting tips
- Suggest best practices
- Validate configurations when possible

Always focus on business outcomes, not just technical setup.`

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface OnboardingContext {
  currentStep?: string
  completedSteps?: string[]
  businessInfo?: Record<string, any>
  integrationStatus?: Record<string, boolean>
}

export async function POST(request: NextRequest) {
  try {
    const { messages, context, action } = await request.json()

    if (!process.env.OPENAI_API_KEY) {
      // Fallback to a simple rule-based assistant if no API key
      return NextResponse.json({
        message: getFallbackResponse(action, context),
        suggestions: getFallbackSuggestions(action, context),
      })
    }

    // Build context-aware messages
    const contextMessage = buildContextMessage(context)
    const systemMessages: Message[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'system', content: contextMessage },
    ]

    // Add conversation history
    const allMessages = [...systemMessages, ...messages]

    // Get AI response
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: allMessages,
      temperature: 0.7,
      max_tokens: 1000,
    })

    const aiResponse = completion.choices[0]?.message?.content || ''

    // Generate contextual suggestions
    const suggestions = await generateSuggestions(action, context)

    return NextResponse.json({
      message: aiResponse,
      suggestions,
      usage: completion.usage,
    })
  } catch (error) {
    console.error('AI Assistant error:', error)
    
    // Fallback response on error
    return NextResponse.json({
      message: "I'm here to help you set up your TreeAI website! What would you like assistance with?",
      suggestions: [
        "Help me understand what each API does",
        "Guide me through getting Google Analytics",
        "Why do I need Stripe integration?",
        "What's the quickest way to get started?",
      ],
      error: true,
    })
  }
}

function buildContextMessage(context: OnboardingContext): string {
  const parts = [`Current onboarding context:`]
  
  if (context.currentStep) {
    parts.push(`- User is on step: ${context.currentStep}`)
  }
  
  if (context.completedSteps?.length) {
    parts.push(`- Completed steps: ${context.completedSteps.join(', ')}`)
  }
  
  if (context.businessInfo) {
    parts.push(`- Business: ${context.businessInfo.companyName || 'Not specified'}`)
    parts.push(`- Location: ${context.businessInfo.businessAddress || 'Not specified'}`)
    parts.push(`- Service radius: ${context.businessInfo.serviceRadius || 'Not specified'} miles`)
  }
  
  if (context.integrationStatus) {
    const connected = Object.entries(context.integrationStatus)
      .filter(([_, status]) => status)
      .map(([name]) => name)
    const pending = Object.entries(context.integrationStatus)
      .filter(([_, status]) => !status)
      .map(([name]) => name)
    
    if (connected.length) {
      parts.push(`- Connected integrations: ${connected.join(', ')}`)
    }
    if (pending.length) {
      parts.push(`- Pending integrations: ${pending.join(', ')}`)
    }
  }
  
  return parts.join('\n')
}

async function generateSuggestions(action: string, context: OnboardingContext): Promise<string[]> {
  const suggestions: string[] = []
  
  switch (context.currentStep) {
    case 'integration-setup':
      suggestions.push(
        "How do I get a Google Analytics ID?",
        "What's the difference between GA4 and GTM?",
        "Help me set up Stripe payments",
        "Why do I need Google Maps API?",
      )
      break
    case 'business-profile':
      suggestions.push(
        "What service radius should I choose?",
        "How important is the business description?",
        "Should I include my license number?",
        "What contact info is shown publicly?",
      )
      break
    case 'service-configuration':
      suggestions.push(
        "What services generate the most leads?",
        "How should I price my services?",
        "What equipment should I highlight?",
        "Which areas should I target?",
      )
      break
    default:
      suggestions.push(
        "What should I set up first?",
        "How long will the full setup take?",
        "Can you explain the lead generation system?",
        "What integrations are most important?",
      )
  }
  
  return suggestions
}

function getFallbackResponse(action: string, context: OnboardingContext): string {
  const responses: Record<string, string> = {
    greeting: `Welcome to TreeAI Setup Assistant! I'll help you get your tree service website fully operational. Let's start by setting up your business profile - this creates your professional online presence and ensures accurate client communications.`,
    
    help_ga4: `Google Analytics 4 (GA4) helps you understand your website visitors. To get your GA4 ID:
1. Go to analytics.google.com
2. Create a new property for your website
3. Find your Measurement ID (starts with G-)
4. This tracks visitor behavior, lead sources, and conversion rates`,
    
    help_stripe: `Stripe enables secure payment processing for deposits and full payments. To set up:
1. Create account at stripe.com
2. Complete business verification
3. Get your publishable and secret keys from the Dashboard
4. This allows instant proposal deposits and payment collection`,
    
    help_maps: `Google Maps API powers your service area display and location-based features:
1. Go to console.cloud.google.com
2. Create a new project
3. Enable Maps JavaScript API and Places API
4. Create an API key with restrictions
5. This shows clients your coverage areas and enables address autocomplete`,
    
    default: `I'm here to help you set up your TreeAI website! Each integration we configure will help grow your tree service business. What would you like to know more about?`,
  }
  
  return responses[action] || responses.default
}

function getFallbackSuggestions(action: string, context: OnboardingContext): string[] {
  return [
    "Tell me about Google Analytics setup",
    "Help with Stripe configuration",
    "Explain the lead scoring system",
    "What should I configure first?",
  ]
}