// app/api/auth/[...nextauth]/route.ts

import NextAuth, {NextAuthOptions, User} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import {decodeToken} from "react-jwt";

async function getKeycloakToken(email: string, password: string) {
  try {
    const response = await axios.post(
      `${process.env.KEYCLOAK_URL}/${process.env.REALMS_ID}/protocol/openid-connect/token`,
      new URLSearchParams({
        client_id: process.env.CLIENT_ID!,
        client_secret: process.env.SECRET!,
        username: email,
        password,
        grant_type: "password",
      }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );

    return response.data;
  } catch (error: any) {
    const kcError = error?.response?.data;

    if (kcError?.error === "invalid_grant") {
      console.error("🔴 Keycloak login failed: Invalid user credentials");
      throw new Error("Kombinasi email dan password tidak sesuai");
    }

    console.error("🔴 Keycloak login failed:", kcError || error.message);
    throw new Error("Gagal melakukan login ke server otentikasi.");
  }
}

function extractUserFromToken(
  token: string,
): (Partial<User> & {accessTokenExpires?: number}) | null {
  const decoded: any = decodeToken(token);

  if (!decoded) {
    console.warn("⚠️ Failed to decode access token.");

    return null;
  }

  return {
    id: decoded.sub,
    email: decoded.email,
    name: decoded.name,
    roles: decoded?.realm_access?.roles ?? [],
    accessTokenExpires: decoded.exp ? decoded.exp * 1000 : undefined, // ⏳ ambil dari exp
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
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );

    const refreshedTokens = response.data;
    const refreshedUserInfo = extractUserFromToken(refreshedTokens.access_token);

    return {
      ...token,
      access_token: refreshedTokens.access_token,
      refresh_token: refreshedTokens.refresh_token ?? token.refresh_token,
      accessTokenExpires: refreshedUserInfo?.accessTokenExpires ?? Date.now() + 5 * 60 * 1000, // fallback 5 menit
    };
  } catch (error: any) {
    console.error("🔴 Error refreshing access token:", error?.response?.data || error.message);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
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

        try {
          const tokenResponse = await getKeycloakToken(email, password);

          if (!tokenResponse) {
            console.warn("⚠️ No token received from Keycloak.");

            return null;
          }

          const userInfo = extractUserFromToken(tokenResponse.access_token);

          if (!userInfo) {
            console.warn("⚠️ Failed to extract user info from token.");

            return null;
          }

          return {
            ...userInfo,
            access_token: tokenResponse.access_token,
            refresh_token: tokenResponse.refresh_token,
            accessTokenExpires: userInfo.accessTokenExpires ?? Date.now() + 5 * 60 * 1000,
          } as User;
        } catch (err: any) {
          console.warn("🟡 Login failed in authorize():", err.message);
          throw new Error(err.message);
        }
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
          accessTokenExpires: user.accessTokenExpires ?? Date.now() + 5 * 60 * 1000,
        };
      }

      if (
        token.accessTokenExpires &&
        typeof token.accessTokenExpires === "number" &&
        Date.now() < token.accessTokenExpires
      ) {
        return token;
      }

      return await refreshAccessToken(token);
    },

    async session({session, token}) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id ?? "",
          email: token.email ?? "",
          name: token.name ?? "",
          roles: token.roles ?? [],
        },
        access_token: token.access_token ?? "",
        refresh_token: token.refresh_token ?? "",
        error: token.error ?? null,
      };
    },
  },
};

const handler = NextAuth(authOptions);

export {handler as GET, handler as POST};
