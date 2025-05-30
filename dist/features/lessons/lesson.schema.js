"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLessonSchema = exports.createLessonSchema = void 0;
const zod_1 = require("zod");
const mongoose_1 = require("mongoose");
exports.createLessonSchema = zod_1.z.object({
    title: zod_1.z.string().min(3).max(100).trim(),
    description: zod_1.z.string().min(10).max(1000).trim(),
    videoUrl: zod_1.z.string().url(),
    article: zod_1.z.string().min(10),
    courseId: zod_1.z.string().refine((val) => mongoose_1.Types.ObjectId.isValid(val), {
        message: "Invalid course ID",
    }),
});
// Schema for updating a lesson (excludes courseId as it cannot be changed)
exports.updateLessonSchema = zod_1.z.object({
    title: zod_1.z.string().min(3).max(100).trim().optional(),
    description: zod_1.z.string().min(10).max(1000).trim().optional(),
    videoUrl: zod_1.z.string().url().optional(),
    article: zod_1.z.string().min(10).optional(),
    // Note: courseId is intentionally omitted as it cannot be updated
}).refine(data => {
    // Ensure no courseId is provided in the update
    return !('courseId' in data);
}, {
    message: "Cannot update courseId - lessons cannot be moved between courses"
});
