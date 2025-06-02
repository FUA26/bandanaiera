import {NextRequest, NextResponse} from "next/server";
import {getToken} from "next-auth/jwt";

import {getAdminToken} from "@/lib/keycloak";

// Event types yang ingin ditampilkan
const EVENT_TYPES = ["LOGIN", "LOGOUT", "UPDATE_PROFILE", "UPDATE_PASSWORD"];

export async function GET(req: NextRequest) {
  try {
    // Ambil token user dari session
    const token = await getToken({req, secret: process.env.NEXTAUTH_SECRET});

    const isTokenExpired =
      token?.accessTokenExpires &&
      typeof token.accessTokenExpires === "number" &&
      Date.now() > token.accessTokenExpires;

    if (!token || !token.sub || isTokenExpired) {
      return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    // Ambil admin token dari Keycloak
    const adminToken = await getAdminToken();

    const url = new URL(
      `${process.env.NEXT_PUBLIC_BASE_KEYCLOAK_URL}/admin/realms/${process.env.REALMS_ID}/events`,
    );

    url.searchParams.set("userId", token.sub);

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });

    if (!response.ok) {
      const text = await response.text();

      console.error("❌ Failed to fetch audit logs:", text);

      return NextResponse.json({error: "Failed to fetch audit logs"}, {status: response.status});
    }

    const events = await response.json();

    console.log("events", events);

    // Filter hanya tipe event yang diizinkan
    const filteredEvents = Array.isArray(events)
      ? events.filter((event: any) => EVENT_TYPES.includes(event.type))
      : [];

    return NextResponse.json({events: filteredEvents});
  } catch (err) {
    console.error("🔥 Error fetching audit logs:", err);

    return NextResponse.json({error: "Internal server error"}, {status: 500});
  }
}
