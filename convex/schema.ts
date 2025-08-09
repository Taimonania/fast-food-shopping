import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { supermarketTable } from "./tables/supermarket";
import { itemTable } from "./tables/item";

export default defineSchema({
  items: itemTable,
  supermarkets: supermarketTable,
});
