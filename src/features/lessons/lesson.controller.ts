import { Request, Response } from "express";
import { z } from "zod";
import { Lesson } from "./lesson.model";
import { Course } from "../courses/course.model";
import { updateLessonSchema } from "./lesson.schema";
import { uploadToCloudinary } from "../../utils";
import { Subscription } from "../subscriptions/subscription.model";
import { ObjectId } from "mongoose";
import { uploadToS3 } from "../../utils/s3";

export const createLesson = async (req: Request, res: Response) => {
  try {
    const { title, description, article, courseId } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Video is required" });
    }

    const response = await uploadToS3(req.file);

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
    const courseExists = await Course.findById(courseId);
    if (!courseExists) {
      return res.status(404).json({ message: "Course not found" });
    }

    if ((user._id as ObjectId).toString() !== courseExists.author.toString()) {
      return res.status(403).json({
        message: "You are not authorized to create lessons for this course",
      });
    }

    const lesson = await Lesson.create({
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
  } catch (error) {
    console.error("Create lesson error:", error);
    res.status(500).json({ message: "Error creating lesson" });
  }
};

export const getLessonsByCourse = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;

    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userSubscriptions = await Subscription.find({
      user: user._id,
    });

    if (!userSubscriptions || userSubscriptions.length === 0) {
      return res.status(403).json({ message: "You are not subscribed" });
    }

    const userCourseSubscription = userSubscriptions.some(
      (subscription) => subscription.course.toString() === courseId
    );

    if (!userCourseSubscription) {
      return res.status(403).json({ message: "You are not subscribed" });
    }

    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required" });
    }

    const lessons = await Lesson.find({ courseId }).sort({ createdAt: 1 });

    res.status(200).json(lessons);
  } catch (error) {
    console.error("Get lessons error:", error);
    res.status(500).json({ message: "Error retrieving lessons" });
  }
};

export const getLessonById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Lesson ID is required" });
    }

    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userSubscriptions = await Subscription.find({
      user: user._id,
    });

    if (!userSubscriptions || userSubscriptions.length === 0) {
      return res.status(403).json({ message: "You are not subscribed" });
    }

    const lesson = await Lesson.findById(id);

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    const userCourseSubscription = userSubscriptions.some(
      (subscription) =>
        subscription.course.toString() === lesson?.courseId.toString()
    );

    if (!userCourseSubscription) {
      return res.status(403).json({ message: "You are not subscribed" });
    }

    res.status(200).json(lesson);
  } catch (error) {
    console.error("Get lesson error:", error);
    res.status(500).json({ message: "Error retrieving lesson" });
  }
};

export const updateLesson = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Lesson ID is required" });
    }

    // Find the existing lesson
    const lesson = await Lesson.findById(id);
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    // Validate the update data (excluding courseId as it cannot be changed)
    const updateData = updateLessonSchema.parse(req.body);

    if (req.file) {
      const response = await uploadToS3(req.file);
      if (!response) {
        return res.status(500).json({ message: "Error uploading video" });
      }
      const videoUrl = response.secure_url;
      updateData.videoUrl = videoUrl;
    }

    // Update the lesson fields
    if (updateData.title) lesson.title = updateData.title;
    if (updateData.description) lesson.description = updateData.description;
    if (updateData.videoUrl) lesson.videoUrl = updateData.videoUrl;
    if (updateData.article) lesson.article = updateData.article;

    // Save the updated lesson
    const updatedLesson = await lesson.save();

    res.status(200).json(updatedLesson);
  } catch (error) {
    console.error("Update lesson error:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors,
      });
    }
    res.status(500).json({ message: "Error updating lesson" });
  }
};

export const deleteLesson = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Lesson ID is required" });
    }

    const lesson = await Lesson.findByIdAndDelete(id);

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    res.status(200).json({ message: "Lesson deleted successfully" });
  } catch (error) {
    console.error("Delete lesson error:", error);
    res.status(500).json({ message: "Error deleting lesson" });
  }
};
