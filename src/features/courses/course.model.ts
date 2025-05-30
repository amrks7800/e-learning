import mongoose, { Document, Schema } from "mongoose";

export interface ICourse extends Document {
  title: string;
  description: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
  author: Schema.Types.ObjectId;
  categories: Schema.Types.ObjectId[];
  completedStudents: number;
  price: number;
}

const courseSchema = new Schema<ICourse>(
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
    image: {
      type: String,
      required: true,
      validate: {
        validator: (v: string) => v.startsWith("https://"),
      },
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    categories: {
      type: [Schema.Types.ObjectId],
      ref: "Category",
      required: false,
    },
    completedStudents: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Course = mongoose.model<ICourse>("Course", courseSchema);
