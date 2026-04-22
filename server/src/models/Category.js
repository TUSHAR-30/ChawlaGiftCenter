import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, unique: true },
    subtitle: { type: String, trim: true, default: "" },
    image: { type: String, required: true, trim: true },
    imagePublicId: { type: String, trim: true, default: "" },
    alt: { type: String, required: true, trim: true },
    sortOrder: { type: Number, default: 0, index: true },
  },
  {
    timestamps: true,
  },
);

export const Category = mongoose.model("Category", categorySchema);
