import { NextRequest, NextResponse } from 'next/server'
import { ConvexHttpClient } from "convex/browser"
import { api } from '../../../../../convex/_generated/api'

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

// Calculate estimate pricing
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      acreage,
      packageType,
      obstacles,
      zipCode,
    } = body

    // Validate required fields
    if (!acreage || !packageType) {
      return NextResponse.json({
        success: false,
        error: 'Acreage and package type are required',
      }, { status: 400 })
    }

    // Calculate estimate using Convex function
    const estimate = await convex.mutation(api.estimates.calculateEstimate, {
      acreage: parseFloat(acreage),
      packageType,
      obstacles: obstacles || [],
      zipCode,
    })

    // Format response with additional info
    return NextResponse.json({
      success: true,
      data: {
        ...estimate,
        formattedTotal: `$${estimate.totalPrice.toLocaleString()}`,
        formattedBasePrice: `$${estimate.basePrice.toLocaleString()}`,
        priceBreakdown: {
          basePrice: estimate.basePrice,
          pricePerAcre: estimate.packageInfo.pricePerAcre,
          acreage,
          travelSurcharge: estimate.travelSurcharge,
          obstacleAdjustment: estimate.obstacleAdjustment,
          obstacles: obstacles || [],
        },
        timeline: {
          estimatedDays: estimate.estimatedDays,
          startAvailability: getNextAvailableStartDate(),
        },
        package: {
          ...estimate.packageInfo,
          name: formatPackageName(packageType),
          description: getPackageDescription(packageType),
        },
        assumptions: generateAssumptions(acreage, packageType, obstacles, zipCode),
      }
    })

  } catch (error) {
    console.error('Estimate calculation error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to calculate estimate',
    }, { status: 500 })
  }
}

// Helper functions
function getNextAvailableStartDate(): string {
  const today = new Date()
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
  return nextWeek.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

function formatPackageName(packageType: string): string {
  const names = {
    small: '4" DBH Small Package',
    medium: '6" DBH Medium Package', 
    large: '8" DBH Large Package',
    xlarge: '10" DBH Extra Large Package',
  }
  return names[packageType as keyof typeof names] || '6" DBH Medium Package'
}

function getPackageDescription(packageType: string): string {
  const descriptions = {
    small: 'Suitable for light brush, saplings, and trees up to 4 inches diameter',
    medium: 'Perfect for mixed vegetation, brush, and trees up to 6 inches diameter',
    large: 'Handles dense forest, mature trees, and vegetation up to 8 inches diameter',
    xlarge: 'Heavy-duty clearing for large trees and dense forest up to 10 inches diameter',
  }
  return descriptions[packageType as keyof typeof descriptions] || descriptions.medium
}

function generateAssumptions(acreage: number, packageType: string, obstacles: string[], zipCode?: string): string[] {
  const assumptions = [
    'Weather permitting - no work during heavy rain or storms',
    'Property boundaries clearly marked or provided by customer',
    'All necessary permits obtained by property owner if required',
    'Access to property available for equipment (min 10ft wide)',
  ]

  if (acreage >= 10) {
    assumptions.push('Multiple day project - timeline may vary based on conditions')
  }

  if (obstacles && obstacles.length > 0) {
    assumptions.push('Obstacle pricing based on preliminary assessment - final may vary')
  }

  if (packageType === 'xlarge') {
    assumptions.push('Large tree removal may require additional equipment or manual felling')
  }

  if (zipCode) {
    assumptions.push('Travel surcharge based on distance from central Florida base')
  }

  assumptions.push('Final pricing confirmed after on-site evaluation')

  return assumptions
}