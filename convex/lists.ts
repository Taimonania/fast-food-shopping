import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all lists
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("lists").order("desc").collect();
  },
});

// Get a single list
export const get = query({
  args: { id: v.id("lists") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Create a new list
export const create = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("lists", {
      name: args.name,
      isCompleted: false,
    });
  },
});

// Update list
export const update = mutation({
  args: {
    id: v.id("lists"),
    name: v.optional(v.string()),
    isCompleted: v.optional(v.boolean()),
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

// Delete a list
export const remove = mutation({
  args: { id: v.id("lists") },
  handler: async (ctx, args) => {
    // Also delete all list items
    const items = await ctx.db
      .query("list_items")
      .withIndex("by_list", (q) => q.eq("listId", args.id))
      .collect();

    for (const item of items) {
      await ctx.db.delete(item._id);
    }

    await ctx.db.delete(args.id);
  },
});

// Get current active list (latest incomplete one)
export const getCurrent = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("lists")
      .filter((q) => q.eq(q.field("isCompleted"), false))
      .order("desc")
      .first();
  },
});

// Mark list as completed
export const complete = mutation({
  args: { id: v.id("lists") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { isCompleted: true });
    return await ctx.db.get(args.id);
  },
});
