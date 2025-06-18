import {NextRequest, NextResponse} from "next/server";
import * as z from "zod";

const schema = z.object({
  code: z.string(),
  newPassword: z.string().min(8),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {error: "Input tidak valid", details: parsed.error.flatten()},
      {status: 400},
    );
  }

  const {code, newPassword} = parsed.data;

  try {
    const actionTokenUrl = `${process.env.NEXT_PUBLIC_BASE_KEYCLOAK_URL}/realms/${process.env.REALMS_ID}/login-actions/action-token?key=${encodeURIComponent(code)}`;

    // Simulasi form submit seperti user membuka halaman Keycloak
    const response = await fetch(actionTokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        password: newPassword,
        "password-confirm": newPassword,
      }),
    });

    const contentType = response.headers.get("content-type");
    const isHtml = contentType?.includes("text/html");
    const isJson = contentType?.includes("application/json");

    if (response.ok || response.status === 302) {
      return NextResponse.json({success: true});
    } else {
      const data = isJson ? await response.json() : isHtml ? await response.text() : null;

      console.error("❌ Gagal reset password:", data);

      return NextResponse.json({error: "Token tidak valid atau telah kadaluarsa"}, {status: 400});
    }
  } catch (err) {
    console.error("🔥 Error saat reset password:", err);

    return NextResponse.json({error: "Terjadi kesalahan server"}, {status: 500});
  }
}
