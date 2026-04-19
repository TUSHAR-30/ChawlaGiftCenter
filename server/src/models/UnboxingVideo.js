import mongoose from "mongoose";

const unboxingVideoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    poster: { type: String, required: true, trim: true },
    posterPublicId: { type: String, trim: true, default: "" },
    videoUrl: { type: String, required: true, trim: true },
    videoPublicId: { type: String, trim: true, default: "" },
    productName: { type: String, required: true, trim: true, index: true },
  },
  {
    timestamps: true,
  },
);

unboxingVideoSchema.index({ title: "text", productName: "text", description: "text" });

export const UnboxingVideo = mongoose.model("UnboxingVideo", unboxingVideoSchema);
