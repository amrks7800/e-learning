"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Course = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const courseSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 150,
        trim: true,
    },
    image: {
        type: String,
        required: true,
        validate: {
            validator: (v) => v.startsWith("https://"),
        },
    },
    author: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    categories: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: "Category",
        required: false,
    },
    completedStudents: {
        type: Number,
        default: 0,
    },
    price: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true,
});
exports.Course = mongoose_1.default.model("Course", courseSchema);
