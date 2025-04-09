export async function getAdminToken(): Promise<string> {
  const params = new URLSearchParams();

  params.append("grant_type", "client_credentials");
  params.append("client_id", process.env.BACK_ID!);
  params.append("client_secret", process.env.BACK_SECRET!);

  const tokenUrl = `${process.env.KEYCLOAK_URL}${process.env.REALMS_ID}/protocol/openid-connect/token`;

  console.log("🟢 Token URL:", tokenUrl);

  const res = await fetch(tokenUrl, {
    method: "POST",
    body: params,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  const text = await res.text();

  if (!res.ok) {
    console.error("❌ Admin token fetch failed:", text);
    throw new Error(`Failed to get admin token: ${res.statusText}`);
  }

  const data = JSON.parse(text);

  console.log("🟢 DAtA:", data.access_token);

  return data.access_token;
}
