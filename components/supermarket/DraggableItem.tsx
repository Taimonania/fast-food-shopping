"use client";

import { useDraggable } from "@dnd-kit/core";
import { Id } from "@/convex/_generated/dataModel";

interface DraggableItemProps {
  item: {
    _id: Id<"items">;
    name: string;
    description?: string;
  };
}

export default function DraggableItem({ item }: DraggableItemProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: item._id,
      data: {
        type: "unordered-item",
        item,
      },
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-3 border rounded-lg cursor-grab transition-all ${
        isDragging ? "opacity-50 scale-95 shadow-lg" : "hover:bg-muted/50"
      }`}
      {...listeners}
      {...attributes}
    >
      <div className="flex-1">
        <h4 className="font-medium">{item.name}</h4>
        {item.description && (
          <p className="text-sm text-muted-foreground">{item.description}</p>
        )}
      </div>
      <div className="text-sm text-muted-foreground">No position</div>
    </div>
  );
}
