import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create estimate for a lead
export const createEstimate = mutation({
  args: {
    leadId: v.string(),
    acreage: v.number(),
    packageType: v.string(),
    obstacles: v.array(v.string()),
    basePrice: v.number(),
    travelSurcharge: v.number(),
    obstacleAdjustment: v.number(),
    totalPrice: v.number(),
    aiConfidence: v.optional(v.number()),
    aiAssumptions: v.optional(v.array(v.string())),
    estimatedDays: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const estimateId = await ctx.db.insert("estimates", {
      leadId: args.leadId,
      acreage: args.acreage,
      packageType: args.packageType,
      obstacles: args.obstacles,
      basePrice: args.basePrice,
      travelSurcharge: args.travelSurcharge,
      obstacleAdjustment: args.obstacleAdjustment,
      totalPrice: args.totalPrice,
      aiConfidence: args.aiConfidence,
      aiAssumptions: args.aiAssumptions,
      estimatedDays: args.estimatedDays,
      proposalSent: false,
      depositPaid: false,
      status: "draft",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    
    // Update lead with estimate total
    const leadId = ctx.db.normalizeId("leads", args.leadId);
    if (leadId) {
      await ctx.db.patch(leadId, {
        estimatedTotal: args.totalPrice,
        updatedAt: Date.now(),
      });
    }
    
    return estimateId;
  },
});

// Send proposal
export const sendProposal = mutation({
  args: {
    id: v.id("estimates"),
    startDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      proposalSent: true,
      status: "sent",
      startDate: args.startDate,
      updatedAt: Date.now(),
    });
    
    return args.id;
  },
});

// Accept proposal
export const acceptProposal = mutation({
  args: {
    id: v.id("estimates"),
    depositAmount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const estimate = await ctx.db.get(args.id);
    if (!estimate) throw new Error("Estimate not found");
    
    await ctx.db.patch(args.id, {
      proposalAccepted: true,
      status: "accepted",
      depositAmount: args.depositAmount,
      updatedAt: Date.now(),
    });
    
    // Update lead status
    const leadId = ctx.db.normalizeId("leads", estimate.leadId);
    if (leadId) {
      await ctx.db.patch(leadId, {
        status: "won",
        updatedAt: Date.now(),
      });
    }
    
    return args.id;
  },
});

// Mark deposit as paid
export const markDepositPaid = mutation({
  args: {
    id: v.id("estimates"),
    depositAmount: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      depositPaid: true,
      depositAmount: args.depositAmount,
      status: "deposit_paid",
      updatedAt: Date.now(),
    });
    
    return args.id;
  },
});

// Get estimate by lead ID
export const getEstimateByLeadId = query({
  args: { leadId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("estimates")
      .withIndex("by_leadId", (q) => q.eq("leadId", args.leadId))
      .first();
  },
});

// Get estimates by status
export const getEstimatesByStatus = query({
  args: {
    status: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("estimates")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .order("desc")
      .take(args.limit || 25);
  },
});

// Calculate estimate using DBH packages
export const calculateEstimate = mutation({
  args: {
    acreage: v.number(),
    packageType: v.string(),
    obstacles: v.array(v.string()),
    zipCode: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // DBH Package pricing
    const packages = {
      small: { dbh: '4"', pricePerAcre: 2150 },
      medium: { dbh: '6"', pricePerAcre: 2500 },
      large: { dbh: '8"', pricePerAcre: 3140 },
      xlarge: { dbh: '10"', pricePerAcre: 4160 },
    };
    
    const packageInfo = packages[args.packageType as keyof typeof packages] || packages.medium;
    const basePrice = args.acreage * packageInfo.pricePerAcre;
    
    // Travel calculation (simplified)
    let travelSurcharge = 0;
    if (args.zipCode) {
      // Central Florida base, add surcharge for distance
      // This would be enhanced with actual distance calculation
      const distanceZips = ['32601', '32608', '34711', '34736', '33881'];
      if (distanceZips.includes(args.zipCode)) {
        travelSurcharge = basePrice * 0.15; // 15% surcharge for distant areas
      }
    }
    
    // Obstacle adjustment
    const obstacleAdjustment = basePrice * (args.obstacles.length * 0.05); // 5% per obstacle
    
    const totalPrice = basePrice + travelSurcharge + obstacleAdjustment;
    
    // Estimate timeline (acres per day by package)
    const productivity = {
      small: 5,
      medium: 4, 
      large: 3,
      xlarge: 2,
    };
    
    const estimatedDays = Math.max(1, Math.ceil(args.acreage / productivity[args.packageType as keyof typeof productivity]));
    
    return {
      basePrice,
      travelSurcharge,
      obstacleAdjustment,
      totalPrice: Math.round(totalPrice),
      estimatedDays,
      packageInfo,
    };
  },
});