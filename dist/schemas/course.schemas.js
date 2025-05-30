"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCourseSchema = exports.createCourseSchema = void 0;
const zod_1 = require("zod");
exports.createCourseSchema = zod_1.z.object({
    title: zod_1.z.string({ message: "Title is required" }),
    description: zod_1.z.string({ message: "Description is required" }),
    image: zod_1.z.string({ message: "Image is required" }).optional(),
    categories: zod_1.z.array(zod_1.z.string()).optional(),
    price: zod_1.z.string({ message: "Price is required" }),
});
exports.updateCourseSchema = exports.createCourseSchema.partial().strict();
