import { v } from "convex/values";
import { generateKeyBetween } from "fractional-indexing";
import { Doc, Id } from "../_generated/dataModel";
import { mutation, MutationCtx, query } from "../_generated/server";

type SuperOrderData = Omit<Doc<"superOrders">, "_id" | "_creationTime">;

const insertUnique = async (
  ctx: MutationCtx,
  data: SuperOrderData
): Promise<Id<"superOrders">> => {
  const { supermarketId, itemId, orderKey } = data;
  const existing = await ctx.db
    .query("superOrders")
    .withIndex("by_supermarket_item", q =>
      q.eq("supermarketId", supermarketId).eq("itemId", itemId)
    )
    .unique();

  if (existing) {
    await ctx.db.patch(existing._id, { orderKey });
    return existing._id;
  } else {
    const newId = await ctx.db.insert("superOrders", {
      supermarketId,
      itemId,
      orderKey,
    });
    return newId;
  }
};

export type SuperOrderItem = {
  _id: Id<"superOrders">;
  itemId: Id<"items">;
  supermarketId: Id<"supermarkets">;
  name: string;
  description?: string;
  orderKey: string;
};

// TODO: (potential) improvement: performance with this query
export const list = query({
  args: {
    supermarketId: v.id("supermarkets"),
  },
  handler: async (ctx, args): Promise<SuperOrderItem[]> => {
    const superOrders = await ctx.db
      .query("superOrders")
      .withIndex("by_supermarket_order", q =>
        q.eq("supermarketId", args.supermarketId)
      )
      .order("asc")
      .collect();

    const orderedItemsWithData = await Promise.all(
      superOrders.map(async order => {
        const item = await ctx.db.get(order.itemId);
        if (!item) return null;
        return {
          _id: order._id,
          itemId: item._id,
          supermarketId: order.supermarketId,
          name: item.name,
          description: item.description,
          orderKey: order.orderKey,
        };
      })
    );

    return orderedItemsWithData.filter(item => item !== null);
  },
});

export const create = mutation({
  args: {
    supermarketId: v.id("supermarkets"),
    itemId: v.id("items"),
    orderKey: v.string(),
  },
  handler: async (ctx, { supermarketId, itemId, orderKey }) => {
    return await insertUnique(ctx, { supermarketId, itemId, orderKey });
  },
});

export const move = mutation({
  args: { id: v.id("superOrders"), newOrderKey: v.string() },
  handler: async (ctx, { id, newOrderKey }) => {
    await ctx.db.patch(id, {
      orderKey: newOrderKey,
    });
    return await ctx.db.get(id);
  },
});

export const remove = mutation({
  args: { id: v.id("superOrders") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});

// Move an item up one spot in the order
export const moveUp = mutation({
  args: { itemId: v.id("items"), supermarketId: v.id("supermarkets") },
  handler: async (ctx, { itemId, supermarketId }) => {
    // Get all ordered items for this supermarket, sorted by orderKey
    const allOrders = await ctx.db
      .query("superOrders")
      .withIndex("by_supermarket_order", q =>
        q.eq("supermarketId", supermarketId)
      )
      .order("asc")
      .collect();

    // Find the current item
    const currentIndex = allOrders.findIndex(order => order.itemId === itemId);
    if (currentIndex <= 0) return; // Can't move up if it's first or not found

    const currentOrder = allOrders[currentIndex];
    const previousOrder = allOrders[currentIndex - 1];
    const beforePrevious =
      currentIndex > 1 ? allOrders[currentIndex - 2] : null;

    // Generate new order key between beforePrevious and previous
    const newOrderKey = generateKeyBetween(
      beforePrevious?.orderKey || null,
      previousOrder.orderKey
    );

    // Update the current item's order key
    await ctx.db.patch(currentOrder._id, { orderKey: newOrderKey });
    return await ctx.db.get(currentOrder._id);
  },
});

// Move an item down one spot in the order
export const moveDown = mutation({
  args: { itemId: v.id("items"), supermarketId: v.id("supermarkets") },
  handler: async (ctx, { itemId, supermarketId }) => {
    // Get all ordered items for this supermarket, sorted by orderKey
    const allOrders = await ctx.db
      .query("superOrders")
      .withIndex("by_supermarket_order", q =>
        q.eq("supermarketId", supermarketId)
      )
      .order("asc")
      .collect();

    // Find the current item
    const currentIndex = allOrders.findIndex(order => order.itemId === itemId);
    if (currentIndex >= allOrders.length - 1 || currentIndex === -1) return; // Can't move down if it's last or not found

    const currentOrder = allOrders[currentIndex];
    const nextOrder = allOrders[currentIndex + 1];
    const afterNext =
      currentIndex < allOrders.length - 2 ? allOrders[currentIndex + 2] : null;

    // Generate new order key between next and afterNext
    const newOrderKey = generateKeyBetween(
      nextOrder.orderKey,
      afterNext?.orderKey || null
    );

    // Update the current item's order key
    await ctx.db.patch(currentOrder._id, { orderKey: newOrderKey });
    return await ctx.db.get(currentOrder._id);
  },
});

// Add an item to the end of the order
export const addToEnd = mutation({
  args: { itemId: v.id("items"), supermarketId: v.id("supermarkets") },
  handler: async (ctx, { itemId, supermarketId }) => {
    // Get the last ordered item for this supermarket
    const lastOrder = await ctx.db
      .query("superOrders")
      .withIndex("by_supermarket_order", q =>
        q.eq("supermarketId", supermarketId)
      )
      .order("desc")
      .first();

    // Generate new order key after the last item
    const newOrderKey = generateKeyBetween(lastOrder?.orderKey || null, null);

    // Use insertUnique to add or update the item
    return await insertUnique(ctx, {
      supermarketId,
      itemId,
      orderKey: newOrderKey,
    });
  },
});
