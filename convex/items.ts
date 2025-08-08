import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all items
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("items").collect();
  },
});

// Get a single item
export const get = query({
  args: { id: v.id("items") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Create a new item
export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("items", {
      name: args.name,
      description: args.description,
    });
  },
});

// Update an item
export const update = mutation({
  args: {
    id: v.id("items"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
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

// Delete an item
export const remove = mutation({
  args: { id: v.id("items") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Search items by name
export const search = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, args) => {
    const items = await ctx.db.query("items").collect();
    return items.filter((item) =>
      item.name.toLowerCase().includes(args.searchTerm.toLowerCase())
    );
  },
});
