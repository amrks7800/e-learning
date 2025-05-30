"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.getCategoryById = exports.getCategories = exports.createCategory = void 0;
const mongoose_1 = require("mongoose");
const category_model_1 = require("./category.model");
const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: "Missing category name" });
        }
        const category = await category_model_1.Category.create({ name });
        if (!category) {
            return res.status(500).json({ message: "Error creating category" });
        }
        res.status(201).json(category);
    }
    catch (error) {
        res.status(500).json({ message: "Error creating category" });
    }
};
exports.createCategory = createCategory;
const getCategories = async (req, res) => {
    try {
        const categories = await category_model_1.Category.find();
        res.status(200).json(categories);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving categories" });
    }
};
exports.getCategories = getCategories;
const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || !(0, mongoose_1.isValidObjectId)(id)) {
            return res.status(400).json({ message: "Missing category ID" });
        }
        const category = await category_model_1.Category.findById(id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json(category);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving category" });
    }
};
exports.getCategoryById = getCategoryById;
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: "Missing category name" });
        }
        if (!id) {
            return res.status(400).json({ message: "Missing category ID" });
        }
        const category = await category_model_1.Category.findByIdAndUpdate(id, { name }, { new: true });
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json(category);
    }
    catch (error) {
        res.status(500).json({ message: "Error updating category" });
    }
};
exports.updateCategory = updateCategory;
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await category_model_1.Category.findByIdAndDelete(id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json(category);
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting category" });
    }
};
exports.deleteCategory = deleteCategory;
