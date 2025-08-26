import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new lead
export const createLead = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    address: v.string(),
    zipCode: v.optional(v.string()),
    acreage: v.optional(v.number()),
    selectedPackage: v.optional(v.string()),
    obstacles: v.optional(v.array(v.string())),
    leadSource: v.optional(v.string()),
    leadPage: v.optional(v.string()),
    utmSource: v.optional(v.string()),
    utmMedium: v.optional(v.string()),
    utmCampaign: v.optional(v.string()),
    referrer: v.optional(v.string()),
    estimatedTotal: v.optional(v.number()),
    pricePerAcre: v.optional(v.number()),
    travelSurcharge: v.optional(v.number()),
    assumptions: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    // Basic lead scoring logic
    let leadScore = "cold";
    if (args.acreage && args.acreage >= 5) leadScore = "warm";
    if (args.acreage && args.acreage >= 10) leadScore = "hot";
    if (args.estimatedTotal && args.estimatedTotal >= 15000) leadScore = "hot";
    
    const leadId = await ctx.db.insert("leads", {
      name: args.name,
      email: args.email,
      phone: args.phone,
      address: args.address,
      zipCode: args.zipCode,
      acreage: args.acreage || 0,
      selectedPackage: args.selectedPackage || "medium",
      obstacles: args.obstacles || [],
      leadScore,
      leadSource: args.leadSource || "website",
      leadPage: args.leadPage || "unknown",
      status: "new",
      estimatedTotal: args.estimatedTotal,
      pricePerAcre: args.pricePerAcre,
      travelSurcharge: args.travelSurcharge,
      assumptions: args.assumptions,
      utmSource: args.utmSource,
      utmMedium: args.utmMedium,
      utmCampaign: args.utmCampaign,
      referrer: args.referrer,
      createdAt: now,
      updatedAt: now,
    });
    
    return leadId;
  },
});

// Update lead status
export const updateLeadStatus = mutation({
  args: {
    id: v.id("leads"),
    status: v.string(),
    notes: v.optional(v.string()),
    followUpDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    await ctx.db.patch(args.id, {
      status: args.status,
      notes: args.notes,
      followUpDate: args.followUpDate,
      updatedAt: now,
      ...(args.status === "contacted" && { contactedAt: now }),
    });
    
    return args.id;
  },
});

// Update lead (general purpose)
export const updateLead = mutation({
  args: {
    id: v.id("leads"),
    status: v.optional(v.string()),
    notes: v.optional(v.string()),
    followUpDate: v.optional(v.number()),
    updatedAt: v.number(),
  },
  handler: async (ctx, args) => {
    const updateData: any = {
      updatedAt: args.updatedAt,
    };
    
    if (args.status) updateData.status = args.status;
    if (args.notes !== undefined) updateData.notes = args.notes;
    if (args.followUpDate) updateData.followUpDate = args.followUpDate;
    
    if (args.status === "contacted" && !updateData.contactedAt) {
      updateData.contactedAt = args.updatedAt;
    }
    
    await ctx.db.patch(args.id, updateData);
    return args.id;
  },
});

// Get all leads with filtering
export const getLeads = query({
  args: {
    status: v.optional(v.string()),
    leadScore: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("leads");
    
    if (args.status) {
      query = query.filter((q) => q.eq(q.field("status"), args.status));
    }
    
    if (args.leadScore) {
      query = query.filter((q) => q.eq(q.field("leadScore"), args.leadScore));
    }
    
    return await query
      .order("desc")
      .take(args.limit || 50);
  },
});

