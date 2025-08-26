import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Store analytics snapshot from Google Analytics
export const storeAnalyticsSnapshot = mutation({
  args: {
    timestamp: v.number(),
    realtime: v.any(),
    today: v.any(),
    formEvents: v.any(),
    funnel: v.any(),
  },
  handler: async (ctx, args) => {
    // Store in site settings as a workaround for now
    const existing = await ctx.db
      .query("siteSettings")
      .filter(q => q.eq(q.field("key"), "latestAnalytics"))
      .first();
    
    if (existing) {
      await ctx.db.patch(existing._id, {
        value: args,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("siteSettings", {
        key: "latestAnalytics",
        value: args,
        description: "Latest analytics snapshot from Google Analytics",
        updatedBy: "terminal-sync",
        updatedAt: Date.now(),
      });
    }
  },
});

// Get latest analytics snapshot
export const getLatestAnalytics = query({
  args: {},
  handler: async (ctx) => {
    const analytics = await ctx.db
      .query("siteSettings")
      .filter(q => q.eq(q.field("key"), "latestAnalytics"))
      .first();
    
    return analytics?.value || null;
  },
});

// Track live events from website
export const trackLiveEvent = mutation({
  args: {
    eventName: v.string(),
    eventData: v.optional(v.any()),
    source: v.string(),
    url: v.optional(v.string()),
    timestamp: v.number(),
    sessionId: v.optional(v.string()),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Store in analytics events table
    await ctx.db.insert("analyticsEvents", {
      eventName: args.eventName,
      siteSource: args.source,
      eventData: args.eventData,
      timestamp: new Date(args.timestamp).toISOString(),
      createdAt: Date.now(),
    });
    
    // Also store recent events in settings for quick access
    const recentEventsKey = "recentLiveEvents";
    const recentEvents = await ctx.db
      .query("siteSettings")
      .filter(q => q.eq(q.field("key"), recentEventsKey))
      .first();
    
    const newEvent = {
      ...args,
      createdAt: Date.now(),
    };
    
    let eventsList = [];
    if (recentEvents) {
      eventsList = recentEvents.value || [];
      eventsList.unshift(newEvent);
      eventsList = eventsList.slice(0, 100); // Keep last 100 events
      
      await ctx.db.patch(recentEvents._id, {
        value: eventsList,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("siteSettings", {
        key: recentEventsKey,
        value: [newEvent],
        description: "Recent live events stream",
        updatedBy: "terminal-sync",
        updatedAt: Date.now(),
      });
    }
  },
});

// Get recent live events
export const getLiveEvents = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 50;
    
    // Try to get from recent events cache first
    const recentEvents = await ctx.db
      .query("siteSettings")
      .filter(q => q.eq(q.field("key"), "recentLiveEvents"))
      .first();
    
    if (recentEvents?.value) {
      return recentEvents.value.slice(0, limit);
    }
    
    // Fallback to querying analytics events
    const events = await ctx.db
      .query("analyticsEvents")
      .order("desc")
      .take(limit);
    
    return events;
  },
});

// Process lead form events
export const processLeadEvent = mutation({
  args: {
    step: v.string(),
    formData: v.any(),
    sessionId: v.string(),
    source: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if we have a partial lead for this session
    const existingPartial = await ctx.db
      .query("partialLeads")
      .withIndex("by_sessionId", q => q.eq("sessionId", args.sessionId))
      .first();
    
    if (existingPartial) {
      // Update existing partial lead
      await ctx.db.patch(existingPartial._id, {
        formData: { ...existingPartial.formData, ...args.formData },
        step: args.step,
        pageUrl: args.source,
        updatedAt: Date.now(),
      });
    } else {
      // Create new partial lead
      await ctx.db.insert("partialLeads", {
        sessionId: args.sessionId,
        formData: args.formData,
        pageUrl: args.source,
        step: args.step,
        status: "partial",
        utmSource: args.source,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }
  },
});

// Get conversion funnel statistics
export const getConversionFunnel = query({
  args: {
    days: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const days = args.days || 30;
    const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
    
    // Get all events in time period
    const events = await ctx.db
      .query("analyticsEvents")
      .filter(q => q.gt(q.field("createdAt"), cutoff))
      .collect();
    
    // Get leads in time period
    const leads = await ctx.db
      .query("leads")
      .filter(q => q.gt(q.field("createdAt"), cutoff))
      .collect();
    
    // Count by event type
    const funnel = {
      pageViews: events.filter(e => e.eventName === "page_view").length,
      formStarts: events.filter(e => e.eventName === "form_start").length,
      formStep1: events.filter(e => e.eventName === "form_step_1").length,
      formStep2: events.filter(e => e.eventName === "form_step_2").length,
      formSubmits: events.filter(e => e.eventName === "form_submit").length,
      leads: leads.length,
    };
    
    return {
      funnel,
      conversionRate: funnel.pageViews > 0 
        ? ((funnel.leads / funnel.pageViews) * 100).toFixed(2)
        : "0",
      formCompletionRate: funnel.formStarts > 0
        ? ((funnel.formSubmits / funnel.formStarts) * 100).toFixed(2)
        : "0",
    };
  },
});