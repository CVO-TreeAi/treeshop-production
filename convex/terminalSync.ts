import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Multi-site lead syncing for Terminal dashboard
export const syncLeadsToTerminal = query({
  args: {},
  handler: async (ctx) => {
    const leads = await ctx.db.query("leads").order("desc").take(100);
    const partialLeads = await ctx.db.query("partialLeads")
      .filter(q => q.eq(q.field("status"), "partial"))
      .take(50);

    // Add site source to leads (can be expanded when multiple sites are tracked)
    const leadsWithSource = leads.map(lead => ({
      ...lead,
      siteSource: lead.siteSource || 'fltreeshop.com' // Default to main site
    }));

    return {
      completedLeads: leadsWithSource,
      partialLeads: partialLeads,
      stats: {
        total: leads.length,
        thisMonth: leads.filter(l => {
          const leadDate = new Date(l.createdAt);
          const now = new Date();
          return leadDate.getMonth() === now.getMonth() &&
                 leadDate.getFullYear() === now.getFullYear();
        }).length,
        converted: leads.filter(l => l.status === "converted").length,
      }
    };
  },
});

// Get stats per site for multi-site dashboard
export const getSiteStats = query({
  args: {},
  handler: async (ctx) => {
    const leads = await ctx.db.query("leads").collect();

    // Group leads by site source
    const siteStats = {
      'fltreeshop.com': {
        totalLeads: 0,
        monthlyLeads: 0,
        conversionRate: 0,
      },
      'treeshop.app': {
        totalLeads: 0,
        monthlyLeads: 0,
        conversionRate: 0,
      }
    };

    const now = new Date();
    
    leads.forEach(lead => {
      const source = lead.siteSource || 'fltreeshop.com';
      if (siteStats[source]) {
        siteStats[source].totalLeads++;
        
        const leadDate = new Date(lead.createdAt);
        if (leadDate.getMonth() === now.getMonth() && 
            leadDate.getFullYear() === now.getFullYear()) {
          siteStats[source].monthlyLeads++;
        }
      }
    });

    // Calculate conversion rates
    Object.keys(siteStats).forEach(site => {
      const stats = siteStats[site];
      const converted = leads.filter(l => 
        (l.siteSource || 'fltreeshop.com') === site && 
        l.status === 'converted'
      ).length;
      
      stats.conversionRate = stats.totalLeads > 0 
        ? (converted / stats.totalLeads) * 100 
        : 0;
    });

    return {
      totalLeads: leads.length,
      avgQuoteValue: 0, // Add quote calculation when available
      conversionRate: 0,
      perSite: siteStats,
    };
  },
});

// Track multi-site analytics events
export const trackAnalyticsEvent = mutation({
  args: {
    eventName: v.string(),
    siteSource: v.string(),
    eventData: v.optional(v.any()),
    timestamp: v.string(),
  },
  handler: async (ctx, args) => {
    // Store analytics event for terminal tracking
    await ctx.db.insert("analyticsEvents", {
      eventName: args.eventName,
      siteSource: args.siteSource,
      eventData: args.eventData,
      timestamp: args.timestamp,
      createdAt: Date.now(),
    });
  },
});

// Get multi-site analytics for terminal
export const getMultiSiteAnalytics = query({
  args: {
    timeRange: v.optional(v.string()), // "day", "week", "month"
  },
  handler: async (ctx, args) => {
    const timeRange = args.timeRange || "week";
    const now = Date.now();
    let startTime = now;

    switch(timeRange) {
      case "day":
        startTime = now - (24 * 60 * 60 * 1000);
        break;
      case "week":
        startTime = now - (7 * 24 * 60 * 60 * 1000);
        break;
      case "month":
        startTime = now - (30 * 24 * 60 * 60 * 1000);
        break;
    }

    const events = await ctx.db
      .query("analyticsEvents")
      .filter(q => q.gte(q.field("createdAt"), startTime))
      .collect();

    // Group events by site
    const siteEvents = {};
    events.forEach(event => {
      if (!siteEvents[event.siteSource]) {
        siteEvents[event.siteSource] = [];
      }
      siteEvents[event.siteSource].push(event);
    });

    return {
      totalEvents: events.length,
      eventsBySite: siteEvents,
      timeRange: timeRange,
    };
  },
});

// Get multi-site statistics (for Sites page)
export const getMultiSiteStats = query({
  args: {},
  handler: async (ctx) => {
    const leads = await ctx.db.query("leads").collect();
    const events = await ctx.db.query("analyticsEvents").collect();
    
    // Group by source
    const siteStats = {
      'fltreeshop.com': {
        leads: leads.filter(l => !l.siteSource || l.siteSource === 'fltreeshop.com').length,
        events: events.filter(e => e.siteSource === 'fltreeshop.com').length,
      },
      'treeshop.app': {
        leads: leads.filter(l => l.siteSource === 'treeshop.app').length,
        events: events.filter(e => e.siteSource === 'treeshop.app').length,
      }
    };
    
    return {
      combined: {
        totalLeads: leads.length,
        totalEvents: events.length,
      },
      bySite: siteStats
    };
  },
});

// Create a new lead (used when contact info is first entered)
export const createLead = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    address: v.string(),
    acreage: v.string(),
    selectedPackage: v.string(),
    message: v.optional(v.string()),
    source: v.string(),
    status: v.string(),
    createdAt: v.number(),
  },
  handler: async (ctx, args) => {
    // Create lead in database
    const leadId = await ctx.db.insert("leads", {
      name: args.name,
      email: args.email,
      phone: args.phone,
      address: args.address,
      acreage: parseFloat(args.acreage) || 0,
      selectedPackage: args.selectedPackage,
      message: args.message || "",
      siteSource: args.source,
      status: args.status,
      createdAt: args.createdAt,
      updatedAt: args.createdAt,
      leadSource: args.source === 'treeshop.app' ? 'website_estimate_v3' : 'website',
    });

    return { id: leadId, success: true };
  },
});

// Update an existing lead with pricing information
export const updateLead = mutation({
  args: {
    leadId: v.optional(v.string()),
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    address: v.string(),
    acreage: v.string(),
    selectedPackage: v.string(),
    estimatedPrice: v.optional(v.number()),
    message: v.optional(v.string()),
    source: v.string(),
    status: v.string(),
    pricingType: v.optional(v.string()),
    updatedAt: v.number(),
  },
  handler: async (ctx, args) => {
    // Find existing lead by email or create new one
    let lead = await ctx.db
      .query("leads")
      .filter(q => q.eq(q.field("email"), args.email))
      .first();

    if (lead) {
      // Update existing lead
      await ctx.db.patch(lead._id, {
        name: args.name,
        phone: args.phone,
        address: args.address,
        acreage: parseFloat(args.acreage) || 0,
        selectedPackage: args.selectedPackage,
        estimatedTotal: args.estimatedPrice,
        message: args.message || "",
        status: args.status,
        updatedAt: args.updatedAt,
      });
      return { id: lead._id, success: true };
    } else {
      // Create new lead if not found
      const leadId = await ctx.db.insert("leads", {
        name: args.name,
        email: args.email,
        phone: args.phone,
        address: args.address,
        acreage: parseFloat(args.acreage) || 0,
        selectedPackage: args.selectedPackage,
        estimatedTotal: args.estimatedPrice,
        message: args.message || "",
        siteSource: args.source,
        status: args.status,
        createdAt: args.updatedAt,
        updatedAt: args.updatedAt,
        leadSource: args.source === 'treeshop.app' ? 'website_estimate_v3' : 'website',
      });
      return { id: leadId, success: true };
    }
  },
});