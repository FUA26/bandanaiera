export async function getAdminToken(): Promise<string> {
  const params = new URLSearchParams();

  params.append("grant_type", "client_credentials");
  params.append("client_id", process.env.BACK_ID!);
  params.append("client_secret", process.env.BACK_SECRET!);

  const tokenUrl = `${process.env.KEYCLOAK_URL}/realms/${process.env.REALMS_ID}/protocol/openid-connect/token`;
  const res = await fetch(tokenUrl, {
    method: "POST",
    body: params,
    headers: {"Content-Type": "application/x-www-form-urlencoded"},
  });

  const text = await res.text();

  if (!res.ok) throw new Error(`Admin token error: ${text}`);

  const data = JSON.parse(text);

  return data.access_token;
}
