import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new blog post
export const createBlogPost = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    content: v.string(),
    excerpt: v.optional(v.string()),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    keywords: v.optional(v.array(v.string())),
    featuredImage: v.optional(v.string()),
    featuredImageAlt: v.optional(v.string()),
    category: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    authorName: v.string(),
    status: v.optional(v.string()), // 'draft', 'review', 'published'
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    // Check if slug already exists
    const existing = await ctx.db
      .query("blogPosts")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    
    if (existing) {
      throw new Error("A post with this slug already exists");
    }
    
    const postId = await ctx.db.insert("blogPosts", {
      title: args.title,
      slug: args.slug,
      content: args.content,
      excerpt: args.excerpt,
      metaTitle: args.metaTitle || args.title,
      metaDescription: args.metaDescription || args.excerpt,
      keywords: args.keywords || [],
      featuredImage: args.featuredImage,
      featuredImageAlt: args.featuredImageAlt,
      category: args.category,
      tags: args.tags || [],
      authorName: args.authorName,
      status: args.status || "draft",
      viewCount: 0,
      createdAt: now,
      updatedAt: now,
    });
    
    return postId;
  },
});

// Update blog post
export const updateBlogPost = mutation({
  args: {
    id: v.id("blogPosts"),
    title: v.optional(v.string()),
    slug: v.optional(v.string()),
    content: v.optional(v.string()),
    excerpt: v.optional(v.string()),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    keywords: v.optional(v.array(v.string())),
    featuredImage: v.optional(v.string()),
    featuredImageAlt: v.optional(v.string()),
    category: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    
    // If updating slug, check uniqueness
    if (updates.slug) {
      const existing = await ctx.db
        .query("blogPosts")
        .withIndex("by_slug", (q) => q.eq("slug", updates.slug))
        .first();
      
      if (existing && existing._id !== id) {
        throw new Error("A post with this slug already exists");
      }
    }
    
    // If publishing for the first time, set publishedAt
    if (updates.status === "published") {
      const post = await ctx.db.get(id);
      if (post && post.status !== "published") {
        updates.publishedAt = Date.now();
      }
    }
    
    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
    
    return id;
  },
});

// Get published blog posts for public site
export const getPublishedPosts = query({
  args: {
    category: v.optional(v.string()),
    tag: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("blogPosts")
      .withIndex("by_status", (q) => q.eq("status", "published"));
    
    if (args.category) {
      query = query.filter((q) => q.eq(q.field("category"), args.category));
    }
    
    if (args.tag) {
      query = query.filter((q) => 
        q.field("tags").some((tag) => q.eq(tag, args.tag))
      );
    }
    
    return await query
      .order("desc")
      .take(args.limit || 10);
  },
});

// Get blog post by slug
export const getPostBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("blogPosts")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

// Get blog posts (alias for getAllPosts - used by API)
export const getBlogPosts = query({
  args: {
    status: v.optional(v.string()),
    category: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("blogPosts");
    
    if (args.status) {
      query = query.withIndex("by_status", (q) => q.eq("status", args.status));
    }
    
    if (args.category) {
      query = query.filter((q) => q.eq(q.field("category"), args.category));
    }
    
    return await query
      .order("desc")
      .take(args.limit || 50);
  },
});

// Get all posts for admin (any status)
export const getAllPosts = query({
  args: {
    status: v.optional(v.string()),
    category: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("blogPosts");
    
    if (args.status) {
      query = query.withIndex("by_status", (q) => q.eq("status", args.status));
    }
    
    if (args.category) {
      query = query.filter((q) => q.eq(q.field("category"), args.category));
    }
    
    return await query
      .order("desc")
      .take(args.limit || 50);
  },
});

// Increment view count
export const incrementViewCount = mutation({
  args: { id: v.id("blogPosts") },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.id);
    if (post) {
      await ctx.db.patch(args.id, {
        viewCount: (post.viewCount || 0) + 1,
      });
    }
    return args.id;
  },
});

// Delete blog post
export const deleteBlogPost = mutation({
  args: { id: v.id("blogPosts") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return args.id;
  },
});

// Get blog categories and tags for filters
export const getBlogMetadata = query({
  handler: async (ctx) => {
    const posts = await ctx.db.query("blogPosts").collect();
    
    const categories = [...new Set(posts
      .map(post => post.category)
      .filter(Boolean)
    )];
    
    const tags = [...new Set(posts
      .flatMap(post => post.tags || [])
    )];
    
    return { categories, tags };
  },
});

// Search blog posts
export const searchPosts = query({
  args: {
    searchTerm: v.string(),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const posts = await ctx.db.query("blogPosts").collect();
    
    const searchLower = args.searchTerm.toLowerCase();
    
    return posts
      .filter(post => {
        if (args.status && post.status !== args.status) return false;
        
        return (
          post.title.toLowerCase().includes(searchLower) ||
          post.content.toLowerCase().includes(searchLower) ||
          post.excerpt?.toLowerCase().includes(searchLower) ||
          post.tags?.some(tag => tag.toLowerCase().includes(searchLower))
        );
      })
      .sort((a, b) => b.createdAt - a.createdAt);
  },
});