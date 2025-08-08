import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get item orders for a specific supermarket
export const getBySupermarket = query({
  args: { supermarketId: v.id("supermarkets") },
  handler: async (ctx, args) => {
    const orders = await ctx.db
      .query("item_orders")
      .withIndex("by_supermarket", (q) =>
        q.eq("supermarketId", args.supermarketId)
      )
      .order("asc")
      .collect();

    // Join with items data
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const item = await ctx.db.get(order.itemId);
        return {
          ...order,
          item,
        };
      })
    );

    return ordersWithItems.sort((a, b) => a.orderPosition - b.orderPosition);
  },
});

// Get all unordered items for a supermarket
export const getUnorderedItems = query({
  args: { supermarketId: v.id("supermarkets") },
  handler: async (ctx, args) => {
    // Get all items
    const allItems = await ctx.db.query("items").collect();

    // Get ordered items for this supermarket
    const orderedItems = await ctx.db
      .query("item_orders")
      .withIndex("by_supermarket", (q) =>
        q.eq("supermarketId", args.supermarketId)
      )
      .collect();

    const orderedItemIds = new Set(orderedItems.map((order) => order.itemId));

    // Return items that are not ordered in this supermarket
    return allItems.filter((item) => !orderedItemIds.has(item._id));
  },
});

// Add item to supermarket ordering
export const addItemToOrder = mutation({
  args: {
    supermarketId: v.id("supermarkets"),
    itemId: v.id("items"),
    orderPosition: v.number(),
  },
  handler: async (ctx, args) => {
    // Check if this item is already ordered in this supermarket
    const existing = await ctx.db
      .query("item_orders")
      .withIndex("by_supermarket", (q) =>
        q.eq("supermarketId", args.supermarketId)
      )
      .filter((q) => q.eq(q.field("itemId"), args.itemId))
      .first();

    if (existing) {
      throw new Error("Item is already ordered in this supermarket");
    }

    // Shift positions of items that come after this position
    const itemsToShift = await ctx.db
      .query("item_orders")
      .withIndex("by_supermarket", (q) =>
        q.eq("supermarketId", args.supermarketId)
      )
      .filter((q) => q.gte(q.field("orderPosition"), args.orderPosition))
      .collect();

    // Update positions
    for (const item of itemsToShift) {
      await ctx.db.patch(item._id, {
        orderPosition: item.orderPosition + 1,
      });
    }

    // Insert new item order
    return await ctx.db.insert("item_orders", {
      supermarketId: args.supermarketId,
      itemId: args.itemId,
      orderPosition: args.orderPosition,
    });
  },
});

// Update item order position
export const updateOrderPosition = mutation({
  args: {
    id: v.id("item_orders"),
    newPosition: v.number(),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.id);
    if (!order) {
      throw new Error("Order not found");
    }

    const oldPosition = order.orderPosition;
    const newPosition = args.newPosition;

    if (oldPosition === newPosition) {
      return order;
    }

    // Get all orders for this supermarket
    const allOrders = await ctx.db
      .query("item_orders")
      .withIndex("by_supermarket", (q) =>
        q.eq("supermarketId", order.supermarketId)
      )
      .collect();

    // Update positions
    if (newPosition > oldPosition) {
      // Moving down: shift items up
      for (const orderItem of allOrders) {
        if (
          orderItem.orderPosition > oldPosition &&
          orderItem.orderPosition <= newPosition
        ) {
          await ctx.db.patch(orderItem._id, {
            orderPosition: orderItem.orderPosition - 1,
          });
        }
      }
    } else {
      // Moving up: shift items down
      for (const orderItem of allOrders) {
        if (
          orderItem.orderPosition >= newPosition &&
          orderItem.orderPosition < oldPosition
        ) {
          await ctx.db.patch(orderItem._id, {
            orderPosition: orderItem.orderPosition + 1,
          });
        }
      }
    }

    // Update the moved item
    await ctx.db.patch(args.id, { orderPosition: newPosition });
    return await ctx.db.get(args.id);
  },
});

// Remove item from supermarket ordering
export const removeFromOrder = mutation({
  args: { id: v.id("item_orders") },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.id);
    if (!order) {
      throw new Error("Order not found");
    }

    // Shift positions of items that come after this position
    const itemsToShift = await ctx.db
      .query("item_orders")
      .withIndex("by_supermarket", (q) =>
        q.eq("supermarketId", order.supermarketId)
      )
      .filter((q) => q.gt(q.field("orderPosition"), order.orderPosition))
      .collect();

    // Update positions
    for (const item of itemsToShift) {
      await ctx.db.patch(item._id, {
        orderPosition: item.orderPosition - 1,
      });
    }

    // Delete the order
    await ctx.db.delete(args.id);
  },
});
