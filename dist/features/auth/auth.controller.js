"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const user_model_1 = require("../users/user.model");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = require("bcryptjs");
const config_1 = require("../../config/config");
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await user_model_1.User.findOne({ email });
        if (!user) {
            return res
                .status(401)
                .json({ message: "user with provided email not found" });
        }
        const isPasswordValid = await (0, bcryptjs_1.compare)(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id }, config_1.config.jwt.secret, {
            expiresIn: "7d",
        });
        const userResponse = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
        res.json({ user: userResponse, token });
    }
    catch (error) {
        res.status(500).json({ message: "Error logging in" });
    }
};
exports.login = login;
