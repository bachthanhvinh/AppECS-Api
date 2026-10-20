import { z } from "zod";

const createCategorySchema = z.object({
  body: z.object({
    name: z
      .string({ message: "Name is required" })
      .trim()
      .min(1, "Name cannot be empty")
      .max(100, "Name must be under 100 characters"),
    slug: z
      .string({ message: "Slug is required" })
      .trim()
      .min(1, "Slug cannot be empty")
      .max(100, "Slug must be under 100 characters"),
    description: z
      .string()
      .trim()
      .max(1000, "Description must be under 1000 characters")
      .optional(),
  }),
});
const updateCategorySchema = z.object({
  body: createCategorySchema.shape.body.partial(),
});

export const categoryValidation = {
  createCategorySchema,
  updateCategorySchema,
};
