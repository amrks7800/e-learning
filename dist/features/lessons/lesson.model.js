"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lesson = void 0;
const mongoose_1 = require("mongoose");
const lessonSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 150,
        trim: true,
    },
    videoUrl: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^https?:\/\/(?:[a-z0-9-]+\.)+[a-z]{2,}(?:\/[^\s]*)?$/i.test(v);
            },
            message: (props) => `${props.value} is not a valid URL!`,
        },
    },
    article: {
        type: String,
        required: true,
    },
    courseId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },
}, {
    timestamps: true,
});
exports.Lesson = (0, mongoose_1.model)("Lesson", lessonSchema);
