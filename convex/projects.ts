import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Query to get featured project images for homepage
export const getFeaturedProjects = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const projects = await ctx.db
      .query("projects")
      .withIndex("by_featured", (q) => q.eq("featured", true))
      .filter((q) => q.eq(q.field("status"), "active"))
      .order("desc")
      .take(args.limit || 8);
    
    return projects;
  },
});

// Query to get projects by category
export const getProjectsByCategory = query({
  args: { 
    category: v.string(),
    limit: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    const projects = await ctx.db
      .query("projects")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .filter((q) => q.eq(q.field("status"), "active"))
      .order("desc")
      .take(args.limit || 12);
    
    return projects;
  },
});

// Seed some sample project images for immediate deployment
export const seedProjects = mutation({
  args: {},
  handler: async (ctx) => {
    const sampleProjects = [
      {
        title: "15 Acre Forestry Mulching",
        description: "Complete land clearing and forestry mulching project in Orange County",
        imageUrl: "/treeshop/images/projects/avon-park-land-clearing-before-dense-vegetation.jpg",
        category: "before",
        featured: true,
        acreage: 15,
        location: "Orange County, FL",
        status: "active",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        title: "Cleared and Ready for Development",
        description: "Same 15 acre property after professional forestry mulching",
        imageUrl: "/treeshop/images/projects/avon-park-land-clearing-after-forestry-mulching.jpg",
        category: "after",
        featured: true,
        acreage: 15,
        location: "Orange County, FL",
        status: "active",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        title: "Precision Equipment",
        description: "Our state-of-the-art forestry mulching equipment in action",
        imageUrl: "/treeshop/images/equipment/cat-265-fecon-blackhawk-fueling.jpg",
        category: "equipment",
        featured: true,
        status: "active",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        title: "5 Acre Residential Project",
        description: "Overgrown residential property before clearing",
        imageUrl: "/treeshop/images/projects/okeechobee-land-clearing-before-dense-forest-undergrowth.jpg",
        category: "before",
        featured: true,
        acreage: 5,
        location: "Seminole County, FL",
        status: "active",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }
    ];

    for (const project of sampleProjects) {
      await ctx.db.insert("projects", project);
    }

    return { success: true, count: sampleProjects.length };
  },
});