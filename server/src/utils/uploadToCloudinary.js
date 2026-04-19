import { Readable } from "stream";
import { cloudinary, isCloudinaryConfigured } from "../config/cloudinary.js";
import { ApiError } from "./ApiError.js";

function uploadBuffer(buffer, options) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(result);
    });

    Readable.from(buffer).pipe(uploadStream);
  });
}

export async function uploadImageAsset(file, folder) {
  if (!file) {
    throw new ApiError(400, "Image file is required.");
  }

  if (!file.mimetype.startsWith("image/")) {
    throw new ApiError(400, "Only image files are allowed for this upload.");
  }

  if (!isCloudinaryConfigured()) {
    throw new ApiError(500, "Cloudinary is not configured on the server.");
  }

  return uploadBuffer(file.buffer, {
    folder,
    resource_type: "image",
  });
}

export async function uploadVideoAsset(file, folder) {
  if (!file) {
    throw new ApiError(400, "Video file is required.");
  }

  if (!file.mimetype.startsWith("video/")) {
    throw new ApiError(400, "Only video files are allowed for this upload.");
  }

  if (!isCloudinaryConfigured()) {
    throw new ApiError(500, "Cloudinary is not configured on the server.");
  }

  return uploadBuffer(file.buffer, {
    folder,
    resource_type: "video",
  });
}

export async function destroyCloudinaryAsset(publicId, resourceType = "image") {
  if (!publicId || !isCloudinaryConfigured()) {
    return;
  }

  await cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
  });
}
