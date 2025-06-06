import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, "../../.env") });

export const config = {
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
  bucket: {
    name: process.env.BUCKET_NAME,
    id: process.env.BUCKET_ID,
    endpoint: process.env.BUCKET_ENDPOINT,
    keyId: process.env.BUCKET_KEY_ID,
    keySecret: process.env.BUCKET_KEY_SECRET,
    region: process.env.BUCKET_REGION,
  },
} as const;

// Type for the config object
export type Config = typeof config;
