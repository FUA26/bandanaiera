import {NextRequest, NextResponse} from "next/server";
import {getToken} from "next-auth/jwt";
import * as z from "zod";

import {getAdminToken} from "@/lib/keycloak";

// ✅ Schema validasi input
const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

// ✅ GET: Ambil data user dari token
export async function GET(req: NextRequest) {
  const token = await getToken({req, secret: process.env.NEXTAUTH_SECRET});

  if (!token || !token.sub) {
    return NextResponse.json({error: "Unauthorized"}, {status: 401});
  }

  return NextResponse.json({
    user: {
      id: token.sub,
      name: token.name || "",
      email: token.email || "",
      roles: token.roles || [],
    },
  });
}

// ✅ PATCH: Update nama dan email user via Keycloak Admin API
export async function PATCH(req: NextRequest) {
  const token = await getToken({req, secret: process.env.NEXTAUTH_SECRET});

  if (!token || !token.sub) {
    return NextResponse.json({error: "Unauthorized"}, {status: 401});
  }

  const userId = token.sub;
  const body = await req.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({error: "Invalid data"}, {status: 400});
  }

  const {name, email} = parsed.data;

  try {
    const adminToken = await getAdminToken();

    console.log("🔧 Tokenn:", adminToken);
    console.log("🔧 Updating user:", userId);
    console.log("📦 Payload:", {attributes: {fullName: name}, email});
    console.log(
      "🔧 URL:",
      `${process.env.NEXT_PUBLIC_BASE_KEYCLOAK_URL}/admin/realms/${process.env.REALMS_ID}/users/${userId}`,
    );
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_KEYCLOAK_URL}/admin/realms/${process.env.REALMS_ID}/users/${userId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // Jika kamu pakai custom attribute `fullName`
          attributes: {
            fullName: name,
          },
          email,
        }),
      },
    );

    if (!res.ok) {
      const text = await res.text();

      console.error("❌ Failed to update user in Keycloak:", text);

      return NextResponse.json({error: "Failed to update profile"}, {status: res.status});
    }

    return NextResponse.json({success: true});
  } catch (err) {
    console.error("🔥 Unexpected error:", err);

    return NextResponse.json({error: "Internal server error"}, {status: 500});
  }
}
