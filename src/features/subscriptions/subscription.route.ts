import { Router } from "express";
import { createSubscription } from "./subscription.controller";
import { getSubscriptionsByUser } from "./subscription.controller";
import { getSubscriptionsByCourse } from "./subscription.controller";
import { completeSubscription } from "./subscription.controller";
import { cancelSubscription } from "./subscription.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/course/:courseId", authMiddleware, createSubscription);
router.get("/user/:userId", authMiddleware, getSubscriptionsByUser);
router.get("/course/:courseId", authMiddleware, getSubscriptionsByCourse);
router.put("/complete/:courseId", authMiddleware, completeSubscription);
router.delete("/cancel/:courseId", authMiddleware, cancelSubscription);

export default router;
