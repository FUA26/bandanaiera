import { prisma } from "@/lib/db/prisma";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
          include: {
            role: {
              select: {
                id: true,
                name: true,
                permissions: {
                  select: {
                    permission: {
                      select: {
                        name: true,
                      },
                    },
                  },
                },
              },
            },
          },
        });

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(credentials.password as string, user.password);

        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          roleId: user.roleId,
          role: user.role
            ? {
                id: user.role.id,
                name: user.role.name,
                permissions: user.role.permissions.map((rp) => ({
                  permission: {
                    name: rp.permission.name,
                  },
                })),
              }
            : undefined,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.roleId = user.roleId;
        token.role = user.role;
        // Extract permissions as flat array for easier access
        if (user.role) {
          token.permissions = user.role.permissions.map((rp) => rp.permission.name);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token.id) {
        session.user.id = token.id as string;
        session.user.roleId = token.roleId as string;
      }
      if (token.role) {
        session.user.role = token.role as {
          id: string;
          name: string;
          permissions: Array<{
            permission: {
              name: string;
            };
          }>;
        };
      }
      if (token.permissions) {
        session.user.permissions = token.permissions as string[];
      }
      return session;
    },
  },
});
