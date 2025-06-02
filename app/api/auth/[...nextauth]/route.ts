import NextAuth, {NextAuthOptions, User} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import {decodeToken} from "react-jwt";

async function getKeycloakToken(email: string, password: string) {
  const response = await axios.post(
    `${process.env.KEYCLOAK_URL}/${process.env.REALMS_ID}/protocol/openid-connect/token`,
    new URLSearchParams({
      client_id: process.env.CLIENT_ID!,
      client_secret: process.env.SECRET!,
      username: email,
      password,
      grant_type: "password",
      scope: "openid",
    }).toString(),
    {headers: {"Content-Type": "application/x-www-form-urlencoded"}},
  );

  return response.data;
}

async function getUserInfoFromAccessToken(accessToken: string) {
  const res = await fetch(
    `${process.env.KEYCLOAK_URL}${process.env.REALMS_ID}/protocol/openid-connect/userinfo`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  console.log("🔒 User info:", res);
  if (!res.ok) throw new Error("Gagal mengambil userinfo dari Keycloak");

  return await res.json();
}

function extractUserFromToken(token: string): {accessTokenExpires?: number; roles?: string[]} {
  const decoded: any = decodeToken(token);

  return {
    roles: decoded?.realm_access?.roles ?? [],
    accessTokenExpires: decoded.exp ? decoded.exp * 1000 : undefined,
  };
}

async function refreshAccessToken(token: any) {
  try {
    const response = await axios.post(
      `${process.env.KEYCLOAK_URL}/${process.env.REALMS_ID}/protocol/openid-connect/token`,
      new URLSearchParams({
        client_id: process.env.CLIENT_ID!,
        client_secret: process.env.SECRET!,
        grant_type: "refresh_token",
        refresh_token: token.refresh_token,
      }).toString(),
      {headers: {"Content-Type": "application/x-www-form-urlencoded"}},
    );

    const refreshedTokens = response.data;
    const userInfo = extractUserFromToken(refreshedTokens.access_token);

    return {
      ...token,
      access_token: refreshedTokens.access_token,
      refresh_token: refreshedTokens.refresh_token ?? token.refresh_token,
      accessTokenExpires: userInfo.accessTokenExpires ?? Date.now() + 5 * 60 * 1000,
    };
  } catch (error: any) {
    console.error("🔴 Error refreshing access token:", error?.response?.data || error.message);

    return {...token, error: "RefreshAccessTokenError"};
  }
}

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/oauth/sso/authorize",
    signOut: "/api/auth/logout",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {label: "Email", type: "email"},
        password: {label: "Password", type: "password"},
      },
      async authorize(credentials): Promise<User | null> {
        const {email, password} = credentials!;
        const tokenResponse = await getKeycloakToken(email, password);
        const userInfo = await getUserInfoFromAccessToken(tokenResponse.access_token);
        const decoded = extractUserFromToken(tokenResponse.access_token);

        return {
          id: userInfo.sub, // ✅ UUID Keycloak
          email: userInfo.email,
          name: userInfo.name,
          roles: decoded.roles,
          access_token: tokenResponse.access_token,
          refresh_token: tokenResponse.refresh_token,
          accessTokenExpires: decoded.accessTokenExpires ?? Date.now() + 5 * 60 * 1000,
        } as User;
      },
    }),
  ],
  callbacks: {
    async jwt({token, user}) {
      if (user) {
        return {
          ...token,
          id: user.id,
          email: user.email,
          name: user.name,
          roles: user.roles,
          access_token: user.access_token,
          refresh_token: user.refresh_token,
          accessTokenExpires: user.accessTokenExpires,
        };
      }
      if (Date.now() < (token as any).accessTokenExpires) return token;

      return await refreshAccessToken(token);
    },
    async session({session, token}) {
      return {
        ...session,
        user: {
          id: token.id,
          email: token.email,
          name: token.name,
          roles: token.roles,
        },
        access_token: token.access_token,
        refresh_token: token.refresh_token,
        error: token.error ?? null,
      };
    },
  },
};

const handler = NextAuth(authOptions);

export {handler as GET, handler as POST};
