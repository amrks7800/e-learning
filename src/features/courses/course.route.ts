import { Router } from "express";
import {
  createCourse,
  deleteCourseByID,
  getCourses,
  getCourseById,
  getCoursesByCategory,
  searchCourses,
  updateCourse,
} from "./course.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import upload from "../../middlewares/multer.middleware";
import { validateRequestBody } from "../../middlewares/zod.middelware";
import {
  createCourseSchema,
  updateCourseSchema,
} from "../../schemas/course.schemas";

const router = Router();

router.get("/", getCourses);

router.get("/search", searchCourses);

router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  validateRequestBody(createCourseSchema),
  createCourse
);

router.patch(
  "/:id",
  authMiddleware,
  upload.single("image"),
  validateRequestBody(updateCourseSchema),
  updateCourse
);

router.get("/category/:categoryId", getCoursesByCategory);
router.delete("/:id", authMiddleware, deleteCourseByID);
router.get("/:id", getCourseById);

export default router;
