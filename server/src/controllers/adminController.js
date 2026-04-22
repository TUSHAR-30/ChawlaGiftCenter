import { Category } from "../models/Category.js";
import { Product } from "../models/Product.js";
import { UnboxingVideo } from "../models/UnboxingVideo.js";
import { ApiError } from "../utils/ApiError.js";
import {
  clearAdminAuthCookie,
  setAdminAuthCookie,
  signAdminToken,
  validateAdminCredentials,
} from "../utils/adminAuth.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  destroyCloudinaryAsset,
  uploadImageAsset,
  uploadVideoAsset,
} from "../utils/uploadToCloudinary.js";

function normalizeBoolean(value) {
  return value === true || value === "true" || value === "on";
}

function requireText(value, fieldName) {
  const normalizedValue = String(value || "").trim();

  if (!normalizedValue) {
    throw new ApiError(400, `${fieldName} is required.`);
  }

  return normalizedValue;
}

function optionalText(value) {
  return String(value || "").trim();
}

export const loginAdmin = asyncHandler(async (req, res) => {
  const username = requireText(req.body.username, "Username");
  const password = requireText(req.body.password, "Password");

  if (!validateAdminCredentials(username, password)) {
    throw new ApiError(401, "Invalid username or password.");
  }

  const token = signAdminToken({ username, role: "admin" });
  setAdminAuthCookie(res, token);

  res.status(200).json({
    success: true,
    message: "Admin login successful.",
    data: {
      username,
      role: "admin",
    },
  });
});

export const logoutAdmin = asyncHandler(async (req, res) => {
  clearAdminAuthCookie(res);

  res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
});

export const getAdminSession = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      username: req.admin.username,
      role: req.admin.role,
    },
  });
});

export const getAdminDashboardData = asyncHandler(async (req, res) => {
  const [categories, products, unboxingVideos] = await Promise.all([
    Category.find().sort({ sortOrder: 1, title: 1 }),
    Product.find().sort({ createdAt: -1 }),
    UnboxingVideo.find().sort({ createdAt: -1 }),
  ]);

  res.status(200).json({
    success: true,
    data: {
      categories,
      products,
      unboxingVideos,
    },
  });
});

export const createCategory = asyncHandler(async (req, res) => {
  const title = requireText(req.body.title, "Category name");
  const subtitle = optionalText(req.body.subtitle);
  const alt = requireText(req.body.alt, "Alt text");
  const existingCategory = await Category.findOne({ title });

  if (existingCategory) {
    throw new ApiError(409, "A category with this name already exists.");
  }

  const lastCategory = await Category.findOne().sort({ sortOrder: -1, createdAt: -1 });
  const sortOrder = lastCategory ? lastCategory.sortOrder + 1 : 0;

  const uploadedImage = await uploadImageAsset(req.file, "chawla-gift-centre/categories");

  const category = await Category.create({
    title,
    subtitle,
    alt,
    sortOrder,
    image: uploadedImage.secure_url,
    imagePublicId: uploadedImage.public_id,
  });

  res.status(201).json({
    success: true,
    message: "Category created successfully.",
    data: category,
  });
});

export const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    throw new ApiError(404, "Category not found.");
  }

  const previousTitle = category.title;
  const nextTitle = requireText(req.body.title, "Category name");
  const duplicateCategory = await Category.findOne({ _id: { $ne: category._id }, title: nextTitle });

  if (duplicateCategory) {
    throw new ApiError(409, "A category with this name already exists.");
  }

  category.title = nextTitle;
  category.subtitle = optionalText(req.body.subtitle);
  category.alt = requireText(req.body.alt, "Alt text");

  if (req.file) {
    const uploadedImage = await uploadImageAsset(req.file, "chawla-gift-centre/categories");

    await destroyCloudinaryAsset(category.imagePublicId, "image").catch(() => {});

    category.image = uploadedImage.secure_url;
    category.imagePublicId = uploadedImage.public_id;
  }

  await category.save();

  if (previousTitle !== nextTitle) {
    await Product.updateMany({ category: previousTitle }, { $set: { category: nextTitle } });
  }

  res.status(200).json({
    success: true,
    message: "Category updated successfully.",
    data: category,
  });
});

export const reorderCategories = asyncHandler(async (req, res) => {
  const categoryIds = Array.isArray(req.body.categoryIds) ? req.body.categoryIds : [];

  if (categoryIds.length === 0) {
    throw new ApiError(400, "Category order is required.");
  }

  const categories = await Category.find({ _id: { $in: categoryIds } }).select("_id");

  if (categories.length !== categoryIds.length) {
    throw new ApiError(400, "Some categories in the new order were not found.");
  }

  await Promise.all(
    categoryIds.map((categoryId, index) =>
      Category.updateOne({ _id: categoryId }, { $set: { sortOrder: index } }),
    ),
  );

  res.status(200).json({
    success: true,
    message: "Category order updated successfully.",
  });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    throw new ApiError(404, "Category not found.");
  }

  await Promise.all([
    Product.updateMany({ category: category.title }, { $set: { category: "" } }),
    destroyCloudinaryAsset(category.imagePublicId, "image").catch(() => {}),
  ]);

  await category.deleteOne();

  const remainingCategories = await Category.find().sort({ sortOrder: 1, createdAt: 1 }).select("_id");

  await Promise.all(
    remainingCategories.map((item, index) =>
      Category.updateOne({ _id: item._id }, { $set: { sortOrder: index } }),
    ),
  );

  res.status(200).json({
    success: true,
    message: "Category deleted successfully.",
  });
});

