import {NextRequest, NextResponse} from "next/server";
import * as z from "zod";

import {getAdminToken} from "@/lib/keycloak";

const schema = z.object({
  email: z.string().email(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = schema.safeParse(body);

  console.log("PARSEEEED", parsed);
  if (!parsed.success) {
    return NextResponse.json(
      {error: "Input tidak valid", details: parsed.error.flatten()},
      {status: 400},
    );
  }

  const {email} = parsed.data;

  try {
    const adminToken = await getAdminToken();

    console.log("ADMIN TOKEN", adminToken);
    // Cari user berdasarkan email
    const userRes = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_KEYCLOAK_URL}/admin/realms/${process.env.REALMS_ID}/users?email=${email}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "application/json",
        },
      },
    );

    const users = await userRes.json();

    if (!Array.isArray(users) || users.length === 0) {
      return NextResponse.json({message: "Email tidak ditemukan"}, {status: 404});
    }

    const userId = users[0].id;

    // Kirim email untuk reset password
    const sendRes = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_KEYCLOAK_URL}/admin/realms/${process.env.REALMS_ID}/users/${userId}/execute-actions-email`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(["UPDATE_PASSWORD"]),
      },
    );

    if (!sendRes.ok) {
      const text = await sendRes.text();

      console.error("Gagal mengirim email reset password:", text);

      return NextResponse.json(
        {error: "Gagal mengirim email reset password"},
        {status: sendRes.status},
      );
    }

    return NextResponse.json({success: true});
  } catch (err) {
    console.error("🔥 Error:", err);

    return NextResponse.json({error: "Terjadi kesalahan server"}, {status: 500});
  }
}
