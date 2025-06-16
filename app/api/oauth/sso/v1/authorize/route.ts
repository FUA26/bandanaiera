export const dynamic = "force-dynamic";

import {NextRequest, NextResponse} from "next/server";
import {SignJWT} from "jose";
import jwt from "jsonwebtoken";

import {encrypt} from "@/lib/encryption";

// const VALID_CLIENTS: Record<string, string> = {
//   "epkk-client": "https://epkk.domain.go.id/sso/callback",
//   dasting: "https://dasting.domain.go.id/sso/callback",
// };

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "secret-legacy-php");

export async function POST(req: NextRequest) {
  try {
    const {username, password, clientId, redirectUri, scope = "openid"} = await req.json();

    // Validasi input
    if (!username || !password || !clientId || !redirectUri) {
      return NextResponse.json({error: "Missing required fields"}, {status: 400});
    }

    // Validasi redirectUri dan clientId (aktifkan jika ingin pembatasan lebih ketat)
    // const validRedirectUri = VALID_CLIENTS[clientId];
    // if (!validRedirectUri || !redirectUri.startsWith(validRedirectUri)) {
    //   return NextResponse.json({ error: "Invalid client_id or redirect_uri" }, { status: 400 });
    // }

    // 1. Ambil token dari Keycloak
    const tokenRes = await fetch(
      `${process.env.KEYCLOAK_URL}/realms/${process.env.REALMS_ID}/protocol/openid-connect/token`,
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

    // 2. Decode token untuk ambil data user
    const payload = jwt.decode(tokenData.access_token);

    const sub = payload.sub as string;
    const email = payload.email as string;
    const firstName = payload.given_name as string;

    const externalIdRaw = payload.external_id as string;
    let externalIdObj: Record<string, string> = {};

    try {
      externalIdObj = JSON.parse(externalIdRaw);
    } catch (e) {
      console.warn("⚠️ Failed to parse external_id:", externalIdRaw);
    }

    const externalIdForClient = externalIdObj?.[clientId] || null;

    if (!externalIdForClient) {
      console.warn(`❌ User ${username} tidak terdaftar untuk clientId "${clientId}"`);

      return NextResponse.json({error: "User tidak terdaftar untuk app ini"}, {status: 403});
    }

    const safeField = encrypt(externalIdForClient);

    // 3. Buat JWT baru untuk legacy PHP
    const customToken = await new SignJWT({
      sub,
      email,
      firstName,
      externalId: safeField,
    })
      .setProtectedHeader({alg: "HS256"})
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(JWT_SECRET);

    console.log("====================== CUSTOM TOKEN =========================", customToken);

    // 4. Return custom JWT
    return NextResponse.json({
      token: customToken,
    });
  } catch (error: any) {
    console.error("❌ Internal Error:", error);

    return NextResponse.json({error: "Internal server error"}, {status: 500});
  }
}
