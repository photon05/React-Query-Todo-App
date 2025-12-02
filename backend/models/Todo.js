import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, "User ID is required"],
      min: [1, "User ID must be a positive number"],
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

export default mongoose.model("Todo", todoSchema);