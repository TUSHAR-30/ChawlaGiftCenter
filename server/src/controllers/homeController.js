import { Category } from "../models/Category.js";
import { Product } from "../models/Product.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getHomePageData = asyncHandler(async (req, res) => {
  const [categories, trendingPreview] = await Promise.all([
    Category.find().sort({ sortOrder: 1, title: 1 }).limit(8),
    Product.find({ trending: true }).sort({ createdAt: -1 }).limit(3),
  ]);

  res.status(200).json({
    success: true,
    data: {
      categories,
      trendingPreview,
    },
  });
});

