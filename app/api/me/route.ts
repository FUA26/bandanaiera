import {NextRequest, NextResponse} from "next/server";
import {getToken} from "next-auth/jwt";
import * as z from "zod";

import {getAdminToken} from "@/lib/keycloak";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z
    .string()
    .regex(/^0\d{10,12}$/, "Nomor tidak valid")
    .optional()
    .or(z.literal("")),
  address: z.string().max(50).optional().or(z.literal("")),
});

export async function GET(req: NextRequest) {
  const token = await getToken({req, secret: process.env.NEXTAUTH_SECRET});

  if (!token || !token.sub) {
    return NextResponse.json({error: "Unauthorized"}, {status: 401});
  }

  try {
    const adminToken = await getAdminToken();

    // console.log("HIIIT ME", adminToken);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_KEYCLOAK_URL}/admin/realms/${process.env.REALMS_ID}/users/${token.sub}`,
      {
        headers: {Authorization: `Bearer ${adminToken}`},
      },
    );

    // console.log("res me", res);

    if (!res.ok) {
      return NextResponse.json({error: "Failed to fetch user"}, {status: res.status});
    }

    const user = await res.json();

    console.log(user);

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.attributes?.fullName?.[0] || "",
        email: user.email || "",
        phone: user.attributes?.phone?.[0] || "",
        address: user.attributes?.address?.[0] || "",
      },
    });
  } catch (err) {
    console.error("Error fetching user:", err);

    return NextResponse.json({error: "Internal server error"}, {status: 500});
  }
}

export async function PATCH(req: NextRequest) {
  const token = await getToken({req, secret: process.env.NEXTAUTH_SECRET});

  if (!token || !token.sub) {
    return NextResponse.json({error: "Unauthorized"}, {status: 401});
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({error: "Invalid data"}, {status: 400});
  }

  const {name, email, phone, address} = parsed.data;

  try {
    const adminToken = await getAdminToken();
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_KEYCLOAK_URL}/admin/realms/${process.env.REALMS_ID}/users/${token.sub}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          attributes: {
            fullName: name,
            phone,
            address,
          },
        }),
      },
    );

    if (!res.ok) {
      const text = await res.text();

      console.error("Failed to update user:", text);

      return NextResponse.json({error: "Failed to update profile"}, {status: res.status});
    }

    return NextResponse.json({success: true});
  } catch (err) {
    console.error("Error updating user:", err);

    return NextResponse.json({error: "Internal server error"}, {status: 500});
  }
}
