import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getCategoryById,
  getCategories,
  updateCategory,
} from "./category.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/", getCategories);

router.post("/", authMiddleware, createCategory);

router.get("/:id", getCategoryById);

router.put("/:id", authMiddleware, updateCategory);

router.delete("/:id", authMiddleware, deleteCategory);

export default router;
