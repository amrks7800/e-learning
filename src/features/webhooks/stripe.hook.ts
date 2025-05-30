import Stripe from "stripe";
import { config } from "../../config/config";
import { Course } from "../courses/course.model";
import { Subscription } from "../subscriptions/subscription.model";
import { User } from "../users/user.model";
import { Request, Response, Router } from "express";
import bodyParser from "body-parser";

const stripe = new Stripe(config.stripe.secretKey!);

const router = Router();

router.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  async (req: Request, res: Response) => {
    try {
      const signature = req.headers["stripe-signature"];

      console.log("Stripe webhook received:", req.body);

      if (!signature) {
        return res.status(400).json({ message: "Missing signature" });
      }

      const event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        config.stripe.webhookSecret!
      );

      if (event.type === "checkout.session.completed") {
        const { courseId, userId } = event.data.object.metadata as {
          courseId: string;
          userId: string;
        };

        const course = await Course.findById(courseId);

        if (!course) {
          return res.status(404).json({ message: "Course not found" });
        }

        const user = await User.findById(userId);

        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        const subscription = await Subscription.create({
          user: userId,
          course: courseId,
          enrolledAt: new Date(),
          progress: 0,
          status: "active",
          completedAt: null,
          cancelledAt: null,
          completedLessons: 0,
        });

        console.log({ subscription });

        return res.status(200).json(subscription);
      }
    } catch (error) {
      console.error("Stripe webhook error:", error);
      return res.status(500).json({ message: "Error processing webhook" });
    }
  }
);

export default router;
