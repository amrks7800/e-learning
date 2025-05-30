import { Router } from "express";
import {
  createLesson,
  deleteLesson,
  getLessonById,
  getLessonsByCourse,
  updateLesson,
} from "./lesson.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import upload from "../../middlewares/multer.middleware";

const router = Router();

// Get all lessons for a course
router.get("/course/:courseId", authMiddleware, getLessonsByCourse);

// Get a specific lesson
router.get("/:id", authMiddleware, getLessonById);

// Create a new lesson (admin only)
router.post("/", authMiddleware, upload.single("video"), createLesson);

// Update a lesson (admin only)
router.patch("/:id", authMiddleware, upload.single("video"), updateLesson);

// Delete a lesson (admin only)
router.delete("/:id", authMiddleware, deleteLesson);

export default router;
