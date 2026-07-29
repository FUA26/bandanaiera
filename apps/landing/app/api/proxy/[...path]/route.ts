import { NextRequest, NextResponse } from "next/server";

const BACKOFFICE_API_URL = process.env.BACKOFFICE_API_URL || "http://localhost:3001";

async function proxy(request: NextRequest, pathParts: string[]) {
  const targetPath = pathParts[0] === "public" ? pathParts.slice(1) : pathParts;
  const targetUrl = new URL(`${BACKOFFICE_API_URL}/api/public/${targetPath.join("/")}`);
  targetUrl.search = request.nextUrl.search;

  const response = await fetch(targetUrl.toString(), {
    headers: {
      "Content-Type": request.headers.get("content-type") || "application/json",
    },
    cache: "no-store",
  });

  const headers = new Headers(response.headers);
  headers.delete("content-encoding");
  headers.delete("content-length");
  headers.delete("transfer-encoding");

  return new NextResponse(response.body, {
    status: response.status,
    headers,
  });
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return proxy(request, path);
}
