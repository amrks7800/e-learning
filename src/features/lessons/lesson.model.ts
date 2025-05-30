import { Document, Schema, model } from "mongoose";

export interface ILesson extends Document {
  title: string;
  description: string;
  videoUrl: string;
  article: string;
  courseId: Schema.Types.ObjectId;
}

const lessonSchema = new Schema<ILesson>(
  {
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
        validator: function (v: string) {
          return /^https?:\/\/(?:[a-z0-9-]+\.)+[a-z]{2,}(?:\/[^\s]*)?$/i.test(
            v
          );
        },
        message: (props) => `${props.value} is not a valid URL!`,
      },
    },
    article: {
      type: String,
      required: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Lesson = model<ILesson>("Lesson", lessonSchema);
