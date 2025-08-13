import { NextRequest, NextResponse } from 'next/server'
import { WebsiteContent } from '../../../../types/cms'

// This is a placeholder implementation - replace with your actual database/storage logic
const STORAGE_KEY = 'website_content'

// In a real implementation, this would come from a database
let websiteContentStore: WebsiteContent | null = null

export async function GET(request: NextRequest) {
  try {
    // In a real implementation, fetch from database
    // For now, return default content if none exists
    if (!websiteContentStore) {
      websiteContentStore = getDefaultContent()
    }

    return NextResponse.json(websiteContentStore)
  } catch (error) {
    console.error('Failed to get website content:', error)
    return NextResponse.json(
      { error: 'Failed to load website content' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const content: WebsiteContent = await request.json()

    // Validate content (basic validation)
    const validationErrors = validateContent(content)
    if (Object.keys(validationErrors).length > 0) {
      return NextResponse.json({
        success: false,
        validationErrors
      }, { status: 400 })
    }

    // In a real implementation, save to database
    websiteContentStore = {
      ...content,
      updatedAt: new Date(),
      version: (content.version || 0) + 1
    }

    return NextResponse.json({
      success: true,
      data: websiteContentStore
    })
  } catch (error) {
    console.error('Failed to save website content:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to save website content'
    }, { status: 500 })
  }
}

function getDefaultContent(): WebsiteContent {
  return {
    hero: {
      title: "Florida's Premier Tree Service & Land Clearing",
      subtitle: "Professional forestry mulching, tree removal, and land clearing services across Central Florida",
      primaryCtaText: "Get Free Estimate",
      primaryCtaHref: "/estimator",
      secondaryCtaText: "View Our Work",
      secondaryCtaHref: "/gallery",
      isPublished: true
    },
    valuePropositions: {
      sectionTitle: "Why Choose TreeAI Professional Services",
      propositions: [
        {
          id: '1',
          title: "Licensed & Insured",
          description: "Full commercial insurance and Florida state licensing for your peace of mind",
          slug: "licensed-insured",
          order: 1,
          isActive: true
        },
        {
          id: '2', 
          title: "AI-Powered Estimates",
          description: "Get accurate quotes instantly using our advanced AI estimation technology",
          slug: "ai-estimates",
          order: 2,
          isActive: true
        },
        {
          id: '3',
          title: "Emergency Services",
          description: "24/7 storm damage response and emergency tree removal services",
          slug: "emergency-services", 
          order: 3,
          isActive: true
        }
      ],
      isPublished: true
    },
    services: {
      sectionTitle: "Our Professional Services",
      services: [
        {
          id: '1',
          title: "Forestry Mulching",
          description: "Eco-friendly land clearing that preserves topsoil and nutrients",
          href: "/services/forestry-mulching",
          order: 1,
          isActive: true
        },
        {
          id: '2',
          title: "Tree Removal", 
          description: "Safe removal of hazardous or unwanted trees of any size",
          href: "/services/tree-removal",
          order: 2,
          isActive: true
        },
        {
          id: '3',
          title: "Land Clearing",
          description: "Complete site preparation for construction and development",
          href: "/services/land-clearing", 
          order: 3,
          isActive: true
        }
      ],
      isPublished: true
    },
    testimonials: {
      sectionTitle: "What Our Customers Say",
      averageRating: 4.9,
      totalReviews: 127,
      featuredReviews: [
        {
          id: '1',
          customerName: "Mike Johnson",
          customerLocation: "Orlando, FL",
          rating: 5,
          reviewText: "Exceptional work on our 5-acre property. The team was professional, efficient, and left the site cleaner than they found it.",
          serviceType: "Forestry Mulching",
          isActive: true
        },
        {
          id: '2',
          customerName: "Sarah Martinez",
          customerLocation: "Tampa, FL", 
          rating: 5,
          reviewText: "Quick response for storm damage cleanup. They removed a huge oak tree that fell on our fence and cleaned up everything perfectly.",
          serviceType: "Emergency Tree Removal",
          isActive: true
        },
        {
          id: '3',
          customerName: "Dave Wilson", 
          customerLocation: "Lakeland, FL",
          rating: 5,
          reviewText: "The AI estimate was spot-on and the actual work exceeded our expectations. Great communication throughout the project.",
          serviceType: "Land Clearing",
          isActive: true
        }
      ],
      isPublished: true
    },
    contact: {
      phoneNumber: "(407) 555-TREE",
      emailAddress: "info@treeai.us",
      businessAddress: "Orlando, FL",
      serviceAreas: ["Orange County", "Seminole County", "Lake County", "Osceola County"],
      businessHours: {
        monday: "7:00 AM - 6:00 PM",
        tuesday: "7:00 AM - 6:00 PM", 
        wednesday: "7:00 AM - 6:00 PM",
        thursday: "7:00 AM - 6:00 PM",
        friday: "7:00 AM - 6:00 PM",
        saturday: "8:00 AM - 4:00 PM",
        sunday: "Emergency Only"
      },
      emergencyAvailable: true,
      isPublished: true
    },
    projectGallery: {
      sectionTitle: "Our Equipment & Projects",
      sectionSubtitle: "Professional forestry mulching and land clearing equipment in action across Florida",
      projects: [
        {
          id: 'proj-1',
          title: '2024 CAT 265 with Fecon BlackHawk Forestry Mulcher',
          description: 'Our flagship forestry mulcher ready for operation, showcasing the power and precision needed for Florida\'s toughest clearing jobs.',
          imageUrl: '/treeshop/images/cat-265-fecon-blackhawk-fueling.jpg',
          category: 'Equipment',
          location: 'Central Florida',
          equipment: 'CAT 265 with Fecon BlackHawk',
          order: 1,
          isActive: true,
          seoAltText: 'CAT 265 excavator with Fecon BlackHawk forestry mulching attachment being fueled in Florida'
        }
      ],
      isPublished: true
    },
    equipmentGallery: {
      sectionTitle: "Our Professional Equipment",
      sectionSubtitle: "State-of-the-art machinery for forestry mulching and land clearing operations",
      equipment: [
        {
          id: 'eq-1',
          title: 'CAT 265 with Fecon BlackHawk Forestry Mulcher',
          description: 'Our flagship forestry mulcher featuring precision cutting and mulching capabilities for challenging terrain.',
          imageUrl: '/treeshop/images/cat-265-fecon-blackhawk-fueling.jpg',
          category: 'Forestry Mulcher',
          make: 'Caterpillar',
          model: '265',
          year: '2024',
          specifications: 'High-performance hydraulic system, precision attachment controls',
          featured: true,
          order: 1,
          isActive: true,
          seoAltText: 'CAT 265 excavator with Fecon BlackHawk forestry mulching attachment',
          tags: ['Heavy Duty', 'Forestry', 'Mulching']
        }
      ],
      isPublished: true
    },
    version: 1,
    isPublished: true,
    updatedAt: new Date(),
    updatedBy: "admin"
  }
}

function validateContent(content: WebsiteContent): Record<string, string[]> {
  const errors: Record<string, string[]> = {}

  // Hero validation
  if (!content.hero.title?.trim()) {
    errors['hero.title'] = ['Title is required']
  }
  if (content.hero.title?.length > 100) {
    errors['hero.title'] = ['Title must be less than 100 characters']
  }
  if (!content.hero.subtitle?.trim()) {
    errors['hero.subtitle'] = ['Subtitle is required'] 
  }
  if (!content.hero.primaryCtaText?.trim()) {
    errors['hero.primaryCtaText'] = ['Primary CTA text is required']
  }
  if (!content.hero.primaryCtaHref?.trim()) {
    errors['hero.primaryCtaHref'] = ['Primary CTA link is required']
  }

  // Value propositions validation
  if (!content.valuePropositions.sectionTitle?.trim()) {
    errors['valuePropositions.sectionTitle'] = ['Section title is required']
  }
  if (content.valuePropositions.propositions.length === 0) {
    errors['valuePropositions.propositions'] = ['At least one value proposition is required']
  }

  // Services validation
  if (!content.services.sectionTitle?.trim()) {
    errors['services.sectionTitle'] = ['Section title is required']
  }
  if (content.services.services.length === 0) {
    errors['services.services'] = ['At least one service is required']
  }

  // Testimonials validation
  if (!content.testimonials.sectionTitle?.trim()) {
    errors['testimonials.sectionTitle'] = ['Section title is required']
  }
  if (content.testimonials.averageRating < 1 || content.testimonials.averageRating > 5) {
    errors['testimonials.averageRating'] = ['Average rating must be between 1 and 5']
  }

  // Contact validation
  if (!content.contact.phoneNumber?.trim()) {
    errors['contact.phoneNumber'] = ['Phone number is required']
  }
  if (!content.contact.emailAddress?.trim()) {
    errors['contact.emailAddress'] = ['Email address is required']
  }
  if (!content.contact.businessAddress?.trim()) {
    errors['contact.businessAddress'] = ['Business address is required']
  }

  // Project Gallery validation
  if (content.projectGallery) {
    if (!content.projectGallery.sectionTitle?.trim()) {
      errors['projectGallery.sectionTitle'] = ['Section title is required']
    }
    // Validate each project
    content.projectGallery.projects?.forEach((project, index) => {
      if (!project.title?.trim()) {
        errors[`projectGallery.projects.${index}.title`] = ['Project title is required']
      }
      if (!project.description?.trim()) {
        errors[`projectGallery.projects.${index}.description`] = ['Project description is required']
      }
      if (!project.imageUrl?.trim()) {
        errors[`projectGallery.projects.${index}.imageUrl`] = ['Project image URL is required']
      }
    })
  }

  // Equipment Gallery validation
  if (content.equipmentGallery) {
    if (!content.equipmentGallery.sectionTitle?.trim()) {
      errors['equipmentGallery.sectionTitle'] = ['Section title is required']
    }
    // Validate each equipment item
    content.equipmentGallery.equipment?.forEach((equipment, index) => {
      if (!equipment.title?.trim()) {
        errors[`equipmentGallery.equipment.${index}.title`] = ['Equipment title is required']
      }
      if (!equipment.description?.trim()) {
        errors[`equipmentGallery.equipment.${index}.description`] = ['Equipment description is required']
      }
      if (!equipment.imageUrl?.trim()) {
        errors[`equipmentGallery.equipment.${index}.imageUrl`] = ['Equipment image URL is required']
      }
    })
  }

  return errors
}