import { z } from "zod";

export const createCourseSchema = z.object({
  title: z.string({ message: "Title is required" }),
  description: z.string({ message: "Description is required" }),
  image: z.string({ message: "Image is required" }).optional(),
  categories: z.array(z.string()).optional(),
  price: z.string({ message: "Price is required" }),
});

export type CreateCourseSchema = z.infer<typeof createCourseSchema>;

export const updateCourseSchema = createCourseSchema.partial().strict();

export type UpdateCourseSchema = z.infer<typeof updateCourseSchema>;
