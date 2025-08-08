import { z } from "zod";

// Item schemas
export const itemSchema = z.object({
  name: z.string().min(1, "Item name is required").max(100, "Name too long"),
  description: z.string().max(500, "Description too long").optional(),
});

export type ItemFormData = z.infer<typeof itemSchema>;

// Supermarket schemas
export const supermarketSchema = z.object({
  name: z
    .string()
    .min(1, "Supermarket name is required")
    .max(100, "Name too long"),
  location: z.string().max(200, "Location too long").optional(),
});

export type SupermarketFormData = z.infer<typeof supermarketSchema>;

// List schemas
export const listSchema = z.object({
  name: z.string().min(1, "List name is required").max(100, "Name too long"),
});

export type ListFormData = z.infer<typeof listSchema>;

// List item schemas
export const listItemSchema = z.object({
  quantity: z
    .string()
    .min(1, "Quantity is required")
    .max(50, "Quantity too long"),
  notes: z.string().max(200, "Notes too long").optional(),
});

export const addListItemSchema = z.object({
  itemName: z
    .string()
    .min(1, "Item name is required")
    .max(100, "Name too long"),
  itemDescription: z.string().max(500, "Description too long").optional(),
  quantity: z
    .string()
    .min(1, "Quantity is required")
    .max(50, "Quantity too long"),
  notes: z.string().max(200, "Notes too long").optional(),
});

export type ListItemFormData = z.infer<typeof listItemSchema>;
export type AddListItemFormData = z.infer<typeof addListItemSchema>;
