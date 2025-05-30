"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubscriptionsByCourse = exports.getSubscriptionsByUser = exports.cancelSubscription = exports.completeSubscription = exports.createSubscription = void 0;
const subscription_model_1 = require("./subscription.model");
const course_model_1 = require("../courses/course.model");
const stripe_1 = require("stripe");
const config_1 = require("../../config/config");
const user_model_1 = require("../users/user.model");
const mongoose_1 = require("mongoose");
const stripe = new stripe_1.Stripe(config_1.config.stripe.secretKey);
const createSubscription = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.user._id;
        if (!mongoose_1.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({ message: "Invalid course ID" });
        }
        if (!mongoose_1.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }
        const user = await user_model_1.User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const course = await course_model_1.Course.findById(courseId);
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
    }
    catch (error) {
        console.error("Create subscription error:", error);
        return res.status(500).json({ message: "Error creating subscription" });
    }
};
exports.createSubscription = createSubscription;
const completeSubscription = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.user._id;
        const course = await course_model_1.Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        const subscription = await subscription_model_1.Subscription.findOne({
            user: userId,
            course: courseId,
        });
        if (!subscription) {
            return res.status(404).json({ message: "Subscription not found" });
        }
        subscription.status = "completed";
        await subscription.save();
        return res.status(200).json(subscription);
    }
    catch (error) {
        console.error("Update subscription error:", error);
        return res.status(500).json({ message: "Error updating subscription" });
    }
};
exports.completeSubscription = completeSubscription;
const cancelSubscription = async (req, res) => {
    try {
        const { courseId, userId } = req.params;
        const course = await course_model_1.Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        const subscription = await subscription_model_1.Subscription.findOne({
            user: userId,
            course: courseId,
        });
        if (!subscription) {
            return res.status(404).json({ message: "Subscription not found" });
        }
        subscription.status = "cancelled";
        await subscription.save();
        return res.status(200).json(subscription);
    }
    catch (error) {
        console.error("Update subscription error:", error);
        return res.status(500).json({ message: "Error updating subscription" });
    }
};
exports.cancelSubscription = cancelSubscription;
const getSubscriptionsByUser = async (req, res) => {
    try {
        const userId = req.user._id;
        const subscriptions = await subscription_model_1.Subscription.find({ user: userId }).populate("course");
        return res.status(200).json(subscriptions);
    }
    catch (error) {
        console.error("Get subscriptions error:", error);
        return res.status(500).json({ message: "Error retrieving subscriptions" });
    }
};
exports.getSubscriptionsByUser = getSubscriptionsByUser;
const getSubscriptionsByCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const subscriptions = await subscription_model_1.Subscription.find({ course: courseId })
            .populate("user")
            .populate("course");
        return res.status(200).json(subscriptions);
    }
    catch (error) {
        console.error("Get subscriptions error:", error);
        return res.status(500).json({ message: "Error retrieving subscriptions" });
    }
};
exports.getSubscriptionsByCourse = getSubscriptionsByCourse;
