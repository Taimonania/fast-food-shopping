"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Id } from "@/convex/_generated/dataModel";
import { GripVertical } from "lucide-react";

interface SortableItemProps {
  orderItem: {
    _id: Id<"item_orders">;
    orderPosition: number;
    item: {
      _id: Id<"items">;
      name: string;
      description?: string;
    } | null;
  };
}

export default function SortableItem({ orderItem }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: orderItem._id,
    data: {
      type: "ordered-item",
      orderItem,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-3 border rounded-lg transition-all ${
        isDragging ? "opacity-50 scale-95 shadow-lg" : "hover:bg-muted/50"
      }`}
      {...attributes}
    >
      <div
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
      >
        <GripVertical className="w-4 h-4" />
      </div>
      <div className="text-sm text-muted-foreground min-w-8">
        #{orderItem.orderPosition}
      </div>
      <div className="flex-1">
        <h4 className="font-medium">{orderItem.item?.name}</h4>
        {orderItem.item?.description && (
          <p className="text-sm text-muted-foreground">
            {orderItem.item.description}
          </p>
        )}
      </div>
    </div>
  );
}
