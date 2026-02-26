/**
 * Public Settings API Route
 *
 * GET /api/public/settings - Get public-facing settings (no auth, CORS enabled)
 */

import { prisma } from "@/lib/db/prisma";
import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export const OPTIONS = () => {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
};

/**
 * GET /api/public/settings
 * Get public-facing settings (no auth required)
 */
export const GET = async () => {
  try {
    const settings = await prisma.systemSettings.findFirst({
      include: {
        siteLogo: true,
      },
    });

    if (!settings) {
      return NextResponse.json(
        { error: "Settings not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    // Build response with logo URL
    const response = {
      siteName: settings.siteName,
      siteSubtitle: settings.siteSubtitle || null,
      siteDescription: settings.siteDescription,
      siteLogoUrl: settings.siteLogo?.cdnUrl || null,
      citizenName: settings.citizenName || "Warga",
      contactAddress: settings.contactAddress || null,
      contactPhones: settings.contactPhones as string[] || null,
      contactEmails: settings.contactEmails as string[] || null,
      socialFacebook: settings.socialFacebook || null,
      socialTwitter: settings.socialTwitter || null,
      socialInstagram: settings.socialInstagram || null,
      socialYouTube: settings.socialYouTube || null,
      copyrightText: settings.copyrightText || null,
      versionNumber: settings.versionNumber || "1.0.0",
    };

    return NextResponse.json(response, { headers: corsHeaders });
  } catch (error) {
    console.error("Error fetching public settings:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500, headers: corsHeaders }
    );
  }
};
