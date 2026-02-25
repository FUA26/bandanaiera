/**
 * Services Sync API Route
 *
 * POST /api/services/sync - Sync services to landing app
 *
 * Triggers cache invalidation on the landing app after services are updated
 */

import { protectApiRoute } from "@/lib/rbac-server/api-protect";
import { Permission } from "@/lib/rbac/types";
import { NextResponse } from "next/server";

/**
 * POST /api/services/sync
 * Sync services to landing app by triggering cache revalidation
 * Requires: CONTENT_UPDATE_ANY permission
 */
export const POST = protectApiRoute({
  permissions: ["CONTENT_UPDATE_ANY"] as Permission[],
  handler: async (request) => {
    try {
      const landingUrl = process.env.LANDING_URL || "http://localhost:3002";
      const revalidateSecret = process.env.REVALIDATE_SECRET || "dev-secret-change-in-production";

      // Call the landing app's revalidate endpoint
      const response = await fetch(`${landingUrl}/api/revalidate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-revalidate-secret": revalidateSecret,
        },
        body: JSON.stringify({
          type: "all",
          paths: ["/layanan", "/informasi-publik"],
        }),
      });

      if (!response.ok) {
        console.error("Failed to sync to landing app:", await response.text());
        return NextResponse.json(
          {
            error: "Sync Failed",
            message: "Failed to sync services to landing app",
          },
          { status: 502 }
        );
      }

      const data = await response.json();

      return NextResponse.json({
        success: true,
        message: "Services synced to landing app successfully",
        landingResponse: data,
      });
    } catch (error) {
      console.error("Error syncing services:", error);
      return NextResponse.json(
        {
          error: "Internal Server Error",
          message: "An error occurred while syncing services",
        },
        { status: 500 }
      );
    }
  },
});