// Get lead by ID
export const getLeadById = query({
  args: { id: v.id("leads") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Search leads by email or phone
export const searchLeads = query({
  args: {
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.email) {
      return await ctx.db
        .query("leads")
        .withIndex("by_email", (q) => q.eq("email", args.email))
        .collect();
    }
    
    if (args.phone) {
      return await ctx.db
        .query("leads")
        .withIndex("by_phone", (q) => q.eq("phone", args.phone))
        .collect();
    }
    
    return [];
  },
});

// Get lead analytics
export const getLeadAnalytics = query({
  args: {},
  handler: async (ctx) => {
    const allLeads = await ctx.db.query("leads").collect();
    
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    const recentLeads = allLeads.filter(lead => lead.createdAt >= thirtyDaysAgo.getTime());
    
    return {
      total: allLeads.length,
      recentCount: recentLeads.length,
      byStatus: allLeads.reduce((acc, lead) => {
        acc[lead.status] = (acc[lead.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      byScore: allLeads.reduce((acc, lead) => {
        acc[lead.leadScore] = (acc[lead.leadScore] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      bySource: allLeads.reduce((acc, lead) => {
        acc[lead.leadSource] = (acc[lead.leadSource] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      totalEstimatedValue: allLeads
        .filter(lead => lead.estimatedTotal)
        .reduce((sum, lead) => sum + (lead.estimatedTotal || 0), 0),
    };
  },
});

// Save partial lead form (for incomplete submissions)
export const savePartialLead = mutation({
  args: {
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
    step: v.string(), // Which step of the form they're on
    utmSource: v.optional(v.string()),
    utmMedium: v.optional(v.string()),
    utmCampaign: v.optional(v.string()),
    referrer: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    // Check if partial lead already exists for this session
    const existing = await ctx.db
      .query("partialLeads")
      .filter((q) => q.eq(q.field("sessionId"), args.sessionId))
      .first();
    
    if (existing) {
      // Update existing partial lead
      await ctx.db.patch(existing._id, {
        formData: args.formData,
        step: args.step,
        pageUrl: args.pageUrl,
        updatedAt: now,
      });
      return existing._id;
    } else {
      // Create new partial lead
      return await ctx.db.insert("partialLeads", {
        sessionId: args.sessionId,
        formData: args.formData,
        pageUrl: args.pageUrl,
        step: args.step,
        utmSource: args.utmSource,
        utmMedium: args.utmMedium,
        utmCampaign: args.utmCampaign,
        referrer: args.referrer,
        status: "partial",
        createdAt: now,
        updatedAt: now,
      });
    }
  },
});

// Complete lead from partial (when form is finished)
export const completeLeadFromPartial = mutation({
  args: {
    sessionId: v.string(),
    finalData: v.object({
      name: v.string(),
      email: v.string(),
      phone: v.string(),
      address: v.string(),
      zipCode: v.optional(v.string()),
      acreage: v.number(),
      selectedPackage: v.string(),
      obstacles: v.optional(v.array(v.string())),
    }),
    estimateData: v.optional(v.object({
      estimatedTotal: v.number(),
      pricePerAcre: v.number(),
      travelSurcharge: v.number(),
      assumptions: v.array(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    // Find the partial lead
    const partialLead = await ctx.db
      .query("partialLeads")
      .filter((q) => q.eq(q.field("sessionId"), args.sessionId))
      .first();
    
    // Create full lead directly (avoid circular reference)
    let leadScore = "cold";
    if (args.finalData.acreage && args.finalData.acreage >= 5) leadScore = "warm";
    if (args.finalData.acreage && args.finalData.acreage >= 10) leadScore = "hot";
    if (args.estimateData?.estimatedTotal && args.estimateData.estimatedTotal >= 15000) leadScore = "hot";
    
    const leadId = await ctx.db.insert("leads", {
      name: args.finalData.name,
      email: args.finalData.email,
      phone: args.finalData.phone,
      address: args.finalData.address,
      zipCode: args.finalData.zipCode,
      acreage: args.finalData.acreage || 0,
      selectedPackage: args.finalData.selectedPackage || "medium",
      obstacles: args.finalData.obstacles || [],
      leadScore,
      leadSource: "website",
      leadPage: partialLead?.pageUrl || "unknown",
      status: "new",
      estimatedTotal: args.estimateData?.estimatedTotal,
      pricePerAcre: args.estimateData?.pricePerAcre,
      travelSurcharge: args.estimateData?.travelSurcharge,
      assumptions: args.estimateData?.assumptions,
      utmSource: partialLead?.utmSource,
      utmMedium: partialLead?.utmMedium,
      utmCampaign: partialLead?.utmCampaign,
      referrer: partialLead?.referrer,
      createdAt: now,
      updatedAt: now,
    });
    
    // Mark partial as completed
    if (partialLead) {
      await ctx.db.patch(partialLead._id, {
        status: "completed",
        completedLeadId: leadId,
        updatedAt: now,
      });
    }
    
    // Create estimate if provided (TODO: fix estimates table)
    if (args.estimateData) {
      // TODO: Fix estimates API reference
      /*await ctx.runMutation("estimates:createEstimate", {
        leadId: leadId as string,
        acreage: args.finalData.acreage,
        packageType: args.finalData.selectedPackage,
        obstacles: args.finalData.obstacles || [],
        basePrice: args.estimateData.estimatedTotal - args.estimateData.travelSurcharge,
        travelSurcharge: args.estimateData.travelSurcharge,
        obstacleAdjustment: 0,
        totalPrice: args.estimateData.estimatedTotal,
        aiAssumptions: args.estimateData.assumptions,
        aiConfidence: 0.85, // Default AI confidence
      });*/
    }
    
    return { leadId, message: "Lead completed and estimate created" };
  },
});

// Get partial leads for abandonment follow-up
export const getPartialLeads = query({
  args: {
    minAge: v.optional(v.number()), // Minutes since last update
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("partialLeads");
    
    if (args.status) {
      query = query.filter((q) => q.eq(q.field("status"), args.status));
    } else {
      query = query.filter((q) => q.eq(q.field("status"), "partial"));
    }
    
    const partialLeads = await query.order("desc").collect();
    
    if (args.minAge) {
      const cutoff = Date.now() - (args.minAge * 60 * 1000);
      return partialLeads.filter(lead => lead.updatedAt < cutoff);
    }
    
    return partialLeads;
  },
});

// List leads with date range filtering for analytics
export const list = query({
  args: {
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
    status: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("leads");
    
    if (args.status) {
      query = query.filter((q) => q.eq(q.field("status"), args.status));
    }
    
    const leads = await query.order("desc").take(args.limit || 1000);
    
    // Filter by date range if provided
    if (args.startDate || args.endDate) {
      return leads.filter(lead => {
        if (args.startDate && lead.createdAt < args.startDate) return false;
        if (args.endDate && lead.createdAt > args.endDate) return false;
        return true;
      });
    }
    
    return leads;
  },
});

// Add notes to lead
export const addLeadNote = mutation({
  args: {
    id: v.id("leads"),
    note: v.string(),
  },
  handler: async (ctx, args) => {
    const lead = await ctx.db.get(args.id);
    if (!lead) throw new Error("Lead not found");
    
    const existingNotes = lead.notes || "";
    const timestamp = new Date().toLocaleDateString();
    const newNote = `[${timestamp}] ${args.note}`;
    const updatedNotes = existingNotes 
      ? `${existingNotes}\n\n${newNote}`
      : newNote;
    
    await ctx.db.patch(args.id, {
      notes: updatedNotes,
      updatedAt: Date.now(),
    });
    
    return args.id;
  },
});