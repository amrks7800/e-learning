import { Subscription } from "./subscription.model";
import { Course } from "../courses/course.model";
import { Request, Response } from "express";
import { Stripe } from "stripe";
import { config } from "../../config/config";
import { User } from "../users/user.model";
import { Types } from "mongoose";

const stripe = new Stripe(config.stripe.secretKey!);

export const createSubscription = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;

    if (!Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }

    if (!Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // const subscription = await Subscription.create({
    //   user: userId,
    //   course: courseId,
    // });

    // return res.status(201).json(subscription);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: course.title,
              description: course.description,
            },
            unit_amount: course.price * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:3000/subscription/success",
      cancel_url: "http://localhost:3000/subscription/cancel",
      metadata: {
        courseId: courseId.toString(),
        userId: userId.toString(),
        userEmail: user.email,
      },
      customer_email: user.email,
    });

    return res.json({ url: session.url });
  } catch (error) {
    console.error("Create subscription error:", error);
    return res.status(500).json({ message: "Error creating subscription" });
  }
};

export const completeSubscription = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const subscription = await Subscription.findOne({
      user: userId,
      course: courseId,
    });

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    subscription.status = "completed";
    await subscription.save();

    return res.status(200).json(subscription);
  } catch (error) {
    console.error("Update subscription error:", error);
    return res.status(500).json({ message: "Error updating subscription" });
  }
};

export const cancelSubscription = async (req: Request, res: Response) => {
  try {
    const { courseId, userId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const subscription = await Subscription.findOne({
      user: userId,
      course: courseId,
    });

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    subscription.status = "cancelled";
    await subscription.save();

    return res.status(200).json(subscription);
  } catch (error) {
    console.error("Update subscription error:", error);
    return res.status(500).json({ message: "Error updating subscription" });
  }
};

export const getSubscriptionsByUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;

    const subscriptions = await Subscription.find({ user: userId }).populate(
      "course"
    );

    return res.status(200).json(subscriptions);
  } catch (error) {
    console.error("Get subscriptions error:", error);
    return res.status(500).json({ message: "Error retrieving subscriptions" });
  }
};

export const getSubscriptionsByCourse = async (req: Request, res: Response) => {
  try {
    const courseId = req.params.courseId;

    const subscriptions = await Subscription.find({ course: courseId })
      .populate("user")
      .populate("course");

    return res.status(200).json(subscriptions);
  } catch (error) {
    console.error("Get subscriptions error:", error);
    return res.status(500).json({ message: "Error retrieving subscriptions" });
  }
};
