"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subscription = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const course_model_1 = require("../courses/course.model");
const lesson_model_1 = require("../lessons/lesson.model");
const subscriptionSchema = new mongoose_1.default.Schema({
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", required: true },
    course: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },
    enrolledAt: { type: Date, default: Date.now },
    progress: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ["active", "completed", "cancelled"],
        default: "active",
    },
    completedAt: { type: Date },
    cancelledAt: { type: Date },
    completedLessons: { type: Number, default: 0 },
    totalLessons: {
        type: Number,
        default: 0,
    },
});
subscriptionSchema.pre("save", async function (next) {
    const subscription = this;
    // If this is a new subscription, set totalLessons to the number of lessons in the course
    if (subscription.isNew) {
        try {
            const lessonCount = await lesson_model_1.Lesson.countDocuments({ courseId: subscription.course });
            subscription.totalLessons = lessonCount;
        }
        catch (error) {
            console.error("Error counting lessons for course:", error);
            // Continue with the default value if there's an error
        }
    }
    if (subscription.isModified("status") &&
        subscription.status === "completed") {
        subscription.progress = 100;
        subscription.completedAt = new Date();
        await subscription.save();
        await course_model_1.Course.findByIdAndUpdate(subscription.course, {
            $inc: { completedStudents: 1 },
        });
    }
    else if (subscription.isModified("status") &&
        subscription.status === "cancelled") {
        subscription.cancelledAt = new Date();
        await subscription.save();
    }
    next();
});
exports.Subscription = mongoose_1.default.model("Subscription", subscriptionSchema);
