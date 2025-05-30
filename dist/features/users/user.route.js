"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const zod_middelware_1 = require("../../middlewares/zod.middelware");
const user_schemas_1 = require("../../schemas/user.schemas");
const router = express_1.default.Router();
// Get all users with pagination
router.get("/", user_controller_1.getUsers);
// Search users by name or email with a single query parameter
router.get("/search", user_controller_1.searchUsers);
// Get user by ID
router.get("/:id", user_controller_1.getUserById);
router.post("/register", (0, zod_middelware_1.validateRequestBody)(user_schemas_1.registerSchema), user_controller_1.registerUser);
router.post("/register/send-otp", user_controller_1.registerUserOtp);
router.post("/verify-otp", user_controller_1.verifyUserOTP);
router.post("/login/otp", user_controller_1.loginWithOTP);
exports.default = router;
