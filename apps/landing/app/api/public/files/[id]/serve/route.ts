import { NextRequest, NextResponse } from "next/server";

const BACKOFFICE_URL =
  process.env.NODE_ENV === "development"
    ? "http://127.0.0.1:8910"
    : process.env.NEXT_PUBLIC_BACKOFFICE_URL || "http://localhost:3001";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const resolvedId = id || request.nextUrl.pathname.split("/").filter(Boolean).at(-2);

    if (!resolvedId) {
      return NextResponse.json({ message: "File id is required" }, { status: 400 });
    }

    const response = await fetch(`${BACKOFFICE_URL}/api/public/files/${resolvedId}/serve`, {
      next: { revalidate: 300 },
    });

    if (!response.ok || !response.body) {
      return NextResponse.json(
        { message: "Failed to fetch file" },
        { status: response.status },
      );
    }

    const headers = new Headers(response.headers);
    headers.delete("content-length");
    headers.delete("transfer-encoding");
    headers.delete("content-encoding");

    return new NextResponse(response.body, {
      status: response.status,
      headers,
    });
  } catch (error: unknown) {
    console.error("Error proxying public file:", error);
    return NextResponse.json(
      { message: "Failed to fetch file" },
      { status: 500 },
    );
  }
}
