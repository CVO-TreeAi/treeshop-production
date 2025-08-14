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

  // Video Content
  videos: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    videoId: v.string(), // YouTube video ID
    thumbnailUrl: v.optional(v.string()),
    category: v.string(), // 'forestry-mulching', 'land-clearing', 'stump-grinding', 'before-after'
    featured: v.optional(v.boolean()),
    duration: v.optional(v.string()),
    
    // Status
    status: v.string(), // 'active', 'inactive'
    
    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_category", ["category"])
    .index("by_featured", ["featured"])
    .index("by_status", ["status"])
    .index("by_createdAt", ["createdAt"]),

  // Project Images/Gallery
  projects: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    imageUrl: v.string(),
    category: v.string(), // 'before', 'after', 'equipment'
    featured: v.optional(v.boolean()),
    acreage: v.optional(v.number()),
    location: v.optional(v.string()),
    
    // Status
    status: v.string(), // 'active', 'inactive'
    
    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_category", ["category"])
    .index("by_featured", ["featured"])
    .index("by_status", ["status"])
    .index("by_createdAt", ["createdAt"]),

  // Employee Management
  employees: defineTable({
    // Basic Info
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    
    // Employment Details
    position: v.string(), // 'crew_leader', 'operator', 'laborer', 'admin'
    department: v.string(), // 'field_operations', 'administration', 'sales'
    employeeId: v.string(),
    hireDate: v.number(),
    
    // Compensation
    baseHourlyRate: v.number(),
    payType: v.string(), // 'hourly', 'salary'
    salaryAmount: v.optional(v.number()),
    
    // Status
    status: v.string(), // 'active', 'inactive', 'terminated'
    terminationDate: v.optional(v.number()),
    terminationReason: v.optional(v.string()),
    
    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_employeeId", ["employeeId"])
    .index("by_status", ["status"])
    .index("by_position", ["position"])
    .index("by_department", ["department"]),

  // Employee Cost Calculations
  employeeCosts: defineTable({
    employeeId: v.id("employees"),
    calculationDate: v.number(),
    
    // Base Costs
    baseHourlyRate: v.number(),
    expectedAnnualHours: v.number(), // Usually 2,080
    annualBaseWages: v.number(),
    
    // Burden Costs (all annual amounts)
    payrollTaxes: v.number(), // FICA, FUTA, SUTA
    workersComp: v.number(), // High for tree care industry
    healthInsurance: v.number(),
    equipmentPPE: v.number(),
    vehicleAllocation: v.number(),
    trainingCertifications: v.number(),
    overheadAllocation: v.number(),
    totalBurdenCosts: v.number(),
    
    // Productivity Factors
    ptoSickHours: v.number(),
    trainingHours: v.number(),
    maintenanceDowntime: v.number(),
    weatherDelays: v.number(),
    administrativeTime: v.number(),
    totalNonProductiveHours: v.number(),
    netProductiveHours: v.number(),
    
    // Final Calculations
    totalAnnualCost: v.number(),
    trueHourlyCost: v.number(),
    burdenMultiplier: v.number(),
    productivityRate: v.number(), // Productive hours / Total hours
    
    // Industry Factors
    industryRiskFactor: v.number(), // Tree care specific
    seasonalAdjustment: v.number(), // Florida weather patterns
    equipmentDependency: v.number(), // Equipment-heavy positions
    
    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_employeeId", ["employeeId"])
    .index("by_calculationDate", ["calculationDate"]),

  // Time Tracking
  timeEntries: defineTable({
    employeeId: v.id("employees"),
    date: v.number(),
    
    // Time Details
    clockIn: v.number(),
    clockOut: v.optional(v.number()),
    totalHours: v.optional(v.number()),
    
    // Work Classification
    workType: v.string(), // 'productive', 'training', 'maintenance', 'administrative', 'weather_delay'
    projectId: v.optional(v.string()),
    location: v.optional(v.string()),
    
    // Equipment Used
    equipmentUsed: v.optional(v.array(v.string())),
    
    // Notes
    description: v.optional(v.string()),
    notes: v.optional(v.string()),
    
    // Approval
    approved: v.boolean(),
    approvedBy: v.optional(v.string()),
    approvedAt: v.optional(v.number()),
    
    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_employeeId", ["employeeId"])
    .index("by_date", ["date"])
    .index("by_workType", ["workType"])
    .index("by_approved", ["approved"]),

  // Cost Factors Configuration
  costFactors: defineTable({
    factorType: v.string(), // 'payroll_tax', 'workers_comp', 'equipment', etc.
    position: v.optional(v.string()), // Position-specific factors
    state: v.optional(v.string()), // State-specific rates
    
    // Factor Values
    percentage: v.optional(v.number()), // For percentage-based factors
    fixedAmount: v.optional(v.number()), // For fixed cost factors
    minAmount: v.optional(v.number()),
    maxAmount: v.optional(v.number()),
    
    // Applicability
    effectiveDate: v.number(),
    expirationDate: v.optional(v.number()),
    isActive: v.boolean(),
    
    // Metadata
    description: v.string(),
    source: v.optional(v.string()), // Where this rate comes from
    
    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_factorType", ["factorType"])
    .index("by_position", ["position"])
    .index("by_effectiveDate", ["effectiveDate"])
    .index("by_isActive", ["isActive"]),

  // System Configuration
  siteSettings: defineTable({
    key: v.string(),
    value: v.any(),
    description: v.optional(v.string()),
    updatedBy: v.string(),
    updatedAt: v.number(),
  }).index("by_key", ["key"]),
});