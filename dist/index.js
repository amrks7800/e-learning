"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_route_1 = __importDefault(require("./features/users/user.route"));
const auth_route_1 = __importDefault(require("./features/auth/auth.route"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const course_route_1 = __importDefault(require("./features/courses/course.route"));
const category_route_1 = __importDefault(require("./features/categories/category.route"));
const lesson_route_1 = __importDefault(require("./features/lessons/lesson.route"));
const subscription_route_1 = __importDefault(require("./features/subscriptions/subscription.route"));
const stripe_hook_1 = __importDefault(require("./features/webhooks/stripe.hook"));
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const mainRouter = express_1.default.Router();
// Middleware
mainRouter.use((0, cors_1.default)());
mainRouter.use((0, helmet_1.default)());
mainRouter.use(express_1.default.json());
mainRouter.use(express_1.default.urlencoded({ extended: true }));
mainRouter.use((0, cookie_parser_1.default)());
// Database connection
mongoose_1.default
    .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/e-learning")
    .then(() => {
    console.log("Connected to MongoDB");
})
    .catch((error) => {
    console.error("MongoDB connection error:", error);
});
// Routes
mainRouter.use("/users", user_route_1.default);
mainRouter.use("/auth", auth_route_1.default);
mainRouter.use("/courses", course_route_1.default);
mainRouter.use("/categories", category_route_1.default);
mainRouter.use("/lessons", lesson_route_1.default);
mainRouter.use("/subscriptions", subscription_route_1.default);
app.use("/api", mainRouter);
app.use(stripe_hook_1.default);
// Basic route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to E-learning API" });
});
// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
