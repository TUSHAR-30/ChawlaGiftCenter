import { ADMIN_AUTH_COOKIE, verifyAdminToken } from "../utils/adminAuth.js";
import { ApiError } from "../utils/ApiError.js";

export function requireAdminAuth(req, res, next) {
  try {
    const token = req.cookies?.[ADMIN_AUTH_COOKIE];

    if (!token) {
      return next(new ApiError(401, "Please log in to continue."));
    }

    const decodedToken = verifyAdminToken(token);
    req.admin = decodedToken;

    return next();
  } catch (error) {
    return next(new ApiError(401, "Your admin session has expired. Please log in again."));
  }
}
