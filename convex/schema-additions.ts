// ADD THESE TABLES TO YOUR convex/schema.ts file:

// Analytics Snapshots from Google Analytics
analyticsSnapshots: defineTable({
  timestamp: v.number(),
  realtime: v.any(), // Real-time data
  today: v.any(), // Today's metrics
  formEvents: v.any(), // Form conversion events
  funnel: v.any(), // Funnel data
  createdAt: v.number(),
})
  .index("by_timestamp", ["timestamp"])
  .index("by_createdAt", ["createdAt"]),

// Live Events Stream
liveEvents: defineTable({
  eventName: v.string(),
  eventData: v.optional(v.any()),
  source: v.string(), // Website source
  url: v.optional(v.string()),
  timestamp: v.number(),
  sessionId: v.optional(v.string()),
  userId: v.optional(v.string()),
  createdAt: v.number(),
})
  .index("by_eventName", ["eventName"])
  .index("by_source", ["source"])
  .index("by_sessionId", ["sessionId"])
  .index("by_createdAt", ["createdAt"]),