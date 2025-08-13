import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Partial Lead Captures (for form abandonment tracking)
  partialLeads: defineTable({
    sessionId: v.string(), // Browser session or unique ID
    formData: v.object({
      name: v.optional(v.string()),
      email: v.optional(v.string()),
      phone: v.optional(v.string()),
      address: v.optional(v.string()),
      zipCode: v.optional(v.string()),
      acreage: v.optional(v.number()),
      selectedPackage: v.optional(v.string()),
      obstacles: v.optional(v.array(v.string())),
    }),
    pageUrl: v.string(),
    step: v.string(), // Which step of form they reached
    
    // Status tracking
    status: v.string(), // 'partial', 'completed', 'abandoned'
    completedLeadId: v.optional(v.id("leads")),
    
    // Attribution
    utmSource: v.optional(v.string()),
    utmMedium: v.optional(v.string()),
    utmCampaign: v.optional(v.string()),
    referrer: v.optional(v.string()),
    
    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_sessionId", ["sessionId"])
    .index("by_status", ["status"])
    .index("by_updatedAt", ["updatedAt"]),

  // Lead Management
  leads: defineTable({
    // Contact Information
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    
    // Project Details
    address: v.string(),
    zipCode: v.optional(v.string()),
    acreage: v.number(),
    selectedPackage: v.string(), // 'small', 'medium', 'large', 'xlarge'
    obstacles: v.array(v.string()),
    
    // Lead Scoring
    leadScore: v.string(), // 'hot', 'warm', 'cold'
    leadSource: v.string(), // 'website', 'referral', etc.
    leadPage: v.string(), // 'estimate', 'contact', etc.
    
    // Estimate Details
    estimatedTotal: v.optional(v.number()),
    pricePerAcre: v.optional(v.number()),
    travelSurcharge: v.optional(v.number()),
    assumptions: v.optional(v.array(v.string())),
    
    // Status Tracking
    status: v.string(), // 'new', 'contacted', 'qualified', 'quoted', 'won', 'lost'
    notes: v.optional(v.string()),
    contactedAt: v.optional(v.number()),
    followUpDate: v.optional(v.number()),
    
    // Attribution
    utmSource: v.optional(v.string()),
    utmMedium: v.optional(v.string()),
    utmCampaign: v.optional(v.string()),
    referrer: v.optional(v.string()),
    
    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_phone", ["phone"])
    .index("by_status", ["status"])
    .index("by_leadScore", ["leadScore"])
    .index("by_createdAt", ["createdAt"]),

  // Blog System
  blogPosts: defineTable({
    title: v.string(),
    slug: v.string(),
    excerpt: v.optional(v.string()),
    content: v.string(), // MDX content
    
    // SEO
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    keywords: v.optional(v.array(v.string())),
    
    // Media
    featuredImage: v.optional(v.string()), // Convex file storage ID
    featuredImageAlt: v.optional(v.string()),
    
    // Organization
    category: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    
    // Publishing
    status: v.string(), // 'draft', 'review', 'published', 'archived'
    publishedAt: v.optional(v.number()),
    
    // Author
    authorId: v.optional(v.string()),
    authorName: v.string(),
    
    // Analytics
    viewCount: v.optional(v.number()),
    
    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_status", ["status"])
    .index("by_category", ["category"])
    .index("by_publishedAt", ["publishedAt"])
    .index("by_createdAt", ["createdAt"]),

  // Media Files
  mediaFiles: defineTable({
    filename: v.string(),
    originalName: v.string(),
    mimeType: v.string(),
    size: v.number(),
    
    // Convex file storage
    storageId: v.string(), // Convex file storage ID
    
    // Image metadata
    width: v.optional(v.number()),
    height: v.optional(v.number()),
    alt: v.optional(v.string()),
    
    // Organization
    folder: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    
    // Usage tracking
    usedInPosts: v.optional(v.array(v.string())), // Array of post IDs
    
    // Upload info
    uploadedBy: v.string(), // User who uploaded
    
    // Timestamps
    createdAt: v.number(),
  })
    .index("by_mimeType", ["mimeType"])
    .index("by_folder", ["folder"])
    .index("by_createdAt", ["createdAt"]),

  // Estimates/Proposals
  estimates: defineTable({
    leadId: v.string(), // Reference to leads table
    
    // Project Details
    acreage: v.number(),
    packageType: v.string(),
    obstacles: v.array(v.string()),
    
    // Pricing
    basePrice: v.number(),
    travelSurcharge: v.number(),
    obstacleAdjustment: v.number(),
    totalPrice: v.number(),
    
    // AI Analysis
    aiConfidence: v.optional(v.number()),
    aiAssumptions: v.optional(v.array(v.string())),
    
    // Proposal Details
    proposalSent: v.boolean(),
    proposalAccepted: v.optional(v.boolean()),
    depositPaid: v.optional(v.boolean()),
    depositAmount: v.optional(v.number()),
    
    // Timeline
    estimatedDays: v.optional(v.number()),
    startDate: v.optional(v.number()),
    completionDate: v.optional(v.number()),
    
    // Status
    status: v.string(), // 'draft', 'sent', 'accepted', 'rejected', 'completed'
    
    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_leadId", ["leadId"])
    .index("by_status", ["status"])
    .index("by_createdAt", ["createdAt"]),

  // Email Notifications
  notifications: defineTable({
    leadId: v.id("leads"),
    type: v.string(), // 'new_lead', 'proposal_sent', 'estimate_ready'
    recipientEmail: v.string(),
    subject: v.string(),
    status: v.string(), // 'pending', 'sent', 'failed'
    data: v.optional(v.any()), // Email template data
    error: v.optional(v.string()),
    
    // Timestamps
    createdAt: v.number(),
    sentAt: v.optional(v.number()),
    updatedAt: v.number(),
  })
    .index("by_leadId", ["leadId"])
    .index("by_status", ["status"])
    .index("by_type", ["type"])
    .index("by_createdAt", ["createdAt"]),

  // System Configuration
  siteSettings: defineTable({
    key: v.string(),
    value: v.any(),
    description: v.optional(v.string()),
    updatedBy: v.string(),
    updatedAt: v.number(),
  }).index("by_key", ["key"]),
});