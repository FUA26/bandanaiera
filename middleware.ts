import {NextRequest, NextResponse} from "next/server";
import {getToken} from "next-auth/jwt";

const WHITELISTED_PATHS = [
  "/",
  "/api/public",
  "/oauth/sso/authorize",
  "/auth/login",
  "/auth/register",
];

/**
 * Cek apakah path dikecualikan dari autentikasi
 */
function isWhitelisted(pathname: string): boolean {
  return WHITELISTED_PATHS.includes(pathname);
}

export async function middleware(req: NextRequest) {
  const {pathname} = req.nextUrl;

  // Log debug untuk membantu
  // console.log("🔍 Path:", pathname);
  // console.log("🔍 Cookie:", req.headers.get("cookie"));

  if (isWhitelisted(pathname)) {
    // console.log("✅ Whitelisted path, lanjutkan tanpa token");

    return NextResponse.next();
  }

  const token = await getToken({req, secret: process.env.NEXTAUTH_SECRET});

  // console.log("🔍 Token:", token);

  if (!token) {
    // console.warn("⛔ Tidak ada token. Redirect ke login.");
    const loginUrl = new URL("/auth/login", req.nextUrl.origin);

    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);

    return NextResponse.redirect(loginUrl);
  }

  // Tidak ada cek role lagi
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/auth|_next|_vercel|static|images|favicon\\.ico).*)"],
};
