import { NextRequest, NextResponse } from 'next/server';
import { getOpdBySlug } from '@/lib/services/opd-service';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const resolvedSlug =
      slug || req.nextUrl.pathname.split("/").filter(Boolean).pop();

    if (!resolvedSlug) {
      return NextResponse.json(
        { message: "Opd slug is required" },
        { status: 400 }
      );
    }

    const opd = await getOpdBySlug(resolvedSlug);

    if (!opd || opd.status !== 'AKTIF' || !opd.showInMenu) {
      return NextResponse.json({ message: 'Opd not found' }, { status: 404 });
    }

    return NextResponse.json(opd);
  } catch (error: any) {
    console.error('Error fetching opd:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to fetch opd' },
      { status: 500 }
    );
  }
}
