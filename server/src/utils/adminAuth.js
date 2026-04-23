import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { ApiError } from "./ApiError.js";

export const ADMIN_AUTH_COOKIE = "chawla_admin_token";

function ensureAuthConfig() {
  if (!env.adminUsername || !env.adminPassword || !env.adminJwtSecret) {
    throw new ApiError(500, "Admin authentication is not configured on the server.");
  }
}

function getAdminCookieOptions() {
  const isProduction = env.nodeEnv === "production";

  return {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    maxAge: 30 * 24 * 60 * 60 * 1000,
  };
}

export function validateAdminCredentials(username, password) {
  ensureAuthConfig();
  return username === env.adminUsername && password === env.adminPassword;
}

export function signAdminToken(payload) {
  ensureAuthConfig();
  return jwt.sign(payload, env.adminJwtSecret, {
    expiresIn: "30d",
  });
}

export function verifyAdminToken(token) {
  ensureAuthConfig();
  return jwt.verify(token, env.adminJwtSecret);
}

export function setAdminAuthCookie(res, token) {
  res.cookie(ADMIN_AUTH_COOKIE, token, getAdminCookieOptions());
}

export function clearAdminAuthCookie(res) {
  const { maxAge, ...cookieOptions } = getAdminCookieOptions();
  res.clearCookie(ADMIN_AUTH_COOKIE, cookieOptions);
}
