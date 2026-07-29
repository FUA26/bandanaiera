import { NextRequest, NextResponse } from "next/server";

const BACKOFFICE_URL =
  process.env.NODE_ENV === "development"
    ? "http://127.0.0.1:8910"
    : process.env.NEXT_PUBLIC_BACKOFFICE_URL || "http://localhost:3001";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const resolvedSlug =
      slug || request.nextUrl.pathname.split("/").filter(Boolean).pop();

    if (!resolvedSlug) {
      return NextResponse.json(
        { message: "Opd slug is required" },
        { status: 400 },
      );
    }

    const response = await fetch(
      `${BACKOFFICE_URL}/api/public/opd/${resolvedSlug}`,
      {
        next: { revalidate: 300 },
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        { message: "Failed to fetch opd detail" },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Error proxying public opd detail:", error);
    return NextResponse.json(
      { message: "Failed to fetch opd detail" },
      { status: 500 },
    );
  }
}
