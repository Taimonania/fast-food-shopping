import { defineSchema } from "convex/server";
import { itemTable } from "./tables/item";
import { superOrderTable } from "./tables/super_order";
import { supermarketTable } from "./tables/supermarket";

export default defineSchema({
  items: itemTable,
  supermarkets: supermarketTable,
  superOrders: superOrderTable,
});
