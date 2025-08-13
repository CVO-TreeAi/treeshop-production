// Content Management System Type Definitions

export interface HeroContent {
  id?: string
  title: string
  subtitle: string
  backgroundImageUrl?: string
  backgroundVideoUrl?: string
  primaryCtaText: string
  primaryCtaHref: string
  secondaryCtaText?: string
  secondaryCtaHref?: string
  isPublished: boolean
  updatedAt?: Date
  updatedBy?: string
}

export interface ValueProposition {
  id: string
  title: string
  description: string
  slug: string
  iconUrl?: string
  order: number
  isActive: boolean
}

export interface ValuePropositionsContent {
  id?: string
  sectionTitle: string
  sectionSubtitle?: string
  propositions: ValueProposition[]
  isPublished: boolean
  updatedAt?: Date
  updatedBy?: string
}

export interface ServiceTile {
  id: string
  title: string
  description: string
  href: string
  iconUrl?: string
  imageUrl?: string
  order: number
  isActive: boolean
}

export interface ServicesContent {
  id?: string
  sectionTitle: string
  sectionSubtitle?: string
  services: ServiceTile[]
  isPublished: boolean
  updatedAt?: Date
  updatedBy?: string
}

export interface FeaturedReview {
  id: string
  customerName: string
  customerLocation?: string
  rating: number
  reviewText: string
  serviceType?: string
  isActive: boolean
}

export interface TestimonialsContent {
  id?: string
  sectionTitle: string
  averageRating: number
  totalReviews: number
  featuredReviews: FeaturedReview[]
  googleReviewsUrl?: string
  isPublished: boolean
  updatedAt?: Date
  updatedBy?: string
}

export interface ContactContent {
  id?: string
  phoneNumber: string
  emailAddress: string
  businessAddress: string
  serviceAreas: string[]
  businessHours: {
    monday?: string
    tuesday?: string
    wednesday?: string
    thursday?: string
    friday?: string
    saturday?: string
    sunday?: string
  }
  emergencyAvailable: boolean
  isPublished: boolean
  updatedAt?: Date
  updatedBy?: string
}

export interface ProjectGalleryItem {
  id: string
  title: string
  description: string
  imageUrl: string
  category?: string
  location?: string
  completionDate?: string
  projectSize?: string
  equipment?: string
  order: number
  isActive: boolean
  seoAltText?: string
}

export interface ProjectGalleryContent {
  id?: string
  sectionTitle: string
  sectionSubtitle?: string
  projects: ProjectGalleryItem[]
  isPublished: boolean
  updatedAt?: Date
  updatedBy?: string
}

export interface EquipmentGalleryItem {
  id: string
  title: string
  description: string
  imageUrl: string
  category?: string
  make?: string
  model?: string
  year?: string
  specifications?: string
  featured: boolean
  order: number
  isActive: boolean
  seoAltText?: string
  tags?: string[]
}

export interface EquipmentGalleryContent {
  id?: string
  sectionTitle: string
  sectionSubtitle?: string
  equipment: EquipmentGalleryItem[]
  isPublished: boolean
  updatedAt?: Date
  updatedBy?: string
}

export interface WebsiteContent {
  id?: string
  hero: HeroContent
  valuePropositions: ValuePropositionsContent
  services: ServicesContent
  testimonials: TestimonialsContent
  contact: ContactContent
  projectGallery: ProjectGalleryContent
  equipmentGallery: EquipmentGalleryContent
  version: number
  isPublished: boolean
  publishedAt?: Date
  updatedAt: Date
  updatedBy: string
}

// Form State Types
export interface ContentFormState {
  isEditing: boolean
  hasUnsavedChanges: boolean
  isPublishing: boolean
  isSaving: boolean
  validationErrors: Record<string, string[]>
}

// API Response Types
export interface ContentUpdateResponse {
  success: boolean
  data?: WebsiteContent
  error?: string
  validationErrors?: Record<string, string[]>
}

export interface ContentPublishResponse {
  success: boolean
  publishedVersion?: number
  publishedAt?: Date
  error?: string
}

// Tab Types for CMS
export type CMSTabType = 'website-content' | 'dynamic-content' | 'media-library'

// Content Section Types
export type ContentSectionType = 'hero' | 'value-propositions' | 'services' | 'testimonials' | 'contact' | 'project-gallery' | 'equipment-gallery'

// Validation Rules
export interface ContentValidationRule {
  field: string
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: any) => string | null
}

export interface ContentSectionValidation {
  [ContentSectionType: string]: ContentValidationRule[]
}