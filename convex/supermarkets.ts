import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all supermarkets
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("supermarkets").collect();
  },
});

// Get a single supermarket
export const get = query({
  args: { id: v.id("supermarkets") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Create a new supermarket
export const create = mutation({
  args: {
    name: v.string(),
    location: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("supermarkets", {
      name: args.name,
      location: args.location,
    });
  },
});

// Update a supermarket
export const update = mutation({
  args: {
    id: v.id("supermarkets"),
    name: v.optional(v.string()),
    location: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;

    // Filter out undefined values
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    );

    await ctx.db.patch(id, filteredUpdates);
    return await ctx.db.get(id);
  },
});

// Delete a supermarket
export const remove = mutation({
  args: { id: v.id("supermarkets") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
