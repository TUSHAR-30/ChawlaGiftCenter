import mongoose from "mongoose";

const homeGalleryItemSchema = new mongoose.Schema(
  {
    image: { type: String, required: true, trim: true },
    alt: { type: String, required: true, trim: true },
    sortOrder: { type: Number, default: 0, index: true },
  },
  {
    timestamps: true,
  },
);

export const HomeGalleryItem = mongoose.model("HomeGalleryItem", homeGalleryItemSchema);
