import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    imagePublicId: { type: String, trim: true, default: "" },
    alt: { type: String, required: true, trim: true },
    category: { type: String, trim: true, default: "", index: true },
    trending: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
  },
);

productSchema.index({ title: "text", description: "text", category: "text" });

export const Product = mongoose.model("Product", productSchema);
