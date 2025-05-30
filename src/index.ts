import express, { Express, Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import userRoutes from "./features/users/user.route";
import authRoutes from "./features/auth/auth.route";
import cookieParser from "cookie-parser";
import courseRoutes from "./features/courses/course.route";
import categoryRoutes from "./features/categories/category.route";
import lessonRoutes from "./features/lessons/lesson.route";
import subscriptionRoutes from "./features/subscriptions/subscription.route";
import stripeHook from "./features/webhooks/stripe.hook";

// Load environment variables
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

const mainRouter = express.Router();

// Middleware
mainRouter.use(cors());
mainRouter.use(helmet());
mainRouter.use(express.json());
mainRouter.use(express.urlencoded({ extended: true }));
mainRouter.use(cookieParser());

// Database connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/e-learning")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

// Routes
mainRouter.use("/users", userRoutes);
mainRouter.use("/auth", authRoutes);
mainRouter.use("/courses", courseRoutes);
mainRouter.use("/categories", categoryRoutes);
mainRouter.use("/lessons", lessonRoutes);
mainRouter.use("/subscriptions", subscriptionRoutes);

app.use("/api", mainRouter);
app.use(stripeHook);

// Basic route
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to E-learning API" });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
