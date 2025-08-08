import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all items in a list, sorted by supermarket ordering
export const getByList = query({
  args: {
    listId: v.id("lists"),
    supermarketId: v.optional(v.id("supermarkets")),
  },
  handler: async (ctx, args) => {
    const items = await ctx.db
      .query("list_items")
      .withIndex("by_list", (q) => q.eq("listId", args.listId))
      .collect();

    // Join with items data
    const itemsWithDetails = await Promise.all(
      items.map(async (item) => {
        const shoppingItem = await ctx.db.get(item.itemId);
        return {
          ...item,
          item: shoppingItem,
        };
      })
    );

    // If supermarket is specified, sort by supermarket ordering
    if (args.supermarketId) {
      const itemOrders = await ctx.db
        .query("item_orders")
        .withIndex("by_supermarket", (q) =>
          q.eq("supermarketId", args.supermarketId!)
        )
        .collect();

      const orderMap = new Map(
        itemOrders.map((order) => [order.itemId, order.orderPosition])
      );

      return itemsWithDetails.sort((a, b) => {
        const posA = orderMap.get(a.itemId) ?? 999999; // Unordered items go to end
        const posB = orderMap.get(b.itemId) ?? 999999;
        return posA - posB;
      });
    }

    // Default sort by creation time
    return itemsWithDetails.sort((a, b) => a._creationTime - b._creationTime);
  },
});

// Add item to list
export const add = mutation({
  args: {
    listId: v.id("lists"),
    itemId: v.id("items"),
    quantity: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if item already exists in this list
    const existing = await ctx.db
      .query("list_items")
      .withIndex("by_list", (q) => q.eq("listId", args.listId))
      .filter((q) => q.eq(q.field("itemId"), args.itemId))
      .first();

    if (existing) {
      // Update quantity instead of creating duplicate
      await ctx.db.patch(existing._id, {
        quantity: args.quantity,
        notes: args.notes,
      });
      return existing._id;
    }

    return await ctx.db.insert("list_items", {
      listId: args.listId,
      itemId: args.itemId,
      quantity: args.quantity,
      isCollected: false,
      notes: args.notes,
    });
  },
});

// Update list item
export const update = mutation({
  args: {
    id: v.id("list_items"),
    quantity: v.optional(v.string()),
    isCollected: v.optional(v.boolean()),
    notes: v.optional(v.string()),
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

// Remove item from list
export const remove = mutation({
  args: { id: v.id("list_items") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Toggle collected status
export const toggleCollected = mutation({
  args: { id: v.id("list_items") },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.id);
    if (!item) {
      throw new Error("List item not found");
    }

    await ctx.db.patch(args.id, {
      isCollected: !item.isCollected,
    });

    return await ctx.db.get(args.id);
  },
});

// Add item to list (create item if it doesn't exist)
export const addOrCreateItem = mutation({
  args: {
    listId: v.id("lists"),
    itemName: v.string(),
    itemDescription: v.optional(v.string()),
    quantity: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // First, try to find existing item by name
    const existingItem = await ctx.db
      .query("items")
      .filter((q) => q.eq(q.field("name"), args.itemName))
      .first();

    let itemId;

    if (existingItem) {
      itemId = existingItem._id;
    } else {
      // Create new item
      itemId = await ctx.db.insert("items", {
        name: args.itemName,
        description: args.itemDescription,
      });
    }

    // Add to list
    return await ctx.db.insert("list_items", {
      listId: args.listId,
      itemId,
      quantity: args.quantity,
      isCollected: false,
      notes: args.notes,
    });
  },
});
