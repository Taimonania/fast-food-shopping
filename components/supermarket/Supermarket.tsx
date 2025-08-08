"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import DraggableItem from "./DraggableItem";
import SortableItem from "./SortableItem";

export default function Supermarket() {
  const supermarkets = useQuery(api.supermarkets.list);
  const latestSupermarket = supermarkets?.[0];

  const orderedItems = useQuery(
    api.item_orders.getBySupermarket,
    latestSupermarket ? { supermarketId: latestSupermarket._id } : "skip"
  );

  const unorderedItems = useQuery(
    api.item_orders.getUnorderedItems,
    latestSupermarket ? { supermarketId: latestSupermarket._id } : "skip"
  );

  const addItemToOrder = useMutation(api.item_orders.addItemToOrder);
  const updateOrderPosition = useMutation(api.item_orders.updateOrderPosition);

  // Local state for optimistic updates
  const [localOrderedItems, setLocalOrderedItems] = useState(
    orderedItems || []
  );
  const [localUnorderedItems, setLocalUnorderedItems] = useState(
    unorderedItems || []
  );
  const [activeItem, setActiveItem] = useState<any>(null);

  // Sync with server data
  useEffect(() => {
    if (orderedItems) {
      setLocalOrderedItems(orderedItems);
    }
  }, [orderedItems]);

  useEffect(() => {
    if (unorderedItems) {
      setLocalUnorderedItems(unorderedItems);
    }
  }, [unorderedItems]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeData = active.data.current;

    if (activeData?.type === "ordered-item") {
      const item = localOrderedItems.find((item) => item._id === active.id);
      setActiveItem(item);
    } else if (activeData?.type === "unordered-item") {
      const item = localUnorderedItems.find((item) => item._id === active.id);
      setActiveItem(item);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;
    const activeData = active.data.current;
    const overData = over.data.current;

    // Handle moving unordered item to ordered list
    if (
      activeData?.type === "unordered-item" &&
      overData?.type === "ordered-item"
    ) {
      const activeItem = localUnorderedItems.find(
        (item) => item._id === activeId
      );
      if (!activeItem) return;

      // Remove from unordered
      setLocalUnorderedItems((items) =>
        items.filter((item) => item._id !== activeId)
      );

      // Add to ordered at the position of the over item
      const overIndex = localOrderedItems.findIndex(
        (item) => item._id === overId
      );
      const newOrderItem = {
        _id: `temp-${activeId}-${Date.now()}` as any,
        orderPosition: overIndex + 1,
        itemId: activeItem._id,
        supermarketId: latestSupermarket!._id,
        item: activeItem,
        _creationTime: Date.now(),
      };

      setLocalOrderedItems((items) => {
        const newItems = [...items];
        newItems.splice(overIndex, 0, newOrderItem);
        return newItems.map((item, index) => ({
          ...item,
          orderPosition: index + 1,
        }));
      });
    }

    // Handle moving unordered item to ordered container
    if (
      activeData?.type === "unordered-item" &&
      overId === "ordered-droppable"
    ) {
      const activeItem = localUnorderedItems.find(
        (item) => item._id === activeId
      );
      if (!activeItem) return;

      // Remove from unordered
      setLocalUnorderedItems((items) =>
        items.filter((item) => item._id !== activeId)
      );

      // Add to end of ordered
      const newOrderItem = {
        _id: `temp-${activeId}-${Date.now()}` as any,
        orderPosition: localOrderedItems.length + 1,
        itemId: activeItem._id,
        supermarketId: latestSupermarket!._id,
        item: activeItem,
        _creationTime: Date.now(),
      };

      setLocalOrderedItems((items) => [...items, newOrderItem]);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveItem(null);

    if (!over || !latestSupermarket) return;

    const activeId = active.id;
    const overId = over.id;
    const activeData = active.data.current;
    const overData = over.data.current;

    // Handle reordering within ordered items
    if (
      activeData?.type === "ordered-item" &&
      overData?.type === "ordered-item"
    ) {
      const oldIndex = localOrderedItems.findIndex(
        (item) => item._id === activeId
      );
      const newIndex = localOrderedItems.findIndex(
        (item) => item._id === overId
      );

      if (oldIndex !== newIndex) {
        // Update local state immediately
        setLocalOrderedItems((items) => {
          const newItems = arrayMove(items, oldIndex, newIndex);
          return newItems.map((item, index) => ({
            ...item,
            orderPosition: index + 1,
          }));
        });

        // Update backend
        try {
          const sourceOrderItem = orderedItems?.find(
            (item) => item._id === activeId
          );
          if (sourceOrderItem) {
            await updateOrderPosition({
              id: sourceOrderItem._id,
              newPosition: newIndex + 1,
            });
          }
        } catch (error) {
          console.error("Failed to update order:", error);
          // Revert on error
          setLocalOrderedItems(orderedItems || []);
        }
      }
    }

    // Handle adding unordered item to ordered
    if (activeData?.type === "unordered-item") {
      const activeItem = unorderedItems?.find((item) => item._id === activeId);
      if (!activeItem) return;

      let targetPosition = localOrderedItems.length + 1;

      // If dropped on specific item, insert at that position
      if (overData?.type === "ordered-item") {
        const overIndex = localOrderedItems.findIndex(
          (item) => item._id === overId
        );
        targetPosition = overIndex + 1;
      }

      try {
        await addItemToOrder({
          supermarketId: latestSupermarket._id,
          itemId: activeItem._id,
          orderPosition: targetPosition,
        });
      } catch (error) {
        console.error("Failed to add item to order:", error);
        // Revert on error
        setLocalOrderedItems(orderedItems || []);
        setLocalUnorderedItems(unorderedItems || []);
      }
    }
  };

  if (!supermarkets) {
    return <div>Loading...</div>;
  }

  if (supermarkets.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">No Supermarkets Yet</h2>
          <p className="text-muted-foreground">Create a supermarket first.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">
          {latestSupermarket?.name} - Items
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Ordered Items */}
          <Card>
            <CardHeader>
              <CardTitle>Store Items (Ordered)</CardTitle>
            </CardHeader>
            <CardContent>
              <SortableContext
                items={localOrderedItems.map((item) => item._id)}
                strategy={verticalListSortingStrategy}
                id="ordered-droppable"
              >
                {localOrderedItems.length > 0 ? (
                  <div className="space-y-2">
                    {localOrderedItems.map((orderItem) => (
                      <SortableItem key={orderItem._id} orderItem={orderItem} />
                    ))}
                  </div>
                ) : (
                  <div className="text-muted-foreground text-center py-8 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                    No items in store layout. Drag items here to add them.
                  </div>
                )}
              </SortableContext>
            </CardContent>
          </Card>

          {/* Unordered Items */}
          <Card>
            <CardHeader>
              <CardTitle>Available Items</CardTitle>
            </CardHeader>
            <CardContent>
              {localUnorderedItems.length > 0 ? (
                <div className="space-y-2">
                  {localUnorderedItems.map((item) => (
                    <DraggableItem key={item._id} item={item} />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  All items are positioned in the store layout.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <DragOverlay>
        {activeItem ? (
          <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg opacity-90">
            <h4 className="font-medium">
              {activeItem.item?.name || activeItem.name}
            </h4>
            {(activeItem.item?.description || activeItem.description) && (
              <p className="text-sm text-muted-foreground">
                {activeItem.item?.description || activeItem.description}
              </p>
            )}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
