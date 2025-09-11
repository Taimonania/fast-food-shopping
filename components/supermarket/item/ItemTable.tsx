"use client";

import { Separator } from "@/components/ui/separator";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { SuperOrderItem } from "@/convex/functions/super_order";
import {
  DisplayableItem,
  adaptOrderedItem,
  adaptRegularItem,
} from "@/lib/adapters/item-adapter";
import { type UpdateItemFormData } from "@/lib/zod/item";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { ItemCard } from "./ItemCard";

interface ItemTableProps {
  orderedItems: SuperOrderItem[];
  unorderedItems: Doc<"items">[];
  supermarketId: Id<"supermarkets">;
  editingId: Id<"items"> | null;
  editForm: UseFormReturn<UpdateItemFormData>;
  onKeyDown: (e: React.KeyboardEvent, id: Id<"items">) => void;
  onEdit: (item: DisplayableItem) => void;
  onSave: (id: Id<"items">) => void;
  onDelete: (id: Id<"items">) => void;
  moveUpItem: (args: {
    itemId: Id<"items">;
    supermarketId: Id<"supermarkets">;
  }) => Promise<unknown>;
  moveDownItem: (args: {
    itemId: Id<"items">;
    supermarketId: Id<"supermarkets">;
  }) => Promise<unknown>;
  addToEndItem: (args: {
    itemId: Id<"items">;
    supermarketId: Id<"supermarkets">;
  }) => Promise<unknown>;
  className?: string;
}

export function ItemTable({
  orderedItems,
  unorderedItems,
  supermarketId,
  editingId,
  editForm,
  onKeyDown,
  onEdit,
  onSave,
  onDelete,
  moveUpItem,
  moveDownItem,
  addToEndItem,
  className,
}: ItemTableProps) {
  const sortedOrderedItems = [...orderedItems].sort((a, b) => {
    return a.orderKey.localeCompare(b.orderKey);
  });

  const sortedUnorderedItems = [...unorderedItems].sort((a, b) => {
    return a.name.localeCompare(b.name);
  });

  const handleMoveUp = async (itemId: Id<"items">) => {
    try {
      await moveUpItem({ itemId, supermarketId });
      toast.success("Item moved up");
    } catch {
      toast.error("Failed to move item");
    }
  };

  const handleMoveDown = async (itemId: Id<"items">) => {
    try {
      await moveDownItem({ itemId, supermarketId });
      toast.success("Item moved down");
    } catch {
      toast.error("Failed to move item");
    }
  };

  const handleAddToEnd = async (itemId: Id<"items">) => {
    try {
      await addToEndItem({ itemId, supermarketId });
      toast.success("Item added to shopping list");
    } catch {
      toast.error("Failed to add item to list");
    }
  };

  return (
    <>
      <div className={`flex flex-col space-y-3 ${className || ""}`}>
        {sortedOrderedItems.map((item, index) => (
          <ItemCard
            key={item._id}
            item={adaptOrderedItem(item)}
            isEditing={editingId === item.itemId}
            editForm={editForm}
            onKeyDown={onKeyDown}
            onEdit={onEdit}
            onSave={onSave}
            onDelete={onDelete}
            orderNumber={index + 1} // 1-based indexing
            onMoveUp={handleMoveUp}
            onMoveDown={handleMoveDown}
            isFirst={index === 0}
            isLast={index === sortedOrderedItems.length - 1}
          />
        ))}
      </div>

      <Separator />

      <div className={`flex flex-col space-y-3 ${className || ""}`}>
        {sortedUnorderedItems.map(item => (
          <ItemCard
            key={item._id}
            item={adaptRegularItem(item)}
            isEditing={editingId === item._id}
            editForm={editForm}
            onKeyDown={onKeyDown}
            onEdit={onEdit}
            onSave={onSave}
            onDelete={onDelete}
            // No orderNumber for unordered items
            onAddToEnd={handleAddToEnd}
          />
        ))}
      </div>
    </>
  );
}
