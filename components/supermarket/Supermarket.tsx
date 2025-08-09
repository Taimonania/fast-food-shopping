"use client";

import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRef } from "react";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { DeleteButton } from "../ui/custom/DeleteButton";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { createItemSchema, type ItemFormData } from "@/lib/zod/item";
import { SupermarketSkeleton } from "./SupermarketSkeleton";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";

export default function Supermarket() {
  const supermarkets = useQuery(api.functions.supermarket.list);
  const items = useQuery(api.functions.item.list);
  const removeItem = useMutation(api.functions.item.remove);
  const createItem = useMutation(api.functions.item.create);

  const nameInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ItemFormData>({
    resolver: zodResolver(createItemSchema),
    defaultValues: {
      name: "",
      description: "",
    },
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
        {items.map((item) => (
          <Card key={item._id}>
            <CardHeader>
              <CardTitle>{item.name}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
              <CardAction>
                <DeleteButton onClick={() => handleDelete(item._id)} />
              </CardAction>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
