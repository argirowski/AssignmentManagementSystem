import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .max(30, "Category name must be less than 30 characters"),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
