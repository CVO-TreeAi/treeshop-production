import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Generate upload URL for media files
export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

// Save media file metadata after upload
export const saveMediaFile = mutation({
  args: {
    filename: v.string(),
    originalName: v.string(),
    mimeType: v.string(),
    size: v.number(),
    storageId: v.string(),
    width: v.optional(v.number()),
    height: v.optional(v.number()),
    alt: v.optional(v.string()),
    folder: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    uploadedBy: v.string(),
  },
  handler: async (ctx, args) => {
    const mediaId = await ctx.db.insert("mediaFiles", {
      filename: args.filename,
      originalName: args.originalName,
      mimeType: args.mimeType,
      size: args.size,
      storageId: args.storageId,
      width: args.width,
      height: args.height,
      alt: args.alt,
      folder: args.folder || "uploads",
      tags: args.tags || [],
      uploadedBy: args.uploadedBy,
      createdAt: Date.now(),
    });
    
    return mediaId;
  },
});

// Get media files
export const getMediaFiles = query({
  args: {
    folder: v.optional(v.string()),
    mimeType: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("mediaFiles");
    
    if (args.folder) {
      query = query.withIndex("by_folder", (q) => q.eq("folder", args.folder));
    }
    
    if (args.mimeType) {
      query = query.filter((q) => q.field("mimeType").startsWith(args.mimeType));
    }
    
    return await query
      .order("desc")
      .take(args.limit || 50);
  },
});

// Get media file by ID
export const getMediaFile = query({
  args: { id: v.id("mediaFiles") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get file URL from storage
export const getFileUrl = query({
  args: { storageId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

// Update media file metadata
export const updateMediaFile = mutation({
  args: {
    id: v.id("mediaFiles"),
    alt: v.optional(v.string()),
    folder: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    
    await ctx.db.patch(id, updates);
    return id;
  },
});

// Delete media file
export const deleteMediaFile = mutation({
  args: { id: v.id("mediaFiles") },
  handler: async (ctx, args) => {
    const media = await ctx.db.get(args.id);
    if (media) {
      // Delete from storage
      await ctx.storage.delete(media.storageId);
      // Delete from database
      await ctx.db.delete(args.id);
    }
    return args.id;
  },
});

// Search media files
export const searchMediaFiles = query({
  args: {
    searchTerm: v.string(),
    mimeType: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const files = await ctx.db.query("mediaFiles").collect();
    
    const searchLower = args.searchTerm.toLowerCase();
    
    return files
      .filter(file => {
        if (args.mimeType && !file.mimeType.startsWith(args.mimeType)) return false;
        
        return (
          file.filename.toLowerCase().includes(searchLower) ||
          file.originalName.toLowerCase().includes(searchLower) ||
          file.alt?.toLowerCase().includes(searchLower) ||
          file.tags?.some(tag => tag.toLowerCase().includes(searchLower))
        );
      })
      .sort((a, b) => b.createdAt - a.createdAt);
  },
});

// Get media folders
export const getMediaFolders = query({
  handler: async (ctx) => {
    const files = await ctx.db.query("mediaFiles").collect();
    const folders = [...new Set(files.map(file => file.folder).filter(Boolean))];
    return folders.sort();
  },
});