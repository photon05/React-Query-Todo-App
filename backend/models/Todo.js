import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    userId: {
      type: Number,
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
  }
);

export default mongoose.model("Todo", todoSchema);