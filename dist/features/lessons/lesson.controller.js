"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLesson = exports.updateLesson = exports.getLessonById = exports.getLessonsByCourse = exports.createLesson = void 0;
const zod_1 = require("zod");
const lesson_model_1 = require("./lesson.model");
const course_model_1 = require("../courses/course.model");
const lesson_schema_1 = require("./lesson.schema");
const utils_1 = require("../../utils");
const subscription_model_1 = require("../subscriptions/subscription.model");
const createLesson = async (req, res) => {
    try {
        const { title, description, article, courseId } = req.body;
        if (!req.file) {
            return res.status(400).json({ message: "Video is required" });
        }
        const response = await (0, utils_1.uploadToCloudinary)(req.file.path);
        const videoUrl = response.secure_url;
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (!title || !courseId || !videoUrl || !article || !description) {
            return res
                .status(400)
                .json({ message: "Title and Course ID are required" });
        }
        // Validate course exists
        const courseExists = await course_model_1.Course.findById(courseId);
        if (!courseExists) {
            return res.status(404).json({ message: "Course not found" });
        }
        if (user._id.toString() !== courseExists.author.toString()) {
            return res.status(403).json({
                message: "You are not authorized to create lessons for this course",
            });
        }
        const lesson = await lesson_model_1.Lesson.create({
            title,
            description,
            videoUrl,
            article,
            courseId,
        });
        if (!lesson) {
            return res.status(500).json({ message: "Error creating lesson" });
        }
        res.status(201).json(lesson);
    }
    catch (error) {
        console.error("Create lesson error:", error);
        res.status(500).json({ message: "Error creating lesson" });
    }
};
exports.createLesson = createLesson;
const getLessonsByCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const userSubscriptions = await subscription_model_1.Subscription.find({
            user: user._id,
        });
        if (!userSubscriptions || userSubscriptions.length === 0) {
            return res.status(403).json({ message: "You are not subscribed" });
        }
        const userCourseSubscription = userSubscriptions.some((subscription) => subscription.course.toString() === courseId);
        if (!userCourseSubscription) {
            return res.status(403).json({ message: "You are not subscribed" });
        }
        if (!courseId) {
            return res.status(400).json({ message: "Course ID is required" });
        }
        const lessons = await lesson_model_1.Lesson.find({ courseId }).sort({ createdAt: 1 });
        res.status(200).json(lessons);
    }
    catch (error) {
        console.error("Get lessons error:", error);
        res.status(500).json({ message: "Error retrieving lessons" });
    }
};
exports.getLessonsByCourse = getLessonsByCourse;
const getLessonById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Lesson ID is required" });
        }
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const userSubscriptions = await subscription_model_1.Subscription.find({
            user: user._id,
        });
        if (!userSubscriptions || userSubscriptions.length === 0) {
            return res.status(403).json({ message: "You are not subscribed" });
        }
        const lesson = await lesson_model_1.Lesson.findById(id);
        if (!lesson) {
            return res.status(404).json({ message: "Lesson not found" });
        }
        const userCourseSubscription = userSubscriptions.some((subscription) => subscription.course.toString() === (lesson === null || lesson === void 0 ? void 0 : lesson.courseId.toString()));
        if (!userCourseSubscription) {
            return res.status(403).json({ message: "You are not subscribed" });
        }
        res.status(200).json(lesson);
    }
    catch (error) {
        console.error("Get lesson error:", error);
        res.status(500).json({ message: "Error retrieving lesson" });
    }
};
exports.getLessonById = getLessonById;
const updateLesson = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Lesson ID is required" });
        }
        // Find the existing lesson
        const lesson = await lesson_model_1.Lesson.findById(id);
        if (!lesson) {
            return res.status(404).json({ message: "Lesson not found" });
        }
        // Validate the update data (excluding courseId as it cannot be changed)
        const updateData = lesson_schema_1.updateLessonSchema.parse(req.body);
        if (req.file) {
            const response = await (0, utils_1.uploadToCloudinary)(req.file.path);
            const videoUrl = response.secure_url;
            updateData.videoUrl = videoUrl;
        }
        // Update the lesson fields
        if (updateData.title)
            lesson.title = updateData.title;
        if (updateData.description)
            lesson.description = updateData.description;
        if (updateData.videoUrl)
            lesson.videoUrl = updateData.videoUrl;
        if (updateData.article)
            lesson.article = updateData.article;
        // Save the updated lesson
        const updatedLesson = await lesson.save();
        res.status(200).json(updatedLesson);
    }
    catch (error) {
        console.error("Update lesson error:", error);
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                message: "Validation error",
                errors: error.errors,
            });
        }
        res.status(500).json({ message: "Error updating lesson" });
    }
};
exports.updateLesson = updateLesson;
const deleteLesson = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Lesson ID is required" });
        }
        const lesson = await lesson_model_1.Lesson.findByIdAndDelete(id);
        if (!lesson) {
            return res.status(404).json({ message: "Lesson not found" });
        }
        res.status(200).json({ message: "Lesson deleted successfully" });
    }
    catch (error) {
        console.error("Delete lesson error:", error);
        res.status(500).json({ message: "Error deleting lesson" });
    }
};
exports.deleteLesson = deleteLesson;
