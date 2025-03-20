import NextAuth, {NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import {User} from "next-auth";

async function refreshAccessToken(token: any) {
  try {
    const response = await axios.post(
      `${process.env.KEYCLOAK_URL}/${process.env.REALMS_ID}/protocol/openid-connect/token`,
      new URLSearchParams({
        client_id: process.env.CLIENT_ID as string,
        client_secret: process.env.SECRET as string,
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

    return {
      ...token,
      access_token: refreshedTokens.access_token,
      refresh_token: refreshedTokens.refresh_token ?? token.refresh_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
    };
  } catch (error: any) {
    console.error("Error refreshing access token:", error);

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

        try {
          const response = await axios.post(
            `${process.env.KEYCLOAK_URL}/${process.env.REALMS_ID}/protocol/openid-connect/token`,
            new URLSearchParams({
              client_id: process.env.CLIENT_ID as string,
              client_secret: process.env.SECRET as string,
              username: email,
              password: password,
              grant_type: "password",
            }).toString(),
            {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
            },
          );

          const user = response.data;

          if (user) {
            return {
              id: user.sub,
              email: user.email,
              name: user.name,
              roles: user.realm_access.roles ?? [],
            };
          }
        } catch (error: any) {
          console.error("Error during Keycloak login:", error);

          return null;
        }

        return null;
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
      if (
        typeof token.accessTokenExpires === "number" &&
        Date.now() < (token.accessTokenExpires as number)
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
