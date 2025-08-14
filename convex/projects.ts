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
        title: "Avon Park Land Clearing - Before",
        description: "Dense vegetation requiring professional forestry mulching services",
        imageUrl: "https://raw.githubusercontent.com/CVO-TreeAi/treeshop-production/main/public/project-images/avon-park-land-clearing-before-dense-vegetation.jpg",
        category: "before",
        featured: true,
        acreage: 8,
        location: "Avon Park, FL",
        status: "active",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        title: "Avon Park Land Clearing - After",
        description: "Professional forestry mulching results - land ready for development",
        imageUrl: "https://raw.githubusercontent.com/CVO-TreeAi/treeshop-production/main/public/project-images/avon-park-land-clearing-after-forestry-mulching.jpg",
        category: "after",
        featured: true,
        acreage: 8,
        location: "Avon Park, FL",
        status: "active",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        title: "CAT 265 Fecon Blackhawk",
        description: "Our precision forestry mulching equipment delivering professional results",
        imageUrl: "https://raw.githubusercontent.com/CVO-TreeAi/treeshop-production/main/public/project-images/cat-265-fecon-blackhawk-fueling.jpg",
        category: "equipment",
        featured: true,
        status: "active",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        title: "Lehigh Acres - Before Clearing",
        description: "Thick undergrowth removal project in Southwest Florida",
        imageUrl: "https://raw.githubusercontent.com/CVO-TreeAi/treeshop-production/main/public/project-images/lehigh-acres-land-clearing-before-thick-undergrowth.jpg",
        category: "before",
        featured: true,
        acreage: 12,
        location: "Lehigh Acres, FL",
        status: "active",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        title: "Lehigh Acres - Professional Results",
        description: "Complete land transformation after professional mulching service",
        imageUrl: "https://raw.githubusercontent.com/CVO-TreeAi/treeshop-production/main/public/project-images/lehigh-acres-land-clearing-after-professional-mulching.jpg",
        category: "after",
        featured: true,
        acreage: 12,
        location: "Lehigh Acres, FL",
        status: "active",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        title: "Okeechobee Forest Clearing - Before",
        description: "Dense forest undergrowth before professional forestry mulching",
        imageUrl: "https://raw.githubusercontent.com/CVO-TreeAi/treeshop-production/main/public/project-images/okeechobee-land-clearing-before-dense-forest-undergrowth.jpg",
        category: "before",
        featured: true,
        acreage: 20,
        location: "Okeechobee, FL",
        status: "active",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        title: "Okeechobee Forest Clearing - Complete",
        description: "Pristine cleared land ready for agricultural or development use",
        imageUrl: "https://raw.githubusercontent.com/CVO-TreeAi/treeshop-production/main/public/project-images/okeechobee-land-clearing-after-forestry-mulching-complete.jpg",
        category: "after",
        featured: true,
        acreage: 20,
        location: "Okeechobee, FL",
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

// Clear all projects (useful for reseeding)
export const clearProjects = mutation({
  args: {},
  handler: async (ctx) => {
    const projects = await ctx.db.query("projects").collect();
    for (const project of projects) {
      await ctx.db.delete(project._id);
    }
    return { success: true, deleted: projects.length };
  },
});