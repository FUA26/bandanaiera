import {NextRequest, NextResponse} from "next/server";
import {getToken} from "next-auth/jwt";
import * as z from "zod";

import {getAdminToken} from "@/lib/keycloak";

const schema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"],
  });

export async function PATCH(req: NextRequest) {
  const token = await getToken({req, secret: process.env.NEXTAUTH_SECRET});

  if (!token || !token.sub || !token.email) {
    return NextResponse.json({error: "Unauthorized"}, {status: 401});
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({error: parsed.error.flatten()}, {status: 400});
  }

  const {currentPassword, newPassword} = parsed.data;

  try {
    // Step 1: Verify current password
    const verifyRes = await fetch(
      `${process.env.KEYCLOAK_URL}/realms/${process.env.REALMS_ID}/protocol/openid-connect/token`,
      {
        method: "POST",
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
        body: new URLSearchParams({
          grant_type: "password",
          client_id: process.env.CLIENT_ID!,
          client_secret: process.env.SECRET!,
          username: token.email,
          password: currentPassword,
        }),
      },
    );

    if (!verifyRes.ok) {
      return NextResponse.json({error: "Password lama salah"}, {status: 403});
    }

    // Step 2: Update password via admin API
    const adminToken = await getAdminToken();

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_KEYCLOAK_URL}/admin/realms/${process.env.REALMS_ID}/users/${token.sub}/reset-password`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "password",
          value: newPassword,
          temporary: false,
        }),
      },
    );

    if (!res.ok) {
      const text = await res.text();

      console.error("Failed to update password:", text);

      return NextResponse.json({error: "Gagal mengubah password"}, {status: res.status});
    }

    return NextResponse.json({success: true});
  } catch (err) {
    console.error("Error changing password:", err);

    return NextResponse.json({error: "Internal server error"}, {status: 500});
  }
}
