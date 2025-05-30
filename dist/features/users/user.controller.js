"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginWithOTP = exports.verifyUserOTP = exports.registerUserOtp = exports.searchUsers = exports.registerUser = exports.getUserById = exports.getUsers = void 0;
const bcryptjs_1 = require("bcryptjs");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../../config/config");
const utils_1 = require("../../utils");
const user_model_1 = require("./user.model");
const redis_1 = __importDefault(require("../../utils/redis"));
const constants_1 = require("../../constants");
const getUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        // Get total count of users
        const totalUsers = await user_model_1.User.countDocuments();
        const totalPages = Math.ceil(totalUsers / limit);
        // Get paginated users
        const users = await user_model_1.User.find()
            .select("-password")
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
        res.json({
            users,
            meta: {
                currentPage: page,
                totalPages,
                totalUsers,
                usersPerPage: limit,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1,
            },
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching users" });
    }
};
exports.getUsers = getUsers;
const getUserById = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: "User ID is required" });
    }
    try {
        const user = await user_model_1.User.findById(id).select("-password");
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching user" });
    }
};
exports.getUserById = getUserById;
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    console.log(req.body);
    const existingUser = await user_model_1.User.findOne({ email });
    if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
    }
    const salt = await (0, bcryptjs_1.genSalt)(10);
    const hashedPassword = await (0, bcryptjs_1.hash)(password, salt);
    const user = await user_model_1.User.create({
        name,
        email,
        password: hashedPassword,
        role: "student",
    });
    if (!user) {
        return res.status(500).json({ message: "Error creating user" });
    }
    // @ts-ignore
    const token = jsonwebtoken_1.default.sign({ id: user._id }, config_1.config.jwt.secret, {
        expiresIn: config_1.config.jwt.expiresIn,
    });
    // Select only necessary fields, excluding password
    const userResponse = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
    res.json({ user: userResponse, token });
};
exports.registerUser = registerUser;
const searchUsers = async (req, res) => {
    try {
        const { q } = req.query; // Single search term 'q'
        if (!q) {
            return res.status(400).json({ message: "Search term is required" });
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        // Build search query
        let searchQuery = {};
        // If search term is provided, search in both name and email fields
        if (q) {
            searchQuery = {
                $or: [
                    { name: { $regex: q, $options: "i" } }, // Match name
                    { email: { $regex: q, $options: "i" } }, // Match email
                ],
            };
        }
        // Get total count of matching users
        const totalUsers = await user_model_1.User.countDocuments(searchQuery);
        const totalPages = Math.ceil(totalUsers / limit);
        // Get paginated search results
        const users = await user_model_1.User.find(searchQuery)
            .select("-password")
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
        res.json({
            users,
            meta: {
                currentPage: page,
                totalPages,
                totalUsers,
                usersPerPage: limit,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1,
            },
        });
    }
    catch (error) {
        console.error("Search users error:", error);
        res.status(500).json({ message: "Error searching users" });
    }
};
exports.searchUsers = searchUsers;
const registerUserOtp = async (req, res) => {
    try {
        const { email, name } = req.body;
        if (!email || !name) {
            return res.status(400).json({ message: "Email and name are required" });
        }
        const existingUser = await user_model_1.User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }
        const otp = (0, utils_1.generate6DigitsOTP)();
        await (0, utils_1.sendOTP)({ email, otp, username: name });
        await redis_1.default.setex(`user:${email}`, constants_1.TEN_MINUTES + 1000, {
            name,
            email,
            role: "student",
        });
        res.status(200).json({ message: "OTP sent successfully" });
    }
    catch (e) {
        console.error("Register user OTP error:", e);
        res.status(500).json({ message: "Error registering user OTP" });
    }
};
exports.registerUserOtp = registerUserOtp;
const verifyUserOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required" });
        }
        const isOTPValid = await (0, utils_1.verifyOTP)({ email, otp });
        if (!isOTPValid) {
            return res.status(400).json({ message: "Invalid OTP" });
        }
        const user = (await redis_1.default.get(`user:${email}`));
        if (user) {
            const { name, email, role } = user;
            const databaseUser = await user_model_1.User.create({
                name,
                email,
                role,
            });
            if (!databaseUser) {
                return res.status(500).json({ message: "Error creating user" });
            }
            await redis_1.default.del(`user:${email}`);
            const token = jsonwebtoken_1.default.sign({ id: databaseUser._id }, config_1.config.jwt.secret, {
                expiresIn: "7d",
            });
            res.status(200).json({ user: databaseUser, token });
        }
        const dbUser = await user_model_1.User.findOne({ email });
        if (!dbUser) {
            return res.status(404).json({ message: "User not found" });
        }
        const token = jsonwebtoken_1.default.sign({ id: dbUser._id }, config_1.config.jwt.secret, {
            expiresIn: "7d",
        });
        res.status(200).json({ user: dbUser, token });
    }
    catch (error) {
        console.error("Verify user OTP error:", error);
        res.status(500).json({ message: "Error verifying user OTP" });
    }
};
exports.verifyUserOTP = verifyUserOTP;
const loginWithOTP = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        const user = await user_model_1.User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const otp = (0, utils_1.generate6DigitsOTP)();
        await (0, utils_1.sendOTP)({ email, otp, username: user.name });
        res.status(200).json({ message: "OTP sent successfully" });
    }
    catch (error) {
        console.error("Login with OTP error:", error);
        res.status(500).json({ message: "Error logging in with OTP" });
    }
};
exports.loginWithOTP = loginWithOTP;
