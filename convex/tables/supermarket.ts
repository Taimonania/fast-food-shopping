import { defineTable } from "convex/server";
import { v } from "convex/values";

export const supermarketTable = defineTable({
  name: v.string(),
  location: v.optional(v.string()),
});
