import {DefaultSession, DefaultUser} from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      roles?: string[];
    } & DefaultSession["user"];
    access_token?: string;
    refresh_token?: string;
    error?: string;
    sessionId?: string;
  }

  interface User extends DefaultUser {
    roles?: string[];
    access_token?: string;
    refresh_token?: string;
    accessTokenExpires?: number;
    sessionId?: string;
  }
}
