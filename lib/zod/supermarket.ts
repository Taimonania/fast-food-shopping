import { z } from "zod";

export const createSupermarketSchema = z.object({
  name: z
    .string()
    .min(1, "Supermarket name is required")
    .max(100, "Name too long"),
  location: z.string().max(200, "Location too long").optional(),
});

export type SupermarketFormData = z.infer<typeof createSupermarketSchema>;
