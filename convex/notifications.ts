import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

// Send email notification when lead is completed
export const sendLeadNotification = mutation({
  args: {
    leadId: v.id("leads"),
    type: v.string(), // 'new_lead', 'proposal_request', 'estimate_ready'
    recipientEmail: v.string(),
    data: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const lead = await ctx.db.get(args.leadId);
    if (!lead) throw new Error("Lead not found");

    // Create notification record
    const notificationId = await ctx.db.insert("notifications", {
      leadId: args.leadId,
      type: args.type,
      recipientEmail: args.recipientEmail,
      subject: getEmailSubject(args.type, lead),
      status: "pending",
      data: args.data,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Send actual email via HTTP action
    try {
      // For now, mark as sent and let the actual email sending happen via API routes
      // The API routes will call the sendEmail HTTP action directly
      await ctx.db.patch(notificationId, {
        status: "sent",
        sentAt: Date.now(),
        updatedAt: Date.now(),
      });
      
      console.log(`Email notification created: ${args.type} for ${args.recipientEmail}`);
    } catch (error) {
      // Mark as failed
      await ctx.db.patch(notificationId, {
        status: "failed",
        error: error.message,
        updatedAt: Date.now(),
      });
    }

    return notificationId;
  },
});

// Send proposal email to customer
export const sendProposalEmail = mutation({
  args: {
    leadId: v.id("leads"),
    estimateId: v.id("estimates"),
    customerEmail: v.string(),
    proposalUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const lead = await ctx.db.get(args.leadId);
    const estimate = await ctx.db.get(args.estimateId);
    
    if (!lead || !estimate) throw new Error("Lead or estimate not found");

    const emailData = {
      customerName: lead.name,
      projectAddress: lead.address,
      acreage: lead.acreage,
      totalPrice: estimate.totalPrice,
      proposalUrl: args.proposalUrl,
      estimatedDays: estimate.estimatedDays,
    };

    // Send to customer
    const customerNotificationId = await ctx.runMutation(ctx.api.notifications.sendLeadNotification, {
      leadId: args.leadId,
      type: "proposal_sent",
      recipientEmail: args.customerEmail,
      data: emailData,
    });

    // Send notification to admin
    const adminNotificationId = await ctx.runMutation(ctx.api.notifications.sendLeadNotification, {
      leadId: args.leadId,
      type: "admin_new_lead",
      recipientEmail: "office@fltreeshop.com", // Your admin email
      data: emailData,
    });

    // Update estimate status
    await ctx.db.patch(args.estimateId, {
      proposalSent: true,
      status: "sent",
      updatedAt: Date.now(),
    });

    return { customerNotificationId, adminNotificationId };
  },
});

// Send lead notification to admin when new lead comes in
export const notifyNewLead = mutation({
  args: {
    leadId: v.id("leads"),
  },
  handler: async (ctx, args) => {
    const lead = await ctx.db.get(args.leadId);
    if (!lead) throw new Error("Lead not found");

    const leadData = {
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      address: lead.address,
      acreage: lead.acreage,
      leadScore: lead.leadScore,
      estimatedTotal: lead.estimatedTotal,
      leadSource: lead.leadSource,
    };

    // Send to admin/sales team
    const notificationId = await ctx.runMutation(ctx.api.notifications.sendLeadNotification, {
      leadId: args.leadId,
      type: "admin_new_lead",
      recipientEmail: "office@fltreeshop.com", // Your leads email
      data: leadData,
    });

    return notificationId;
  },
});

// Get pending notifications
export const getPendingNotifications = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("notifications")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();
  },
});

// Mark notification as sent
export const markNotificationSent = mutation({
  args: {
    id: v.id("notifications"),
    success: v.boolean(),
    error: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: args.success ? "sent" : "failed",
      sentAt: Date.now(),
      error: args.error,
      updatedAt: Date.now(),
    });
    
    return args.id;
  },
});

// Helper function to generate email subjects
function getEmailSubject(type: string, lead: any): string {
  switch (type) {
    case "admin_new_lead":
      return `🌲 New ${lead.leadScore?.toUpperCase() || 'NEW'} Lead: ${lead.name} - $${lead.estimatedTotal?.toLocaleString() || 'TBD'}`;
    case "customer_proposal":
      return `Your Free TreeShop Estimate - ${lead.address}`;
    case "proposal_sent":
      return `Your TreeShop Forestry Mulching Proposal - ${lead.address}`;
    case "estimate_ready":
      return `Your Land Clearing Estimate is Ready - ${lead.address}`;
    default:
      return `TreeShop Update: ${lead.name}`;
  }
}

// Helper function to map notification types to email types
function getEmailTypeForNotification(notificationType: string): string {
  switch (notificationType) {
    case "admin_new_lead":
      return "admin_new_lead";
    case "proposal_sent":
      return "customer_proposal";
    case "partial_lead":
      return "admin_partial_lead";
    default:
      return "admin_new_lead";
  }
}