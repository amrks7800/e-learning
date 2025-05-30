import { z } from "zod";
import { Types } from "mongoose";

export const createLessonSchema = z.object({
  title: z.string().min(3).max(100).trim(),
  description: z.string().min(10).max(1000).trim(),
  videoUrl: z.string().url(),
  article: z.string().min(10),
  courseId: z.string().refine((val) => Types.ObjectId.isValid(val), {
    message: "Invalid course ID",
  }),
});

// Schema for updating a lesson (excludes courseId as it cannot be changed)
export const updateLessonSchema = z.object({
  title: z.string().min(3).max(100).trim().optional(),
  description: z.string().min(10).max(1000).trim().optional(),
  videoUrl: z.string().url().optional(),
  article: z.string().min(10).optional(),
  // Note: courseId is intentionally omitted as it cannot be updated
}).refine(data => {
  // Ensure no courseId is provided in the update
  return !('courseId' in data);
}, {
  message: "Cannot update courseId - lessons cannot be moved between courses"
});

export type CreateLessonInput = z.infer<typeof createLessonSchema>;
export type UpdateLessonInput = z.infer<typeof updateLessonSchema>;
