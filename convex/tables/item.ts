import { defineTable } from "convex/server";
import { v } from "convex/values";

export const itemTable = defineTable({
  name: v.string(),
  description: v.optional(v.string()),
});