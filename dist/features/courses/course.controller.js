"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCoursesByCategory = exports.deleteCourseByID = exports.updateCourse = exports.searchCourses = exports.getCourseById = exports.getCourses = exports.createCourse = void 0;
const course_model_1 = require("./course.model");
const zod_1 = require("zod");
const utils_1 = require("../../utils");
const mongoose_1 = require("mongoose");
const createCourse = async (req, res) => {
    var _a;
    try {
        console.log(req.body);
        const image = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (!image) {
            return res.status(400).json({ message: "Missing image" });
        }
        const result = await (0, utils_1.uploadToCloudinary)(image);
        if (!result) {
            return res.status(500).json({ message: "Error uploading image" });
        }
        const { title, description, categories, price } = req.body;
        if (!title || !description || !result.secure_url || !categories || !price) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const urlSchema = zod_1.z.string().url();
        if (!urlSchema.safeParse(image).success) {
            return res.status(400).json({ message: "Invalid image URL" });
        }
        const course = await course_model_1.Course.create({
            title,
            description,
            categories,
            image: result.secure_url,
            author: user._id,
            price: Number(price),
        });
        if (!course) {
            return res.status(500).json({ message: "Error creating course" });
        }
        res.status(201).json(course);
    }
    catch (error) {
        console.error("Create course error:", error);
        return res.status(500).json({ message: "Error creating course" });
    }
};
exports.createCourse = createCourse;
const getCourses = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const totalCourses = await course_model_1.Course.countDocuments();
    const totalPages = Math.ceil(totalCourses / Number(limit));
    const courses = await course_model_1.Course.find()
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit));
    res.status(200).json({
        courses,
        total: totalCourses,
        page: Number(page),
        limit: Number(limit),
        totalPages,
    });
};
exports.getCourses = getCourses;
const getCourseById = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: "Missing course ID" });
    }
    const course = await course_model_1.Course.findById(id);
    if (!course) {
        return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json(course);
};
exports.getCourseById = getCourseById;
const searchCourses = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ message: "Search term is required" });
        }
        const courses = await course_model_1.Course.find({
            title: { $regex: q, $options: "i" },
        });
        res.status(200).json(courses);
    }
    catch (error) {
        console.error("Search courses error:", error);
        res.status(500).json({ message: "Error searching courses" });
    }
};
exports.searchCourses = searchCourses;
const updateCourse = async (req, res) => {
    var _a;
    const { id } = req.params;
    const image = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
    let newCourse = {
        ...req.body,
    };
    if (image) {
        const result = await (0, utils_1.uploadToCloudinary)(image);
        if (!result) {
            return res.status(500).json({ message: "Error uploading image" });
        }
        newCourse.image = result.secure_url;
    }
    if (!id) {
        return res.status(400).json({ message: "Missing course ID" });
    }
    const course = await course_model_1.Course.findById(id);
    if (!course) {
        return res.status(404).json({ message: "Course not found" });
    }
    if (newCourse.categories) {
        course.categories = newCourse.categories.map((category) => new mongoose_1.Schema.Types.ObjectId(category));
    }
    if (newCourse.price) {
        course.price = Number(newCourse.price);
    }
    if (newCourse.description) {
        course.description = newCourse.description;
    }
    if (newCourse.title) {
        course.title = newCourse.title;
    }
    if (newCourse.image) {
        course.image = newCourse.image;
    }
    const updatedCourse = await course.save();
    res.status(200).json(updatedCourse);
};
exports.updateCourse = updateCourse;
const deleteCourseByID = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: "Missing course ID" });
    }
    const course = await course_model_1.Course.findByIdAndDelete(id);
    if (!course) {
        return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json({ message: "Course deleted successfully" });
};
exports.deleteCourseByID = deleteCourseByID;
const getCoursesByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const { page = 1, limit = 10 } = req.query;
        if (!categoryId) {
            return res.status(400).json({ message: "Missing category ID" });
        }
        const totalCourses = await course_model_1.Course.countDocuments({
            categories: categoryId,
        });
        const totalPages = Math.ceil(totalCourses / Number(limit));
        const courses = await course_model_1.Course.find({ categories: categoryId })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));
        if (!courses.length) {
            return res.status(200).json({
                courses: [],
                total: 0,
                page: Number(page),
                limit: Number(limit),
                totalPages: 0,
                message: "No courses found for this category",
            });
        }
        res.status(200).json({
            courses,
            total: totalCourses,
            page: Number(page),
            limit: Number(limit),
            totalPages,
        });
    }
    catch (error) {
        console.error("Get courses by category error:", error);
        res.status(500).json({ message: "Error retrieving courses by category" });
    }
};
exports.getCoursesByCategory = getCoursesByCategory;
