import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Store complete analytics snapshot from Google Analytics
export const storeAnalyticsSnapshot = mutation({
  args: {
    timestamp: v.number(),
    realtime: v.any(),
    today: v.any(),
    formEvents: v.any(),
    funnel: v.any(),
  },
  handler: async (ctx, args) => {
    // Store in a dedicated analytics table
    await ctx.db.insert("analyticsEvents", {
      eventName: "analytics_snapshot",
      siteSource: "admin_terminal",
      eventData: args,
      timestamp: new Date().toISOString(),
      createdAt: Date.now(),
    });
    
    // Keep only last 24 hours of snapshots
    const oldSnapshots = await ctx.db
      .query("analyticsSnapshots")
      .filter(q => q.lt(q.field("createdAt"), Date.now() - 24 * 60 * 60 * 1000))
      .collect();
    
    for (const snapshot of oldSnapshots) {
      await ctx.db.delete(snapshot._id);
    }
  },
});

// Get the latest analytics snapshot
export const getLatestAnalytics = query({
  args: {},
  handler: async (ctx) => {
    const latest = await ctx.db
      .query("analyticsSnapshots")
      .order("desc")
      .first();
    
    return latest;
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
    await ctx.db.insert("liveEvents", {
      ...args,
      createdAt: Date.now(),
    });
    
    // Keep only last 1000 events
    const oldEvents = await ctx.db
      .query("liveEvents")
      .order("desc")
      .collect();
    
    if (oldEvents.length > 1000) {
      const toDelete = oldEvents.slice(1000);
      for (const event of toDelete) {
        await ctx.db.delete(event._id);
      }
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
    
    const events = await ctx.db
      .query("liveEvents")
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
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }
  },
});

// Get conversion funnel stats
export const getConversionFunnel = query({
  args: {
    days: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const days = args.days || 30;
    const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
    
    // Get all events in time period
    const events = await ctx.db
      .query("liveEvents")
      .filter(q => q.gt(q.field("createdAt"), cutoff))
      .collect();
    
    // Count by event type
    const funnel = {
      pageViews: events.filter(e => e.eventName === "page_view").length,
      formStarts: events.filter(e => e.eventName === "form_start").length,
      formStep1: events.filter(e => e.eventName === "form_step_1").length,
      formStep2: events.filter(e => e.eventName === "form_step_2").length,
      formSubmits: events.filter(e => e.eventName === "form_submit").length,
      leads: await ctx.db
        .query("leads")
        .filter(q => q.gt(q.field("createdAt"), cutoff))
        .collect()
        .then(leads => leads.length),
    };
    
    return {
      funnel,
      conversionRate: funnel.pageViews > 0 
        ? ((funnel.leads / funnel.pageViews) * 100).toFixed(2)
        : 0,
      formCompletionRate: funnel.formStarts > 0
        ? ((funnel.formSubmits / funnel.formStarts) * 100).toFixed(2)
        : 0,
    };
  },
});