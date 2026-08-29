import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email("Μη έγκυρο email"),
  password: z.string().min(1, "Απαιτείται κωδικός"),
});

export const offerSchema = z.object({
  title: z.string().trim().min(2).max(120),
  description: z.string().trim().min(2).max(1000),
  originalPrice: z.coerce.number().min(0).max(100000),
  currentPrice: z.coerce.number().min(0).max(100000),
  billingPeriod: z.string().trim().min(1).max(120),
  isActive: z.coerce.boolean(),
  badgeText: z.string().trim().max(40).optional().nullable(),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  sortOrder: z.coerce.number().int().min(0).max(999),
  accent: z.enum(["navy", "paper"]).default("navy"),
});

export const blogPostSchema = z.object({
  title: z.string().trim().min(2).max(200),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Το slug πρέπει να είναι λατινικά με παύλες"),
  excerpt: z.string().trim().max(500).default(""),
  content: z.string().max(200000).default(""),
  coverImage: z.string().trim().max(500).optional().nullable(),
  coverAlt: z.string().trim().max(200).optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED"]),
});

export const contentUpdateSchema = z.object({
  values: z.record(z.string(), z.string().max(2000)),
});

export const mediaAltSchema = z.object({
  altText: z.string().trim().max(200).optional().nullable(),
});

export const settingsProfileSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email(),
});

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: z
      .string()
      .min(10, "Ο νέος κωδικός πρέπει να έχει τουλάχιστον 10 χαρακτήρες")
      .max(128),
    confirmPassword: z.string().min(1),
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    message: "Οι κωδικοί δεν ταιριάζουν",
    path: ["confirmPassword"],
  });

export const analyticsCollectSchema = z.object({
  path: z.string().trim().min(1).max(300),
  referrer: z.string().trim().max(500).optional().nullable(),
  deviceType: z.enum(["mobile", "desktop", "tablet", "unknown"]).default("unknown"),
});

export const bookingHoldSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  language: z.enum(["GERMAN", "ENGLISH"]),
  lessonType: z.enum(["PRIVATE", "GROUP"]),
});

export const bookingConfirmSchema = z.object({
  holdToken: z.string().min(10),
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email(),
  phone: z.string().trim().min(6).max(30),
  ageGroup: z.string().trim().min(1).max(60),
  estimatedLevel: z.string().trim().max(20).optional(),
  goal: z.string().trim().max(200).optional(),
  message: z.string().trim().max(2000).optional(),
});

export const availabilityScheduleSchema = z.object({
  name: z.string().trim().min(1).max(80),
  isActive: z.coerce.boolean(),
  rules: z.array(
    z.object({
      dayOfWeek: z.coerce.number().int().min(0).max(6),
      startTime: z.string().regex(/^\d{2}:\d{2}$/),
      endTime: z.string().regex(/^\d{2}:\d{2}$/),
    }),
  ),
});

export const blockedDateSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  reason: z.string().trim().max(200).optional(),
});

export type ActionResult<T = undefined> =
  | { ok: true; data?: T; message?: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };
