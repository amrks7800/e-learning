import express from "express";
import {
  getUserById,
  getUsers,
  registerUser,
  registerUserOtp,
  searchUsers,
  verifyUserOTP,
  loginWithOTP,
} from "./user.controller";
import { validateRequestBody } from "../../middlewares/zod.middelware";
import { registerSchema } from "../../schemas/user.schemas";

const router = express.Router();

// Get all users with pagination
router.get("/", getUsers);

// Search users by name or email with a single query parameter
router.get("/search", searchUsers);

// Get user by ID
router.get("/:id", getUserById);

router.post("/register", validateRequestBody(registerSchema), registerUser);

router.post("/register/send-otp", registerUserOtp);

router.post("/verify-otp", verifyUserOTP);

router.post("/login/otp", loginWithOTP);

export default router;
