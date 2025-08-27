import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create a new lead
export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    address: v.string(),
    zipCode: v.optional(v.string()),
    acreage: v.number(),
    selectedPackage: v.string(),
    obstacles: v.array(v.string()),
    leadScore: v.string(),
    leadSource: v.string(),
    leadPage: v.string(),
    siteSource: v.optional(v.string()),
    status: v.string(),
    notes: v.optional(v.string()),
    estimatedTotal: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  },
  handler: async (ctx, args) => {
    const leadId = await ctx.db.insert("leads", {
      name: args.name,
      email: args.email,
      phone: args.phone,
      address: args.address,
      zipCode: args.zipCode,
      acreage: args.acreage,
      selectedPackage: args.selectedPackage,
      obstacles: args.obstacles,
      leadScore: args.leadScore,
      leadSource: args.leadSource,
      leadPage: args.leadPage,
      siteSource: args.siteSource,
      status: args.status,
      notes: args.notes,
      estimatedTotal: args.estimatedTotal,
      createdAt: args.createdAt,
      updatedAt: args.updatedAt,
    });
    
    return { id: leadId, success: true };
  },
});

// Update an existing lead
export const update = mutation({
  args: {
    id: v.id("leads"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    zipCode: v.optional(v.string()),
    acreage: v.optional(v.number()),
    selectedPackage: v.optional(v.string()),
    obstacles: v.optional(v.array(v.string())),
    status: v.optional(v.string()),
    notes: v.optional(v.string()),
    estimatedTotal: v.optional(v.number()),
    updatedAt: v.number(),
  },
  handler: async (ctx, args) => {
    const { id, updatedAt, ...updateData } = args;
    
    await ctx.db.patch(id, {
      ...updateData,
      updatedAt,
    });
    
    return { success: true };
  },
});

// Get lead by email (for finding existing leads)
export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("leads")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

// Get all leads
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("leads").order("desc").collect();
  },
});