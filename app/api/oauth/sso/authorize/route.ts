export const dynamic = "force-dynamic";

import {NextRequest, NextResponse} from "next/server";

const VALID_CLIENTS: Record<string, string> = {
  "app-a-client": "https://app-a.domain.go.id/sso/callback",
  "app-b-client": "https://app-b.domain.go.id/sso/callback",
  // Tambahkan sesuai kebutuhan
};

export async function POST(req: NextRequest) {
  try {
    const {username, password, clientId, redirectUri, scope = "openid"} = await req.json();

    // 🔐 Validasi input
    if (!username || !password || !clientId || !redirectUri) {
      return NextResponse.json({error: "Missing required fields"}, {status: 400});
    }

    const validRedirectUri = VALID_CLIENTS[clientId];

    if (!validRedirectUri || !redirectUri.startsWith(validRedirectUri)) {
      return NextResponse.json({error: "Invalid client_id or redirect_uri"}, {status: 400});
    }

    // 🌐 Hit Keycloak
    const tokenRes = await fetch(
      `${process.env.KEYCLOAK_BASE_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "password",
          client_id: clientId,
          username,
          password,
          scope,
        }),
      },
    );

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok) {
      return NextResponse.json(
        {error: tokenData.error_description || "Keycloak authentication failed"},
        {status: 401},
      );
    }

    return NextResponse.json({
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_in: tokenData.expires_in,
      token_type: tokenData.token_type,
    });
  } catch (error: any) {
    console.error("❌ Internal Error:", error);

    return NextResponse.json({error: "Internal server error"}, {status: 500});
  }
}
