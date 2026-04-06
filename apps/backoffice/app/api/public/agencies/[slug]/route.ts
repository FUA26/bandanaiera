import { NextRequest, NextResponse } from 'next/server';
import { getAgencyBySlug } from '@/lib/services/agency-service';

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const agency = await getAgencyBySlug(params.slug);

    if (!agency || agency.status !== 'ACTIVE' || !agency.showInMenu) {
      return NextResponse.json({ message: 'Agency not found' }, { status: 404 });
    }

    return NextResponse.json(agency);
  } catch (error: any) {
    console.error('Error fetching agency:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to fetch agency' },
      { status: 500 }
    );
  }
}
