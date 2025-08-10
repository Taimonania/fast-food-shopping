"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  createItemSchema,
  updateItemSchema,
  type ItemFormData,
  type UpdateItemFormData,
} from "@/lib/zod/item";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "convex/react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "../ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { CheckButton } from "../ui/custom/CheckButton";
import { DeleteButton } from "../ui/custom/DeleteButton";
import { EditButton } from "../ui/custom/EditButton";
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

export default function Supermarket() {
  const supermarkets = useQuery(api.functions.supermarket.list);
  const items = useQuery(api.functions.item.list);
  const removeItem = useMutation(api.functions.item.remove);
  const createItem = useMutation(api.functions.item.create);
  const updateItem = useMutation(api.functions.item.update);

  const [editingId, setEditingId] = useState<Id<"items"> | null>(null);
  const [editValues, setEditValues] = useState<{
    name: string;
    description: string;
  }>({ name: "", description: "" });

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
    await removeItem({ id });
    toast.success(`The item has been deleted.`);
  };

  const handleEdit = (item: {
    _id: Id<"items">;
    name: string;
    description?: string;
  }) => {
    setEditingId(item._id);
    setEditValues({
      name: item.name,
      description: item.description || "",
    });
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
      setEditValues({ name: "", description: "" });
      toast.success("Item updated successfully");
    } catch (error) {
      toast.error("Failed to update item");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValues({ name: "", description: "" });
    editForm.reset();
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: Id<"items">) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave(id);
    }
    if (e.key === "Escape") {
      e.preventDefault();
      handleCancel();
    }
  };

  if (!supermarkets || !items) {
    return <SupermarketSkeleton />;
  }

  if (supermarkets.length === 0 || items.length === 0) {
    return <div>No supermarkets or items found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col  sm:flex-row sm:items-end gap-4 sm:justify-between">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.map(item => (
          <Card key={item._id}>
            <CardHeader>
              {editingId === item._id ? (
                <Form {...editForm}>
                  <div className="space-y-2">
                    <FormField
                      control={editForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="sr-only">Item name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="text-lg font-semibold"
                              onKeyDown={e => handleKeyDown(e, item._id)}
                              autoFocus
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={editForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="sr-only">Description</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Description (optional)"
                              className="text-sm text-muted-foreground"
                              onKeyDown={e => handleKeyDown(e, item._id)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </Form>
              ) : (
                <>
                  <CardTitle>{item.name}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </>
              )}
              <CardAction>
                {editingId === item._id ? (
                  <CheckButton onClick={() => handleSave(item._id)} />
                ) : (
                  <div className="flex gap-1">
                    <EditButton onClick={() => handleEdit(item)} />
                    <DeleteButton onClick={() => handleDelete(item._id)} />
                  </div>
                )}
              </CardAction>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
