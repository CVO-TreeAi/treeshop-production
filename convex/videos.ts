import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Query to get featured videos for homepage
export const getFeaturedVideos = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const videos = await ctx.db
      .query("videos")
      .withIndex("by_featured", (q) => q.eq("featured", true))
      .filter((q) => q.eq(q.field("status"), "active"))
      .order("desc")
      .take(args.limit || 6);
    
    return videos;
  },
});

// Query to get videos by category
export const getVideosByCategory = query({
  args: { 
    category: v.string(),
    limit: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    const videos = await ctx.db
      .query("videos")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .filter((q) => q.eq(q.field("status"), "active"))
      .order("desc")
      .take(args.limit || 12);
    
    return videos;
  },
});

// Seed some sample videos for immediate deployment
export const seedVideos = mutation({
  args: {},
  handler: async (ctx) => {
    const sampleVideos = [
      {
        title: "Forestry Mulching in Action",
        description: "Watch our advanced forestry mulching equipment clear 5 acres in Central Florida",
        videoId: "dQw4w9WgXcQ", // Placeholder YouTube ID
        category: "forestry-mulching",
        featured: true,
        duration: "3:45",
        status: "active",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        title: "Before & After: 10 Acre Project",
        description: "Complete transformation of overgrown property to usable land",
        videoId: "dQw4w9WgXcQ", // Placeholder YouTube ID
        category: "before-after",
        featured: true,
        duration: "2:30",
        status: "active",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        title: "Precision Land Clearing",
        description: "Selective clearing preserving valuable trees while removing undergrowth",
        videoId: "dQw4w9WgXcQ", // Placeholder YouTube ID
        category: "land-clearing",
        featured: true,
        duration: "4:15",
        status: "active",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }
    ];

    for (const video of sampleVideos) {
      await ctx.db.insert("videos", video);
    }

    return { success: true, count: sampleVideos.length };
  },
});