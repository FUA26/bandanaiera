import {NextRequest, NextResponse} from "next/server";
import {getToken} from "next-auth/jwt";

import {getAdminToken} from "@/lib/keycloak";

// Event types yang ingin ditampilkan
const EVENT_TYPES = ["LOGIN", "LOGOUT", "UPDATE_PROFILE", "UPDATE_PASSWORD"];

export async function GET(req: NextRequest) {
  const token = await getToken({req, secret: process.env.NEXTAUTH_SECRET});

  const isExpired =
    token?.accessTokenExpires &&
    typeof token.accessTokenExpires === "number" &&
    Date.now() > token.accessTokenExpires;

  if (!token || !token.sub || isExpired) {
    return NextResponse.json({error: "Unauthorized"}, {status: 401});
  }

  try {
    const adminToken = await getAdminToken();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_KEYCLOAK_URL}/admin/realms/${process.env.REALMS_ID}/events?userId=${token.sub}`,
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      },
    );

    if (!response.ok) {
      const text = await response.text();

      console.error("❌ Failed to fetch audit logs:", text);

      return NextResponse.json({error: "Failed to fetch audit logs"}, {status: response.status});
    }

    const events = await response.json();

    const filteredEvents = events.filter((event: any) => EVENT_TYPES.includes(event.type));

    return NextResponse.json({events: filteredEvents});
  } catch (err) {
    console.error("🔥 Error fetching audit logs:", err);

    return NextResponse.json({error: "Internal server error"}, {status: 500});
  }
}
