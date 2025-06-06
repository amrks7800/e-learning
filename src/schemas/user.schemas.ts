import { z } from "zod";

export const registerSchema = z.object({
  name: z.string({ message: "Name is required" }).min(3).max(30),
  email: z.string({ message: "Email is required" }).email(),
  password: z.string({ message: "Password is required" }).min(8),
  // .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
  role: z.enum(["student", "teacher", "admin"]).default("student"),
});

export type RegisterSchema = z.infer<typeof registerSchema>;

export const registerRouteSchema = z.object({
  body: registerSchema,
});

export const loginSchema = z.object({
  email: z.string({ message: "Email is required" }).email({
    message: "Invalid email",
  }),
  password: z.string({ message: "Password is required" }),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const loginRouteSchema = z.object({
  body: loginSchema,
});
