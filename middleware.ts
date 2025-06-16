import {NextRequest, NextResponse} from "next/server";
import {getToken} from "next-auth/jwt";

const WHITELISTED_PATHS = [
  "/",
  "/privacy",
  "/terms",
  "/auth/register",
  "/api/public",
  "/api/oauth/sso/authorize",
  "/api/oauth/sso/v1/authorize",
  "/oauth/sso/authorize",
  "/oauth/sso/v1/authorize",
  "/auth/login",
];

function isWhitelisted(pathname: string): boolean {
  return WHITELISTED_PATHS.includes(pathname);
}

export async function middleware(req: NextRequest) {
  const {pathname} = req.nextUrl;

  if (isWhitelisted(pathname)) {
    return NextResponse.next();
  }

  const token = await getToken({req, secret: process.env.NEXTAUTH_SECRET});

  const isExpired =
    token?.accessTokenExpires &&
    typeof token.accessTokenExpires === "number" &&
    Date.now() > token.accessTokenExpires;

  if (!token || isExpired) {
    const loginUrl = new URL("/auth/login", req.nextUrl.origin);

    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/auth|_next|_vercel|static|images|favicon\\.ico).*)"],
};
