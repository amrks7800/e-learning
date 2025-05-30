"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stripe_1 = __importDefault(require("stripe"));
const config_1 = require("../../config/config");
const course_model_1 = require("../courses/course.model");
const subscription_model_1 = require("../subscriptions/subscription.model");
const user_model_1 = require("../users/user.model");
const express_1 = require("express");
const body_parser_1 = __importDefault(require("body-parser"));
const stripe = new stripe_1.default(config_1.config.stripe.secretKey);
const router = (0, express_1.Router)();
router.post("/webhook", body_parser_1.default.raw({ type: "application/json" }), async (req, res) => {
    try {
        const signature = req.headers["stripe-signature"];
        console.log("Stripe webhook received:", req.body);
        if (!signature) {
            return res.status(400).json({ message: "Missing signature" });
        }
        const event = stripe.webhooks.constructEvent(req.body, signature, config_1.config.stripe.webhookSecret);
        if (event.type === "checkout.session.completed") {
            const { courseId, userId } = event.data.object.metadata;
            const course = await course_model_1.Course.findById(courseId);
            if (!course) {
                return res.status(404).json({ message: "Course not found" });
            }
            const user = await user_model_1.User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            const subscription = await subscription_model_1.Subscription.create({
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
    }
    catch (error) {
        console.error("Stripe webhook error:", error);
        return res.status(500).json({ message: "Error processing webhook" });
    }
});
exports.default = router;
