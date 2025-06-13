import {NextRequest, NextResponse} from "next/server";
import {getToken} from "next-auth/jwt";

import {getAdminToken} from "@/lib/keycloak";

function isExpired(token: any) {
  return (
    token?.accessTokenExpires &&
    typeof token.accessTokenExpires === "number" &&
    Date.now() > token.accessTokenExpires
  );
}

// GET: Ambil semua sesi aktif user
export async function GET(req: NextRequest) {
  const token = await getToken({req, secret: process.env.NEXTAUTH_SECRET});

  if (!token || !token.sub || isExpired(token)) {
    return NextResponse.json({error: "Unauthorized"}, {status: 401});
  }

  try {
    const adminToken = await getAdminToken();

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_KEYCLOAK_URL}/admin/realms/${process.env.REALMS_ID}/users/${token.sub}/sessions`,
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      },
    );

    if (!res.ok) {
      const text = await res.text();

      console.error("❌ Failed to fetch sessions:", text);

      return NextResponse.json({error: "Failed to fetch sessions"}, {status: res.status});
    }

    const sessions = await res.json();

    console.log("sessions", sessions);

    return NextResponse.json({sessions});
  } catch (err) {
    console.error("🔥 Error fetching sessions:", err);

    return NextResponse.json({error: "Internal server error"}, {status: 500});
  }
}

// DELETE: Hapus satu sesi berdasarkan sessionId
export async function DELETE(req: NextRequest) {
  const token = await getToken({req, secret: process.env.NEXTAUTH_SECRET});
  const sessionId = req.nextUrl.searchParams.get("id");

  if (!token || !token.sub || isExpired(token)) {
    return NextResponse.json({error: "Unauthorized"}, {status: 401});
  }

  if (!sessionId) {
    return NextResponse.json({error: "Missing session ID"}, {status: 400});
  }

  try {
    const adminToken = await getAdminToken();

    await fetch(
      `${process.env.NEXT_PUBLIC_BASE_KEYCLOAK_URL}/admin/realms/${process.env.REALMS_ID}/users/${token.sub}/sessions/${sessionId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      },
    );

    return NextResponse.json({success: true});
  } catch (err) {
    console.error("🔥 Error deleting session:", err);

    return NextResponse.json({error: "Failed to delete session"}, {status: 500});
  }
}

// POST: Logout semua sesi user
export async function POST(req: NextRequest) {
  console.log("####################");
  console.log("OAuth Authorization Request Received");
  console.log("####################");

  const token = await getToken({req, secret: process.env.NEXTAUTH_SECRET});

  if (!token || !token.sub || isExpired(token)) {
    return NextResponse.json({error: "Unauthorized"}, {status: 401});
  }

  try {
    const adminToken = await getAdminToken();

    await fetch(
      `${process.env.NEXT_PUBLIC_BASE_KEYCLOAK_URL}/admin/realms/${process.env.REALMS_ID}/users/${token.sub}/logout`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      },
    );

    return NextResponse.json({success: true});
  } catch (err) {
    console.error("🔥 Error logging out sessions:", err);

    return NextResponse.json({error: "Failed to logout all sessions"}, {status: 500});
  }
}
