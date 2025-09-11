import { Doc, Id } from "@/convex/_generated/dataModel";
import { SuperOrderItem } from "@/convex/functions/super_order";

// Common interface for display
export interface DisplayableItem {
  _id: Id<"items">;
  name: string;
  description?: string;
}

// Adapter functions
export const adaptRegularItem = (item: Doc<"items">): DisplayableItem => ({
  _id: item._id,
  name: item.name,
  description: item.description,
});

export const adaptOrderedItem = (item: SuperOrderItem): DisplayableItem => ({
  _id: item.itemId,
  name: item.name,
  description: item.description,
});

export const isOrderedItem = (item: unknown): item is SuperOrderItem => {
  return (
    typeof item === "object" &&
    item !== null &&
    "orderKey" in item &&
    "supermarketId" in item
  );
};
