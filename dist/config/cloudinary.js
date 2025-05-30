"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const cloudinaryConfig = {
    api_key: config_1.config.cloudinary.apiKey,
    cloud_name: config_1.config.cloudinary.cloudName,
    api_secret: config_1.config.cloudinary.apiSecret,
};
exports.default = cloudinaryConfig;
