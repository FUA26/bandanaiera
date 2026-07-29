import { NextRequest, NextResponse } from "next/server";

const BACKOFFICE_URL =
  process.env.NODE_ENV === "development"
    ? "http://127.0.0.1:8910"
    : process.env.NEXT_PUBLIC_BACKOFFICE_URL || "http://localhost:3001";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const response = await fetch(
      `${BACKOFFICE_URL}/api/public/opd${url.search}`,
      {
        next: { revalidate: 300 },
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        { message: "Failed to fetch opd list" },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Error proxying public opd list:", error);
    return NextResponse.json(
      { message: "Failed to fetch opd list" },
      { status: 500 },
    );
  }
}
