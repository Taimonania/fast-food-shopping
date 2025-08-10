import { defineTable } from "convex/server";
import { v } from "convex/values";

export const superOrderTable = defineTable({
  supermarketId: v.id("supermarkets"),
  itemId: v.id("items"),
  orderKey: v.string(),
})
  .index("by_supermarket_order", ["supermarketId", "orderKey"])
  .index("by_supermarket_item", ["supermarketId", "itemId"]);
