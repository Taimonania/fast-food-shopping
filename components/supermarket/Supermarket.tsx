"use client";

import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import {
  createItemSchema,
  updateItemSchema,
  type ItemFormData,
  type UpdateItemFormData,
} from "@/lib/zod/item";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "convex/react";
import { useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "../ui/button";

import { SuperOrderItem } from "@/convex/functions/super_order";
import { DisplayableItem } from "@/lib/adapters/item-adapter";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { SupermarketSkeleton } from "./SupermarketSkeleton";
import { ItemTable } from "./item/ItemTable";

const getUnorderedItems = (
  items?: Doc<"items">[],
  orderedItems?: SuperOrderItem[]
) => {
  if (!items || !orderedItems) return [];
  return items.filter(
    item => !orderedItems.some(order => order.itemId === item._id)
  );
};

export default function Supermarket() {
  const supermarkets = useQuery(api.functions.supermarket.list);
  const supermarketId = useMemo(() => supermarkets?.[0]?._id, [supermarkets]);
  const items = useQuery(api.functions.item.list);
  const orderedItems = useQuery(
    api.functions.super_order.list,
    supermarketId ? { supermarketId } : "skip"
  );
  const unorderedItems = useMemo(
    () => getUnorderedItems(items, orderedItems),
    [items, orderedItems]
  );
  const removeItem = useMutation(api.functions.item.remove);
  const createItem = useMutation(api.functions.item.create);
  const updateItem = useMutation(api.functions.item.update);
  const moveUpItem = useMutation(api.functions.super_order.moveUp);
  const moveDownItem = useMutation(api.functions.super_order.moveDown);
  const addToEndItem = useMutation(api.functions.super_order.addToEnd);

  const [editingId, setEditingId] = useState<Id<"items"> | null>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ItemFormData>({
    resolver: zodResolver(createItemSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const editForm = useForm<UpdateItemFormData>({
    resolver: zodResolver(updateItemSchema),
  });

  async function onSubmit(data: ItemFormData) {
    await createItem({
      name: data.name,
      description: data.description || undefined,
    });
    form.reset();
    nameInputRef.current?.focus();
    toast.success(`"${data.name}" has been added.`);
  }

  const handleDelete = async (id: Id<"items">) => {
    void removeItem({ id });
    toast.success(`The item has been deleted.`);
  };

  const handleEdit = (item: DisplayableItem) => {
    setEditingId(item._id);
    editForm.setValue("name", item.name);
    editForm.setValue("description", item.description || "");
  };

  const handleSave = async (id: Id<"items">) => {
    try {
      const formData = editForm.getValues();
      await updateItem({
        id,
        name: formData.name,
        description: formData.description || undefined,
      });
      setEditingId(null);
      toast.success("Item updated successfully");
    } catch {
      toast.error("Failed to update item");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    editForm.reset();
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: Id<"items">) => {
    if (e.key === "Enter") {
      e.preventDefault();
      void handleSave(id);
    }
    if (e.key === "Escape") {
      e.preventDefault();
      handleCancel();
    }
  };

  if (!supermarkets || !items || !orderedItems) {
    return <SupermarketSkeleton />;
  }

  if (supermarkets.length === 0) {
    return <div>No supermarkets found</div>;
  }

  return (
    <div className="space-y-6">      
      <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:justify-between">
        <h2 className="text-2xl font-semibold">{supermarkets[0].name}</h2>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col sm:flex-row gap-2"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex-1 sm:max-w-xs">
                  <FormLabel className="sr-only">Item name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Item name"
                      type="text"
                      {...field}
                      ref={nameInputRef}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="flex-1 sm:max-w-xs">
                  <FormLabel className="sr-only">Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Description (optional)"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Add Item</Button>
          </form>
        </Form>
      </div>

      {supermarketId && (
        <ItemTable
          orderedItems={orderedItems}
          unorderedItems={unorderedItems}
          supermarketId={supermarketId}
          editingId={editingId}
          editForm={editForm}
          onKeyDown={handleKeyDown}
          onEdit={handleEdit}
          onSave={handleSave}
          onDelete={handleDelete}
          moveUpItem={moveUpItem}
          moveDownItem={moveDownItem}
          addToEndItem={addToEndItem}
        />
      )}
    </div>
  );
}
