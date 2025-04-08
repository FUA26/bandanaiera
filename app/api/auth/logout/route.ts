// app/api/auth/logout/route.ts
import {getToken} from "next-auth/jwt";
import {NextRequest, NextResponse} from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
  const token = await getToken({req, secret: process.env.NEXTAUTH_SECRET});

  if (!token) {
    // Jika tidak ada token, langsung redirect ke login
    return NextResponse.redirect(new URL("/auth/login", req.nextUrl.origin));
  }

  try {
    if (token.refresh_token) {
      await axios.post(
        `${process.env.KEYCLOAK_URL}/${process.env.REALMS_ID}/protocol/openid-connect/logout`,
        new URLSearchParams({
          client_id: process.env.CLIENT_ID!,
          client_secret: process.env.SECRET!,
          refresh_token: token.refresh_token as string,
        }).toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );
    }
  } catch (error: any) {
    console.error("Failed to revoke token in Keycloak:", error?.response?.data || error.message);
    // Lanjut logout meski revoke gagal
  }

  // Hapus sesi NextAuth (client-side cookie)
  const logoutUrl = new URL("/api/auth/signout", req.nextUrl.origin);

  logoutUrl.searchParams.set("callbackUrl", "/auth/login");

  return NextResponse.redirect(logoutUrl);
}
