import mongoose from "mongoose";
import { connectDatabase } from "../src/config/db.js";
import {
  homeCategories,
  homeFeatures,
  homeGalleryItems,
  products,
  unboxingVideos,
} from "../src/data/seedData.js";
import { HomeCategory } from "../src/models/HomeCategory.js";
import { HomeFeature } from "../src/models/HomeFeature.js";
import { HomeGalleryItem } from "../src/models/HomeGalleryItem.js";
import { Product } from "../src/models/Product.js";
import { UnboxingVideo } from "../src/models/UnboxingVideo.js";

async function seedDatabase() {
  await connectDatabase();

  await Promise.all([
    HomeCategory.deleteMany({}),
    HomeFeature.deleteMany({}),
    HomeGalleryItem.deleteMany({}),
    Product.deleteMany({}),
    UnboxingVideo.deleteMany({}),
  ]);

  await Promise.all([
    HomeCategory.insertMany(homeCategories),
    HomeFeature.insertMany(homeFeatures),
    HomeGalleryItem.insertMany(homeGalleryItems),
    Product.insertMany(products),
    UnboxingVideo.insertMany(unboxingVideos),
  ]);

  console.log("Database seeded successfully");
}

seedDatabase()
  .catch((error) => {
    console.error("Failed to seed database", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
  });
