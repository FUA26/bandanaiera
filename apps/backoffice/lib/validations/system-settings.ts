import { z } from "zod";

export const systemSettingsSchema = z.object({
  // Registration & Security (existing)
  allowRegistration: z.boolean(),
  requireEmailVerification: z.boolean(),
  defaultUserRoleId: z.string().cuid(),
  emailVerificationExpiryHours: z.number().int().min(1).max(168),
  minPasswordLength: z.number().int().min(6).max(128),
  requireStrongPassword: z.boolean(),

  // Site Identity (existing + new)
  siteName: z.string().min(1).max(100),
  siteDescription: z.string().max(500).optional(),
  siteLogoId: z.string().cuid().optional(),
  siteSubtitle: z.string().max(100).optional(),
  citizenName: z.string().max(50).optional(),

  // Contact Info (new)
  contactAddress: z.string().optional(),
  contactPhones: z.array(z.string().max(50)).optional(),
  contactEmails: z.array(z.string().email().max(100)).optional(),

  // Social Media (new)
  socialFacebook: z.string().url().optional().or(z.literal("")),
  socialTwitter: z.string().url().optional().or(z.literal("")),
  socialInstagram: z.string().url().optional().or(z.literal("")),
  socialYouTube: z.string().url().optional().or(z.literal("")),

  // Footer (new)
  copyrightText: z.string().max(200).optional(),
  versionNumber: z.string().max(20).optional(),
});

export type SystemSettingsInput = z.infer<typeof systemSettingsSchema>;

// Public-facing settings (safe to expose)
export const publicSettingsSchema = z.object({
  siteName: z.string(),
  siteSubtitle: z.string().nullable(),
  siteDescription: z.string().nullable(),
  siteLogoUrl: z.string().url().nullable(),
  citizenName: z.string().nullable(),
  contactAddress: z.string().nullable(),
  contactPhones: z.array(z.string()),
  contactEmails: z.array(z.string()),
  socialFacebook: z.string().nullable(),
  socialTwitter: z.string().nullable(),
  socialInstagram: z.string().nullable(),
  socialYouTube: z.string().nullable(),
  copyrightText: z.string().nullable(),
  versionNumber: z.string().nullable(),
});

export type PublicSettings = z.infer<typeof publicSettingsSchema>;
