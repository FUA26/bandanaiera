// app/api/me/route.ts
import {getServerSession} from "next-auth";
import {NextResponse} from "next/server";
import axios from "axios";

import {authOptions} from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);

  //   console.log("🔍 Session in /api/me:", session);

  if (!session) {
    return NextResponse.json({message: "Unauthorized"}, {status: 401});
  }

  return NextResponse.json({user: session.user});
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.access_token || !session.user?.id) {
    return NextResponse.json({message: "Unauthorized"}, {status: 401});
  }

  const body = await req.json();
  const {name, email} = body;

  try {
    const tokenUrl = `${process.env.NEXT_PUBLIC_BASE_KEYCLOAK_URL}/realms/${process.env.REALMS_ID}/protocol/openid-connect/token`;
    const adminTokenRes = await axios.post(
      tokenUrl,
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.CLIENT_ID!,
        client_secret: process.env.SECRET!,
      }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );

    const adminToken = adminTokenRes.data.access_token;

    // Update user ke Keycloak
    await axios.put(
      `${process.env.NEXT_PUBLIC_BASE_KEYCLOAK_URL}/admin/realms/${process.env.REALMS_ID}/users/${session.user.id}`,
      {
        firstName: name,
        email,
      },
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "application/json",
        },
      },
    );

    return NextResponse.json({message: "Profil berhasil diperbarui."});
  } catch (error: any) {
    console.error("Gagal update user di Keycloak:", error?.response?.data || error.message);

    return NextResponse.json({message: "Gagal memperbarui profil."}, {status: 500});
  }
}
