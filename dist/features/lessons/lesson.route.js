"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const lesson_controller_1 = require("./lesson.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const multer_middleware_1 = __importDefault(require("../../middlewares/multer.middleware"));
const router = (0, express_1.Router)();
// Get all lessons for a course
router.get("/course/:courseId", auth_middleware_1.authMiddleware, lesson_controller_1.getLessonsByCourse);
// Get a specific lesson
router.get("/:id", auth_middleware_1.authMiddleware, lesson_controller_1.getLessonById);
// Create a new lesson (admin only)
router.post("/", auth_middleware_1.authMiddleware, multer_middleware_1.default.single("video"), lesson_controller_1.createLesson);
// Update a lesson (admin only)
router.patch("/:id", auth_middleware_1.authMiddleware, multer_middleware_1.default.single("video"), lesson_controller_1.updateLesson);
// Delete a lesson (admin only)
router.delete("/:id", auth_middleware_1.authMiddleware, lesson_controller_1.deleteLesson);
exports.default = router;
