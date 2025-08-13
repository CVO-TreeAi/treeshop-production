import { NextRequest, NextResponse } from 'next/server'

interface ValidationResult {
  valid: boolean
  message: string
  details?: any
}

export async function POST(request: NextRequest) {
  try {
    const { type, credentials } = await request.json()

    let result: ValidationResult

    switch (type) {
      case 'google_analytics':
        result = await validateGoogleAnalytics(credentials)
        break
      case 'google_maps':
        result = await validateGoogleMaps(credentials)
        break
      case 'stripe':
        result = await validateStripe(credentials)
        break
      case 'firebase':
        result = await validateFirebase(credentials)
        break
      case 'google_ads':
        result = await validateGoogleAds(credentials)
        break
      case 'openai':
        result = await validateOpenAI(credentials)
        break
      default:
        result = {
          valid: false,
          message: `Unknown integration type: ${type}`,
        }
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Validation error:', error)
    return NextResponse.json({
      valid: false,
      message: 'Validation failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}

async function validateGoogleAnalytics(credentials: any): Promise<ValidationResult> {
  const { measurementId, apiSecret } = credentials
  
  if (!measurementId || !measurementId.startsWith('G-')) {
    return {
      valid: false,
      message: 'Invalid GA4 Measurement ID. It should start with "G-"',
    }
  }

  // Test the Measurement Protocol API if apiSecret is provided
  if (apiSecret) {
    try {
      const response = await fetch(
        `https://www.google-analytics.com/debug/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`,
        {
          method: 'POST',
          body: JSON.stringify({
            client_id: 'test.validation',
            events: [{
              name: 'page_view',
              params: {
                page_location: 'https://treeai.us/validate',
                page_title: 'API Validation Test',
              },
            }],
          }),
        }
      )

      const data = await response.json()
      
      if (data.validationMessages?.length > 0) {
        return {
          valid: false,
          message: 'GA4 credentials validation failed',
          details: data.validationMessages,
        }
      }
    } catch (error) {
      // API might not be accessible, consider it valid if format is correct
    }
  }

  return {
    valid: true,
    message: 'Google Analytics configuration appears valid',
  }
}

async function validateGoogleMaps(credentials: any): Promise<ValidationResult> {
  const { apiKey } = credentials
  
  if (!apiKey) {
    return {
      valid: false,
      message: 'Google Maps API key is required',
    }
  }

  try {
    // Test geocoding API
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=Tampa,FL&key=${apiKey}`
    )
    
    const data = await response.json()
    
    if (data.error_message) {
      return {
        valid: false,
        message: data.error_message,
      }
    }
    
    if (data.status === 'OK') {
      return {
        valid: true,
        message: 'Google Maps API key is valid and working',
      }
    }
    
    return {
      valid: false,
      message: `Google Maps API returned status: ${data.status}`,
    }
  } catch (error) {
    return {
      valid: false,
      message: 'Failed to validate Google Maps API key',
      details: error,
    }
  }
}

async function validateStripe(credentials: any): Promise<ValidationResult> {
  const { publishableKey, secretKey } = credentials
  
  if (!publishableKey || !publishableKey.startsWith('pk_')) {
    return {
      valid: false,
      message: 'Invalid Stripe publishable key format',
    }
  }
  
  if (!secretKey || !secretKey.startsWith('sk_')) {
    return {
      valid: false,
      message: 'Invalid Stripe secret key format',
    }
  }

  // Check if keys are for the same mode (test/live)
  const isTestMode = publishableKey.startsWith('pk_test_') && secretKey.startsWith('sk_test_')
  const isLiveMode = publishableKey.startsWith('pk_live_') && secretKey.startsWith('sk_live_')
  
  if (!isTestMode && !isLiveMode) {
    return {
      valid: false,
      message: 'Stripe keys must both be either test or live mode',
    }
  }

  try {
    // Test the secret key by making a simple API call
    const response = await fetch('https://api.stripe.com/v1/balance', {
      headers: {
        'Authorization': `Bearer ${secretKey}`,
      },
    })
    
    if (response.ok) {
      const mode = isTestMode ? 'test' : 'live'
      return {
        valid: true,
        message: `Stripe ${mode} mode keys are valid and working`,
      }
    }
    
    if (response.status === 401) {
      return {
        valid: false,
        message: 'Invalid Stripe secret key',
      }
    }
    
    return {
      valid: false,
      message: `Stripe API returned status: ${response.status}`,
    }
  } catch (error) {
    return {
      valid: false,
      message: 'Failed to validate Stripe keys',
      details: error,
    }
  }
}

async function validateFirebase(credentials: any): Promise<ValidationResult> {
  const { projectId, apiKey, authDomain } = credentials
  
  if (!projectId || !apiKey || !authDomain) {
    return {
      valid: false,
      message: 'Firebase project ID, API key, and auth domain are required',
    }
  }

  // Basic format validation
  if (!authDomain.includes('.firebaseapp.com')) {
    return {
      valid: false,
      message: 'Invalid Firebase auth domain format',
    }
  }

  try {
    // Test Firebase Auth REST API
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          returnSecureToken: true,
        }),
      }
    )
    
    const data = await response.json()
    
    // If we get MISSING_EMAIL error, the API key is valid
    if (data.error?.message === 'MISSING_EMAIL') {
      return {
        valid: true,
        message: 'Firebase configuration is valid',
      }
    }
    
    if (data.error?.message === 'API_KEY_INVALID') {
      return {
        valid: false,
        message: 'Invalid Firebase API key',
      }
    }
    
    return {
      valid: true,
      message: 'Firebase configuration appears valid',
    }
  } catch (error) {
    return {
      valid: false,
      message: 'Failed to validate Firebase configuration',
      details: error,
    }
  }
}

async function validateGoogleAds(credentials: any): Promise<ValidationResult> {
  const { developerToken, customerId } = credentials
  
  if (!developerToken) {
    return {
      valid: false,
      message: 'Google Ads developer token is required',
    }
  }
  
  if (!customerId || !/^\d{10}$/.test(customerId.replace(/-/g, ''))) {
    return {
      valid: false,
      message: 'Invalid Google Ads customer ID format (should be 10 digits)',
    }
  }

  // Note: Full validation would require OAuth tokens
  return {
    valid: true,
    message: 'Google Ads credentials format is valid (full validation requires OAuth)',
  }
}

async function validateOpenAI(credentials: any): Promise<ValidationResult> {
  const { apiKey } = credentials
  
  if (!apiKey || !apiKey.startsWith('sk-')) {
    return {
      valid: false,
      message: 'Invalid OpenAI API key format',
    }
  }

  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    })
    
    if (response.ok) {
      return {
        valid: true,
        message: 'OpenAI API key is valid and working',
      }
    }
    
    if (response.status === 401) {
      return {
        valid: false,
        message: 'Invalid OpenAI API key',
      }
    }
    
    return {
      valid: false,
      message: `OpenAI API returned status: ${response.status}`,
    }
  } catch (error) {
    return {
      valid: false,
      message: 'Failed to validate OpenAI API key',
      details: error,
    }
  }
}