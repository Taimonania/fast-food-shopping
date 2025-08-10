"use client";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { SuperOrderItem } from "@/convex/functions/super_order";
import { type UpdateItemFormData } from "@/lib/zod/item";
import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useMutation } from "convex/react";
import { generateKeyBetween } from "fractional-indexing";
import { GripVertical } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Card, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { SortableCard } from "./SortableCard";

interface SortableListProps {
  items: SuperOrderItem[];
  supermarketId: Id<"supermarkets">;
  editingId: Id<"items"> | null;
  editForm: UseFormReturn<UpdateItemFormData>;
  onKeyDown: (e: React.KeyboardEvent, id: Id<"items">) => void;
  onEdit: (item: SuperOrderItem) => void;
  onSave: (id: Id<"items">) => void;
  onDelete: (id: Id<"items">) => void;
  className?: string;
}

function DragPreview({ item }: { item: SuperOrderItem | undefined }) {
  if (!item) return null;
  return (
    <Card className="p-3 rounded-lg shadow-md opacity-90">
      <CardHeader>
        <div className="flex items-center gap-3">
          <GripVertical className="w-4 h-4" />
          <div>
            <CardTitle className="text-sm">{item.name}</CardTitle>
            {item.description && (
              <CardDescription className="text-xs">
                {item.description}
              </CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}

export function SortableList({
  items: serverItems,
  supermarketId,
  editingId,
  editForm,
  onKeyDown,
  onEdit,
  onSave,
  onDelete,
  className,
}: SortableListProps) {
  const move = useMutation(api.functions.super_order.move);

  // Local state we manipulate during drag. We keep it in sync with server when not dragging.
  const [items, setItems] = useState<SuperOrderItem[]>(serverItems);
  const [activeId, setActiveId] = useState<Id<"items"> | null>(null);
  const isDragging = !!activeId;
  const serverSnapshotRef = useRef<SuperOrderItem[]>(serverItems);

  // Sync local items from server only when not dragging to avoid flicker.
  useEffect(() => {
    serverSnapshotRef.current = serverItems;
    if (!isDragging) setItems(serverItems);
  }, [serverItems, isDragging]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor)
  );

  const ids = useMemo(() => items.map(item => item._id), [items]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      onDragStart={({ active }) => {
        setActiveId(active.id as Id<"items">);
      }}
      onDragOver={({ active, over }) => {
        if (!over) return;
        const a = active.id as Id<"items">;
        const o = over.id as Id<"items">;
        if (a === o) return;
        setItems(prev => {
          const oldIndex = prev.findIndex(item => item._id === a);
          const newIndex = prev.findIndex(item => item._id === o);
          if (oldIndex === -1 || newIndex === -1) return prev;
          return arrayMove(prev, oldIndex, newIndex); // live reordering while hovering
        });
      }}
      onDragCancel={() => {
        // Revert to server snapshot
        setItems(serverSnapshotRef.current);
        setActiveId(null);
      }}
      onDragEnd={async ({ active, over }) => {
        const a = active.id as Id<"items">;
        const o = over?.id as Id<"items"> | undefined;
        setActiveId(null);
        if (!o || a === o) return;

        // Compute new orderKey from final local order (items already updated by onDragOver)
        setItems(current => {
          const newIndex = current.findIndex(item => item._id === a);
          if (newIndex === -1) return current;
          const prevKey = current[newIndex - 1]?.orderKey ?? null;
          const nextKey = current[newIndex + 1]?.orderKey ?? null;
          const newKey = generateKeyBetween(prevKey, nextKey);

          // Optimistically patch moved item with newKey and keep the local order
          const next = current.map(item =>
            item._id === a ? { ...item, orderKey: newKey } : item
          );

          // Fire-and-forget server mutation
          move({
            supermarketId,
            itemId: a,
            newOrderKey: newKey,
          }).catch(() => {
            // On error, fall back to server state
            setItems(serverSnapshotRef.current);
          });

          return next;
        });
      }}
    >
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <div className={`flex flex-col space-y-3 ${className || ""}`}>
          {items.map(item => (
            <SortableCard
              key={item._id}
              item={item}
              isEditing={editingId === item._id}
              editForm={editForm}
              onKeyDown={onKeyDown}
              onEdit={onEdit}
              onSave={onSave}
              onDelete={onDelete}
              className="opacity-75"
            />
          ))}
        </div>
      </SortableContext>

      {/* Nice floating preview while dragging */}
      <DragOverlay>
        <DragPreview item={items.find(item => item._id === activeId)} />
      </DragOverlay>
    </DndContext>
  );
}