export const createProduct = asyncHandler(async (req, res) => {
  const title = requireText(req.body.title, "Title");
  const description = optionalText(req.body.description);
  const alt = optionalText(req.body.alt);
  const category = optionalText(req.body.category);
  const trending = normalizeBoolean(req.body.trending);
  const uploadedImage = await uploadImageAsset(req.file, "chawla-gift-centre/products");

  const product = await Product.create({
    title,
    description,
    alt,
    category,
    trending,
    image: uploadedImage.secure_url,
    imagePublicId: uploadedImage.public_id,
  });

  res.status(201).json({
    success: true,
    message: "Product created successfully.",
    data: product,
  });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(404, "Product not found.");
  }

  product.title = requireText(req.body.title, "Title");
  product.description = optionalText(req.body.description);
  product.alt = optionalText(req.body.alt);
  product.category = optionalText(req.body.category);
  product.trending = normalizeBoolean(req.body.trending);

  if (req.file) {
    const uploadedImage = await uploadImageAsset(req.file, "chawla-gift-centre/products");

    await destroyCloudinaryAsset(product.imagePublicId, "image").catch(() => {});

    product.image = uploadedImage.secure_url;
    product.imagePublicId = uploadedImage.public_id;
  }

  await product.save();

  res.status(200).json({
    success: true,
    message: "Product updated successfully.",
    data: product,
  });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(404, "Product not found.");
  }

  await destroyCloudinaryAsset(product.imagePublicId, "image").catch(() => {});
  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: "Product deleted successfully.",
  });
});

export const createUnboxingVideo = asyncHandler(async (req, res) => {
  const title = requireText(req.body.title, "Title");
  const description = optionalText(req.body.description);
  const productName = requireText(req.body.productName, "Product name");
  const posterFile = req.files?.poster?.[0];
  const videoFile = req.files?.video?.[0];

  const [uploadedPoster, uploadedVideo] = await Promise.all([
    uploadImageAsset(posterFile, "chawla-gift-centre/unboxing-posters"),
    uploadVideoAsset(videoFile, "chawla-gift-centre/unboxing-videos"),
  ]);

  const unboxingVideo = await UnboxingVideo.create({
    title,
    description,
    productName,
    poster: uploadedPoster.secure_url,
    posterPublicId: uploadedPoster.public_id,
    videoUrl: uploadedVideo.secure_url,
    videoPublicId: uploadedVideo.public_id,
  });

  res.status(201).json({
    success: true,
    message: "Unboxing video created successfully.",
    data: unboxingVideo,
  });
});

export const updateUnboxingVideo = asyncHandler(async (req, res) => {
  const unboxingVideo = await UnboxingVideo.findById(req.params.id);

  if (!unboxingVideo) {
    throw new ApiError(404, "Unboxing video not found.");
  }

  unboxingVideo.title = requireText(req.body.title, "Title");
  unboxingVideo.description = optionalText(req.body.description);
  unboxingVideo.productName = requireText(req.body.productName, "Product name");

  const posterFile = req.files?.poster?.[0];
  const videoFile = req.files?.video?.[0];

  if (posterFile) {
    const uploadedPoster = await uploadImageAsset(posterFile, "chawla-gift-centre/unboxing-posters");

    await destroyCloudinaryAsset(unboxingVideo.posterPublicId, "image").catch(() => {});

    unboxingVideo.poster = uploadedPoster.secure_url;
    unboxingVideo.posterPublicId = uploadedPoster.public_id;
  }

  if (videoFile) {
    const uploadedVideo = await uploadVideoAsset(videoFile, "chawla-gift-centre/unboxing-videos");

    await destroyCloudinaryAsset(unboxingVideo.videoPublicId, "video").catch(() => {});

    unboxingVideo.videoUrl = uploadedVideo.secure_url;
    unboxingVideo.videoPublicId = uploadedVideo.public_id;
  }

  await unboxingVideo.save();

  res.status(200).json({
    success: true,
    message: "Unboxing video updated successfully.",
    data: unboxingVideo,
  });
});

export const deleteUnboxingVideo = asyncHandler(async (req, res) => {
  const unboxingVideo = await UnboxingVideo.findById(req.params.id);

  if (!unboxingVideo) {
    throw new ApiError(404, "Unboxing video not found.");
  }

  await Promise.all([
    destroyCloudinaryAsset(unboxingVideo.posterPublicId, "image").catch(() => {}),
    destroyCloudinaryAsset(unboxingVideo.videoPublicId, "video").catch(() => {}),
  ]);

  await unboxingVideo.deleteOne();

  res.status(200).json({
    success: true,
    message: "Unboxing video deleted successfully.",
  });
});
