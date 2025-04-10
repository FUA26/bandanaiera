// ✅ app/api/audit-log/route.ts

import {NextRequest, NextResponse} from "next/server";
import {getToken} from "next-auth/jwt";

import {getAdminToken} from "@/lib/keycloak";

// Event types yang ingin ditampilkan
const EVENT_TYPES = ["LOGIN", "LOGOUT", "UPDATE_PROFILE", "UPDATE_PASSWORD"];

export async function GET(req: NextRequest) {
  const token = await getToken({req, secret: process.env.NEXTAUTH_SECRET});

  if (!token || !token.sub) {
    return NextResponse.json({error: "Unauthorized"}, {status: 401});
  }

  try {
    const adminToken = await getAdminToken();

    // Ambil semua event user terkait
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_KEYCLOAK_URL}/admin/realms/${process.env.REALMS_ID}/events?userId=${token.sub}`,
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      },
    );

    if (!res.ok) {
      const text = await res.text();

      console.error("Failed to fetch audit logs:", text);

      return NextResponse.json({error: "Failed to fetch audit logs"}, {status: res.status});
    }

    const events = await res.json();
    const filteredEvents = events.filter((event: any) => EVENT_TYPES.includes(event.type));

    return NextResponse.json({events: filteredEvents});
  } catch (err) {
    console.error("Error fetching audit logs:", err);

    return NextResponse.json({error: "Internal server error"}, {status: 500});
  }
}
