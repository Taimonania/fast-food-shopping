import { Id } from "@/convex/_generated/dataModel";
import { SuperOrderItem } from "@/convex/functions/super_order";
import { type UpdateItemFormData } from "@/lib/zod/item";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { ItemCard } from "./ItemCard";

// Import the ItemLike type from ItemCard
type ItemLike = SuperOrderItem;

interface SortableCardProps {
  item: SuperOrderItem;
  isEditing: boolean;
  editForm: UseFormReturn<UpdateItemFormData>;
  onKeyDown: (e: React.KeyboardEvent, id: Id<"items">) => void;
  onEdit: (item: ItemLike) => void;
  onSave: (id: Id<"items">) => void;
  onDelete: (id: Id<"items">) => void;
  className?: string;
}

export function SortableCard({
  item,
  isEditing,
  editForm,
  onKeyDown,
  onEdit,
  onSave,
  onDelete,
  className,
}: SortableCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item._id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${isDragging ? "opacity-70 ring-2 ring-offset-2" : ""}`}
    >
      <ItemCard
        item={item}
        isEditing={isEditing}
        editForm={editForm}
        onKeyDown={onKeyDown}
        onEdit={item => onEdit(item as SuperOrderItem)}
        onSave={onSave}
        onDelete={onDelete}
        className={`${className} flex items-center`}
        dragHandle={
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing touch-none p-1 rounded-md mr-3 flex-shrink-0"
            aria-label="Drag to reorder"
          >
            <GripVertical className="w-4 h-4" />
          </button>
        }
      />
    </div>
  );
}
