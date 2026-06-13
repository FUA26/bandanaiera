import { NextRequest, NextResponse } from 'next/server';
import { getOpdBySlug } from '@/lib/services/opd-service';

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const opd = await getOpdBySlug(params.slug);

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
