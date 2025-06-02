import {NextRequest, NextResponse} from "next/server";
import {getToken} from "next-auth/jwt";

export async function POST(req: NextRequest) {
  const token = await getToken({req, secret: process.env.NEXTAUTH_SECRET});

  if (!token || !token.refresh_token) {
    return NextResponse.json({error: "Unauthorized"}, {status: 401});
  }

  try {
    const logoutRes = await fetch(
      `${process.env.KEYCLOAK_URL}/${process.env.REALMS_ID}/protocol/openid-connect/logout`,
      {
        method: "POST",
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
        body: new URLSearchParams({
          client_id: process.env.CLIENT_ID!,
          client_secret: process.env.SECRET!,
          refresh_token: token.refresh_token.toString(),
        }),
      },
    );

    if (!logoutRes.ok) {
      const errorText = await logoutRes.text();

      console.error("🔴 Failed to logout from Keycloak:", errorText);

      return NextResponse.json({error: "Failed to logout from Keycloak"}, {status: 500});
    }

    return NextResponse.json({success: true});
  } catch (err) {
    console.error("❌ Logout error:", err);

    return NextResponse.json({error: "Unexpected error"}, {status: 500});
  }
}
