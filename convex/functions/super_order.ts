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

export const list = query({
  args: {
    supermarketId: v.id("supermarkets"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("superOrders")
      .withIndex("by_supermarket_order", q =>
        q.eq("supermarketId", args.supermarketId)
      )
      .collect();
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

export const createAtStart = mutation({
  args: {
    supermarketId: v.id("supermarkets"),
    itemId: v.id("items"),
  },
  handler: async (ctx, { supermarketId, itemId }) => {
    const first = await ctx.db
      .query("superOrders")
      .withIndex("by_supermarket_order", q =>
        q.eq("supermarketId", supermarketId)
      )
      .order("asc")
      .first();

    const nextKey = first?.orderKey || null;
    const newKey = generateKeyBetween(null, nextKey);

    return await insertUnique(ctx, { supermarketId, itemId, orderKey: newKey });
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