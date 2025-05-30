"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginRouteSchema = exports.loginSchema = exports.registerRouteSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    name: zod_1.z.string({ message: "Name is required" }).min(3).max(30),
    email: zod_1.z.string({ message: "Email is required" }).email(),
    password: zod_1.z.string({ message: "Password is required" }).min(8),
    // .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
});
exports.registerRouteSchema = zod_1.z.object({
    body: exports.registerSchema,
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string({ message: "Email is required" }).email({
        message: "Invalid email",
    }),
    password: zod_1.z.string({ message: "Password is required" }),
});
exports.loginRouteSchema = zod_1.z.object({
    body: exports.loginSchema,
});
