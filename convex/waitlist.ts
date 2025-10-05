import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create new waitlist signup
export const addWaitlistSignup = mutation({
  args: {
    companyName: v.string(),
    email: v.string(),
    phone: v.string(),
    currentRevenue: v.string(),
    operationsChallenges: v.optional(v.string()),
    source: v.optional(v.string()),
    utmSource: v.optional(v.string()),
    utmMedium: v.optional(v.string()),
    utmCampaign: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Check if email already exists
    const existingSignup = await ctx.db
      .query("waitlist")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existingSignup) {
      throw new Error("Email already registered for waitlist");
    }

    // Determine if they qualify for founding member status
    // First 100 signups get founding member status
    const currentSignupCount = await ctx.db
      .query("waitlist")
      .collect()
      .then(signups => signups.length);

    const foundingMember = currentSignupCount < 100;

    // Create waitlist entry
    const waitlistId = await ctx.db.insert("waitlist", {
      companyName: args.companyName,
      email: args.email,
      phone: args.phone,
      currentRevenue: args.currentRevenue,
      operationsChallenges: args.operationsChallenges,
      foundingMember,
      signupDate: now,
      interestedInUpdates: true,
      interestedInBeta: true,
      source: args.source || 'tech-page',
      utmSource: args.utmSource,
      utmMedium: args.utmMedium,
      utmCampaign: args.utmCampaign,
      status: 'active',
      createdAt: now,
      updatedAt: now,
    });

    // Create notification to send email
    await ctx.db.insert("notifications", {
      leadId: waitlistId as any, // Using waitlistId as leadId for notifications
      type: 'waitlist_signup',
      recipientEmail: 'office@fltreeshop.com',
      subject: `New TreeAI Waitlist Signup: ${args.companyName}`,
      status: 'pending',
      data: {
        companyName: args.companyName,
        email: args.email,
        phone: args.phone,
        currentRevenue: args.currentRevenue,
        operationsChallenges: args.operationsChallenges,
        foundingMember,
        signupNumber: currentSignupCount + 1,
        source: args.source || 'tech-page'
      },
      createdAt: now,
      updatedAt: now,
    });

    return {
      success: true,
      waitlistId,
      foundingMember,
      signupNumber: currentSignupCount + 1,
      spotsRemaining: foundingMember ? 100 - (currentSignupCount + 1) : null
    };
  },
});

// Get waitlist statistics
export const getWaitlistStats = query({
  handler: async (ctx) => {
    const signups = await ctx.db.query("waitlist").collect();

    const foundingMembers = signups.filter(s => s.foundingMember).length;
    const totalSignups = signups.length;
    const foundingSpotsRemaining = Math.max(0, 100 - foundingMembers);

    const revenueBreakdown = {
      'under-250k': 0,
      '250k-500k': 0,
      '500k-1m': 0,
      '1m-plus': 0
    };

    signups.forEach(signup => {
      if (signup.currentRevenue in revenueBreakdown) {
        revenueBreakdown[signup.currentRevenue as keyof typeof revenueBreakdown]++;
      }
    });

    return {
      totalSignups,
      foundingMembers,
      foundingSpotsRemaining,
      revenueBreakdown,
      mostRecentSignup: signups.sort((a, b) => b.createdAt - a.createdAt)[0]
    };
  },
});

// Get all waitlist signups (for admin)
export const getAllWaitlistSignups = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("waitlist")
      .withIndex("by_createdAt")
      .order("desc")
      .collect();
  },
});

// Update waitlist signup status
export const updateWaitlistStatus = mutation({
  args: {
    waitlistId: v.id("waitlist"),
    status: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    await ctx.db.patch(args.waitlistId, {
      status: args.status,
      notes: args.notes,
      contactedAt: args.status === 'contacted' ? now : undefined,
      updatedAt: now,
    });

    return { success: true };
  },
});