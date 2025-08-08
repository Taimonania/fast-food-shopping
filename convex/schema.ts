import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  items: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
  }),

  supermarkets: defineTable({
    name: v.string(),
    location: v.optional(v.string()),
  }),

  item_orders: defineTable({
    supermarketId: v.id("supermarkets"),
    itemId: v.id("items"),
    orderPosition: v.number(),
  })
    .index("by_supermarket", ["supermarketId"])
    .index("by_item", ["itemId"])
    .index("by_supermarket_position", ["supermarketId", "orderPosition"]),

  lists: defineTable({
    name: v.string(),
    isCompleted: v.boolean(),
  }),

  list_items: defineTable({
    listId: v.id("lists"),
    itemId: v.id("items"),
    quantity: v.string(),
    isCollected: v.boolean(),
    notes: v.optional(v.string()),
  })
    .index("by_list", ["listId"])
    .index("by_item", ["itemId"]),
});
