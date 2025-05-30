"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_middelware_1 = require("../../middlewares/zod.middelware");
const user_schemas_1 = require("../../schemas/user.schemas");
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("./auth.controller");
const router = express_1.default.Router();
router.post("/login", (0, zod_middelware_1.validateRequestBody)(user_schemas_1.loginSchema), auth_controller_1.login);
exports.default = router;
