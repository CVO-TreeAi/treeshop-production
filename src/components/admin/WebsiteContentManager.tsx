'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  WebsiteContent, 
  HeroContent, 
  ValuePropositionsContent,
  ServicesContent,
  TestimonialsContent,
  ContactContent,
  ProjectGalleryContent,
  EquipmentGalleryContent,
  ContentFormState,
  ContentSectionType 
} from '@/types/cms'
import ValuePropositionsEditor from './content-editors/ValuePropositionsEditor'
import ServicesEditor from './content-editors/ServicesEditor'
import TestimonialsEditor from './content-editors/TestimonialsEditor'
import ContactEditor from './content-editors/ContactEditor'
import ProjectGalleryEditor from './content-editors/ProjectGalleryEditor'
import EquipmentGalleryEditor from './content-editors/EquipmentGalleryEditor'

interface WebsiteContentManagerProps {
  onContentChange?: (content: WebsiteContent) => void
}

export default function WebsiteContentManager({ onContentChange }: WebsiteContentManagerProps) {
  const [content, setContent] = useState<WebsiteContent | null>(null)
  const [activeSection, setActiveSection] = useState<ContentSectionType>('hero')
  const [formState, setFormState] = useState<ContentFormState>({
    isEditing: false,
    hasUnsavedChanges: false,
    isPublishing: false,
    isSaving: false,
    validationErrors: {}
  })
  const [isLoading, setIsLoading] = useState(true)
  const [previewMode, setPreviewMode] = useState(false)

  // Load current website content
  useEffect(() => {
    const loadContent = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/treeshop/api/admin/website-content')
        if (response.ok) {
          const data = await response.json()
          setContent(data)
        } else {
          // Initialize with default content if none exists
          setContent(getDefaultContent())
        }
      } catch (error) {
        console.error('Failed to load website content:', error)
        setContent(getDefaultContent())
      } finally {
        setIsLoading(false)
      }
    }
    loadContent()
  }, [])

  const getDefaultContent = (): WebsiteContent => ({
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
          title: '2024 CAT 265 with Professional Forestry Mulcher',
          description: 'Our flagship forestry mulcher ready for operation, showcasing the power and precision needed for Florida\'s toughest clearing jobs.',
          imageUrl: '/treeshop/images/cat-265-forestry-mulcher-fueling.jpg',
          category: 'Equipment',
          location: 'Central Florida',
          equipment: 'CAT 265 with Forestry Mulcher',
          order: 1,
          isActive: true,
          seoAltText: 'CAT 265 excavator with professional forestry mulching attachment being fueled in Florida'
        },
        {
          id: 'proj-2',
          title: 'CAT 299D3 after 8-inch mulching project, 4.5 acres',
          description: 'Completed land clearing project showing the efficiency of our CAT 299D3 with precision mulching capabilities.',
          imageUrl: '/treeshop/images/cat-299d3-blackhawk-4-5-acres.jpg',
          category: 'Project Result',
          location: 'Florida',
          projectSize: '4.5 acres',
          equipment: 'CAT 299D3',
          order: 2,
          isActive: true,
          seoAltText: 'CAT 299D3 excavator on 4.5 acre completed land clearing project in Florida'
        },
        {
          id: 'proj-3',
          title: 'Caterpillar 309 selective tree removal and log transport',
          description: 'Precision selective logging operation with our CAT 309, demonstrating careful tree removal and efficient log handling.',
          imageUrl: '/treeshop/images/cat-309-selective-logging.jpg',
          category: 'Tree Removal',
          equipment: 'Caterpillar 309',
          order: 3,
          isActive: true,
          seoAltText: 'Caterpillar 309 excavator performing selective tree removal and log transport operations'
        },
        {
          id: 'proj-4',
          title: 'First CAT machine with Advanced Mulching System - R&D partnership',
          description: 'Innovative testing of the advanced mulching system attachment, showcasing our commitment to cutting-edge forestry technology.',
          imageUrl: '/treeshop/images/cat-299d3-fusion-blackhawk-testing.jpg',
          category: 'Innovation',
          equipment: 'CAT 299D3 with Advanced Mulching System',
          completionDate: '2024',
          order: 4,
          isActive: true,
          seoAltText: 'CAT 299D3 testing new advanced forestry mulching attachment in research and development partnership'
        },
        {
          id: 'proj-5',
          title: 'CAT 299D3 with Fusion BlackHawk mulching attachment',
          description: 'Side view of our advanced CAT 299D3 equipped with the latest Fusion BlackHawk mulching technology.',
          imageUrl: '/treeshop/images/cat-299d3-fusion-side-view.jpg',
          category: 'Equipment',
          equipment: 'CAT 299D3 with Fusion BlackHawk',
          order: 5,
          isActive: true,
          seoAltText: 'Side profile view of CAT 299D3 excavator with Fusion BlackHawk forestry mulching attachment'
        },
        {
          id: 'proj-6',
          title: 'FAE forestry mulcher producing premium quality mulch',
          description: 'Our FAE forestry mulcher in action, creating high-quality mulch that enriches soil and prevents erosion.',
          imageUrl: '/treeshop/images/fae-forestry-mulcher-fine-mulch.jpg',
          category: 'Equipment',
          equipment: 'FAE Forestry Mulcher',
          order: 6,
          isActive: true,
          seoAltText: 'FAE forestry mulcher producing fine quality mulch for land clearing and soil improvement'
        },
        {
          id: 'proj-7',
          title: 'Professional land clearing debris burning',
          description: 'Safe and controlled debris burning as part of our comprehensive land clearing services, following all environmental regulations.',
          imageUrl: '/treeshop/images/land-clearing-burn-pile.jpg',
          category: 'Land Clearing',
          order: 7,
          isActive: true,
          seoAltText: 'Controlled burn pile for professional land clearing debris disposal following environmental safety protocols'
        },
        {
          id: 'proj-8',
          title: 'Tree Shop operating specialized mulching equipment',
          description: 'Our specialized mulching equipment designed for precision forestry work and efficient land management.',
          imageUrl: '/treeshop/images/specialized-mulching-equipment.jpg',
          category: 'Equipment',
          equipment: 'Specialized Mulcher',
          order: 8,
          isActive: true,
          seoAltText: 'Tree Shop operator using specialized forestry mulching equipment for precision land clearing'
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
          title: 'CAT 265 with Professional Forestry Mulcher',
          description: 'Our flagship forestry mulcher featuring precision cutting and mulching capabilities for challenging terrain.',
          imageUrl: '/treeshop/images/cat-265-forestry-mulcher-fueling.jpg',
          category: 'Forestry Mulcher',
          make: 'Caterpillar',
          model: '265',
          year: '2024',
          specifications: 'High-performance hydraulic system, precision attachment controls',
          featured: true,
          order: 1,
          isActive: true,
          seoAltText: 'CAT 265 excavator with professional forestry mulching attachment',
          tags: ['Heavy Duty', 'Forestry', 'Mulching']
        },
        {
          id: 'eq-2',
          title: 'CAT 299D3 Compact Track Loader',
          description: 'Versatile compact track loader perfect for precision work and accessing tight spaces.',
          imageUrl: '/treeshop/images/cat-299d3-blackhawk-4-5-acres.jpg',
          category: 'Track Loader',
          make: 'Caterpillar',
          model: '299D3',
          year: '2024',
          featured: false,
          order: 2,
          isActive: true,
          seoAltText: 'CAT 299D3 compact track loader for precision forestry work',
          tags: ['Compact', 'Versatile', 'Precision']
        }
      ],
      isPublished: true
    },
    version: 1,
    isPublished: true,
    updatedAt: new Date(),
    updatedBy: "admin"
  })

  const handleContentUpdate = useCallback((updatedContent: WebsiteContent) => {
    setContent(updatedContent)
    setFormState(prev => ({ ...prev, hasUnsavedChanges: true }))
    onContentChange?.(updatedContent)
  }, [onContentChange])

  const handleSave = async () => {
    if (!content) return

    setFormState(prev => ({ ...prev, isSaving: true, validationErrors: {} }))

    try {
      const response = await fetch('/treeshop/api/admin/website-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...content,
          updatedAt: new Date(),
          updatedBy: 'admin' // TODO: Get from auth context
        })
      })

      const result = await response.json()
      
      if (result.success) {
        setContent(result.data)
        setFormState(prev => ({ 
          ...prev, 
          hasUnsavedChanges: false,
          isSaving: false
        }))
      } else {
        setFormState(prev => ({
          ...prev,
          validationErrors: result.validationErrors || {},
          isSaving: false
        }))
      }
    } catch (error) {
      console.error('Failed to save content:', error)
      setFormState(prev => ({ ...prev, isSaving: false }))
    }
  }

  const handlePublish = async () => {
    if (!content) return

    setFormState(prev => ({ ...prev, isPublishing: true }))

    try {
      const response = await fetch('/treeshop/api/admin/website-content/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content)
      })

      const result = await response.json()
      
      if (result.success) {
        setContent(prev => prev ? {
          ...prev,
          isPublished: true,
          publishedAt: new Date(result.publishedAt),
          version: result.publishedVersion
        } : null)
        setFormState(prev => ({ 
          ...prev, 
          hasUnsavedChanges: false,
          isPublishing: false
        }))
      }
    } catch (error) {
      console.error('Failed to publish content:', error)
      setFormState(prev => ({ ...prev, isPublishing: false }))
    }
  }

  const sections = [
    { id: 'hero' as ContentSectionType, label: 'Hero Section', icon: '🎯' },
    { id: 'value-propositions' as ContentSectionType, label: 'Value Propositions', icon: '💎' },
    { id: 'services' as ContentSectionType, label: 'Services', icon: '🛠️' },
    { id: 'testimonials' as ContentSectionType, label: 'Testimonials', icon: '⭐' },
    { id: 'contact' as ContentSectionType, label: 'Contact Info', icon: '📞' },
    { id: 'project-gallery' as ContentSectionType, label: 'Project Gallery', icon: '📸' },
    { id: 'equipment-gallery' as ContentSectionType, label: 'Equipment Gallery', icon: '🚜' }
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    )
  }

  if (!content) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Failed to load website content</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Website Content</h2>
          <p className="text-gray-400">Edit default website content that appears across all pages</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            {previewMode ? '📝 Edit' : '👁️ Preview'}
          </button>
          <button
            onClick={handleSave}
            disabled={!formState.hasUnsavedChanges || formState.isSaving}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {formState.isSaving ? '💾 Saving...' : '💾 Save Changes'}
          </button>
          <button
            onClick={handlePublish}
            disabled={formState.hasUnsavedChanges || formState.isPublishing}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {formState.isPublishing ? '🚀 Publishing...' : '🚀 Publish Live'}
          </button>
        </div>
      </div>

      {/* Status Indicators */}
      {(formState.hasUnsavedChanges || formState.isSaving || formState.isPublishing) && (
        <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
          <div className="flex items-center gap-2">
            {formState.hasUnsavedChanges && (
              <span className="flex items-center gap-2 text-yellow-400">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                Unsaved changes
              </span>
            )}
            {formState.isSaving && (
              <span className="flex items-center gap-2 text-blue-400">
                <div className="animate-spin w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full"></div>
                Saving...
              </span>
            )}
            {formState.isPublishing && (
              <span className="flex items-center gap-2 text-purple-400">
                <div className="animate-pulse w-4 h-4 bg-purple-400 rounded-full"></div>
                Publishing...
              </span>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-12 gap-6">
        {/* Section Navigation */}
        <div className="col-span-3">
          <nav className="space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeSection === section.id
                    ? 'bg-green-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <span className="text-lg">{section.icon}</span>
                <span className="font-medium">{section.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content Editor */}
        <div className="col-span-9">
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
            {activeSection === 'hero' && (
              <HeroContentEditor 
                content={content.hero}
                onChange={(hero) => handleContentUpdate({ ...content, hero })}
                validationErrors={formState.validationErrors}
                previewMode={previewMode}
              />
            )}
            {activeSection === 'value-propositions' && (
              <ValuePropositionsEditor 
                content={content.valuePropositions}
                onChange={(valuePropositions) => handleContentUpdate({ ...content, valuePropositions })}
                validationErrors={formState.validationErrors}
                previewMode={previewMode}
              />
            )}
            {activeSection === 'services' && (
              <ServicesEditor 
                content={content.services}
                onChange={(services) => handleContentUpdate({ ...content, services })}
                validationErrors={formState.validationErrors}
                previewMode={previewMode}
              />
            )}
            {activeSection === 'testimonials' && (
              <TestimonialsEditor 
                content={content.testimonials}
                onChange={(testimonials) => handleContentUpdate({ ...content, testimonials })}
                validationErrors={formState.validationErrors}
                previewMode={previewMode}
              />
            )}
            {activeSection === 'contact' && (
              <ContactEditor 
                content={content.contact}
                onChange={(contact) => handleContentUpdate({ ...content, contact })}
                validationErrors={formState.validationErrors}
                previewMode={previewMode}
              />
            )}
            {activeSection === 'project-gallery' && (
              <ProjectGalleryEditor 
                content={content.projectGallery}
                onChange={(projectGallery) => handleContentUpdate({ ...content, projectGallery })}
                validationErrors={formState.validationErrors}
                previewMode={previewMode}
              />
            )}
            {activeSection === 'equipment-gallery' && (
              <EquipmentGalleryEditor 
                content={content.equipmentGallery}
                onChange={(equipmentGallery) => handleContentUpdate({ ...content, equipmentGallery })}
                validationErrors={formState.validationErrors}
                previewMode={previewMode}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Individual section editors will be implemented as separate components
function HeroContentEditor({ content, onChange, validationErrors, previewMode }: any) {
  if (previewMode) {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-white mb-4">Hero Section Preview</h3>
        <div className="bg-gradient-to-r from-green-900 to-blue-900 p-8 rounded-lg text-center">
          <h1 className="text-4xl font-bold text-white mb-4">{content.title}</h1>
          <p className="text-xl text-gray-200 mb-6">{content.subtitle}</p>
          <div className="flex justify-center gap-4">
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold">
              {content.primaryCtaText}
            </button>
            {content.secondaryCtaText && (
              <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-900">
                {content.secondaryCtaText}
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white mb-4">Hero Section</h3>
      
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Main Title</label>
          <input
            type="text"
            value={content.title}
            onChange={(e) => onChange({ ...content, title: e.target.value })}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-500"
            placeholder="Enter main hero title"
          />
          {validationErrors.title && (
            <p className="text-red-400 text-sm mt-1">{validationErrors.title[0]}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Subtitle</label>
          <textarea
            value={content.subtitle}
            onChange={(e) => onChange({ ...content, subtitle: e.target.value })}
            rows={3}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-500"
            placeholder="Enter hero subtitle/description"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Primary CTA Text</label>
            <input
              type="text"
              value={content.primaryCtaText}
              onChange={(e) => onChange({ ...content, primaryCtaText: e.target.value })}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-500"
              placeholder="e.g., Get Free Estimate"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Primary CTA Link</label>
            <input
              type="text"
              value={content.primaryCtaHref}
              onChange={(e) => onChange({ ...content, primaryCtaHref: e.target.value })}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-500"
              placeholder="e.g., /estimator"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Secondary CTA Text (Optional)</label>
            <input
              type="text"
              value={content.secondaryCtaText || ''}
              onChange={(e) => onChange({ ...content, secondaryCtaText: e.target.value })}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-500"
              placeholder="e.g., View Our Work"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Secondary CTA Link</label>
            <input
              type="text"
              value={content.secondaryCtaHref || ''}
              onChange={(e) => onChange({ ...content, secondaryCtaHref: e.target.value })}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-500"
              placeholder="e.g., /gallery"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

