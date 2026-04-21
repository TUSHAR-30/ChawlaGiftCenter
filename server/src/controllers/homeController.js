import { HomeCategory } from "../models/HomeCategory.js";
import { HomeFeature } from "../models/HomeFeature.js";
import { HomeGalleryItem } from "../models/HomeGalleryItem.js";
import { Product } from "../models/Product.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getHomePageData = asyncHandler(async (req, res) => {
  const [categories, features, gallery, trendingPreview] = await Promise.all([
    HomeCategory.find().sort({ sortOrder: 1, title: 1 }).limit(8),
    HomeFeature.find().sort({ sortOrder: 1 }),
    HomeGalleryItem.find().sort({ sortOrder: 1 }),
    Product.find({ trending: true }).sort({ createdAt: -1 }).limit(3),
  ]);

  res.status(200).json({
    success: true,
    data: {
      categories,
      features,
      gallery,
      trendingPreview,
    },
  });
});

