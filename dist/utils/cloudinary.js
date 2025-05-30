"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
const cloudinary_2 = __importDefault(require("../config/cloudinary"));
cloudinary_1.v2.config(cloudinary_2.default);
exports.default = cloudinary_1.v2;
