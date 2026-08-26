export const SESSION_COOKIE = "gms_admin_session";
export const SESSION_DAYS = 14;
export const VISITOR_COOKIE = "gms_vid";

export const CACHE_TAGS = {
  offers: "offers",
  content: "site-content",
  blog: "blog",
  media: "media",
} as const;

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export const LOGIN_RATE_LIMIT = {
  windowMs: 15 * 60 * 1000,
  maxAttempts: 8,
} as const;
