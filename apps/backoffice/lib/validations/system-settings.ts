import { z } from "zod";

export const systemSettingsSchema = z.object({
  allowRegistration: z.boolean(),
  requireEmailVerification: z.boolean(),
  defaultUserRoleId: z.string().cuid(),
  emailVerificationExpiryHours: z.number().int().min(1).max(168), // 1 hour to 7 days
  minPasswordLength: z.number().int().min(6).max(128),
  requireStrongPassword: z.boolean(),
  siteName: z.string().min(1).max(100),
  siteDescription: z.string().max(500).optional(),
});

export type SystemSettingsInput = z.infer<typeof systemSettingsSchema>;

// Public-facing settings (safe to expose to non-admins)
export const publicSettingsSchema = z.object({
  allowRegistration: z.boolean(),
  requireEmailVerification: z.boolean(),
  minPasswordLength: z.number().int(),
  requireStrongPassword: z.boolean(),
  siteName: z.string(),
  siteDescription: z.string().nullable(),
});

export type PublicSettings = z.infer<typeof publicSettingsSchema>;
