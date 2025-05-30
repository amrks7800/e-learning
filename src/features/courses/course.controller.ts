import { Course } from "./course.model";
import { Request, Response } from "express";
import { z } from "zod";
import { uploadToCloudinary } from "../../utils";
import { UpdateCourseSchema } from "src/schemas/course.schemas";
import { Schema } from "mongoose";

export const createCourse = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const image = req.file?.path;

    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!image) {
      return res.status(400).json({ message: "Missing image" });
    }

    const result = await uploadToCloudinary(image);

    if (!result) {
      return res.status(500).json({ message: "Error uploading image" });
    }

    const { title, description, categories, price } = req.body;

    if (!title || !description || !result.secure_url || !categories || !price) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const urlSchema = z.string().url();

    if (!urlSchema.safeParse(image).success) {
      return res.status(400).json({ message: "Invalid image URL" });
    }

    const course = await Course.create({
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
  } catch (error) {
    console.error("Create course error:", error);
    return res.status(500).json({ message: "Error creating course" });
  }
};

export const getCourses = async (req: Request, res: Response) => {
  const { page = 1, limit = 10 } = req.query;

  const totalCourses = await Course.countDocuments();

  const totalPages = Math.ceil(totalCourses / Number(limit));

  const courses = await Course.find()
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

export const getCourseById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Missing course ID" });
  }

  const course = await Course.findById(id);

  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  res.status(200).json(course);
};

export const searchCourses = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ message: "Search term is required" });
    }

    const courses = await Course.find({
      title: { $regex: q, $options: "i" },
    });

    res.status(200).json(courses);
  } catch (error) {
    console.error("Search courses error:", error);
    res.status(500).json({ message: "Error searching courses" });
  }
};

export const updateCourse = async (
  req: Request<any, any, UpdateCourseSchema>,
  res: Response
) => {
  const { id } = req.params;
  const image = req.file?.path;

  let newCourse = {
    ...req.body,
  };

  if (image) {
    const result = await uploadToCloudinary(image);

    if (!result) {
      return res.status(500).json({ message: "Error uploading image" });
    }

    newCourse.image = result.secure_url;
  }

  if (!id) {
    return res.status(400).json({ message: "Missing course ID" });
  }

  const course = await Course.findById(id);

  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  if (newCourse.categories) {
    course.categories = newCourse.categories.map(
      (category) => new Schema.Types.ObjectId(category)
    );
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

export const deleteCourseByID = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Missing course ID" });
  }

  const course = await Course.findByIdAndDelete(id);

  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  res.status(200).json({ message: "Course deleted successfully" });
};

export const getCoursesByCategory = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!categoryId) {
      return res.status(400).json({ message: "Missing category ID" });
    }

    const totalCourses = await Course.countDocuments({
      categories: categoryId,
    });
    const totalPages = Math.ceil(totalCourses / Number(limit));

    const courses = await Course.find({ categories: categoryId })
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
  } catch (error) {
    console.error("Get courses by category error:", error);
    res.status(500).json({ message: "Error retrieving courses by category" });
  }
};
