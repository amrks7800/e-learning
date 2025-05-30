"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load environment variables from .env file
dotenv_1.default.config({ path: path_1.default.join(__dirname, "../../.env") });
exports.config = {
    server: {
        port: process.env.PORT || 5000,
        nodeEnv: process.env.NODE_ENV || "development",
    },
    jwt: {
        secret: process.env.JWT_SECRET || "your_jwt_secret_key_here",
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    },
    cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        apiSecret: process.env.CLOUDINARY_API_SECRET,
        url: process.env.CLOUDINARY_URL,
    },
    stripe: {
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
        secretKey: process.env.STRIPE_SECRET_KEY,
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    },
    mail: {
        password: process.env.MAIL_PASSWORD,
        ownerMail: process.env.OWNER_MAIL,
    },
    redis: {
        url: process.env.REDIS_URL,
        token: process.env.REDIS_TOKEN,
    },
};
