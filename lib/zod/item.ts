import { z } from "zod";

export const createItemSchema = z.object({
  name: z
    .string()
    .min(1, "Item name is required")
    .max(100, "Item name too long"),
  description: z.string().max(500, "Item description too long").optional(),
});

export type ItemFormData = z.infer<typeof createItemSchema>;
