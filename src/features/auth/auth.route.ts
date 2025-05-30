import { validateRequestBody } from "../../middlewares/zod.middelware";
import { loginSchema } from "../../schemas/user.schemas";
import express from "express";
import { login } from "./auth.controller";

const router = express.Router();

router.post("/login", validateRequestBody(loginSchema), login);

export default router;
