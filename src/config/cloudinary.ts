import { config } from "./config";

const cloudinaryConfig = {
  api_key: config.cloudinary.apiKey,
  cloud_name: config.cloudinary.cloudName,
  api_secret: config.cloudinary.apiSecret,
};

export default cloudinaryConfig;
