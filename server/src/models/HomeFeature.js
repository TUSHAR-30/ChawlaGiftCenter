import mongoose from "mongoose";

const homeFeatureSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    icon: { type: String, required: true, trim: true },
    iconClasses: { type: String, required: true, trim: true },
    filled: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0, index: true },
  },
  {
    timestamps: true,
  },
);

export const HomeFeature = mongoose.model("HomeFeature", homeFeatureSchema);
