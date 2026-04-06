import { NextRequest, NextResponse } from 'next/server';
import { getAgencyList } from '@/lib/services/agency-service';
import { AgencyCategory, AgencyStatus } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const category = searchParams.get('category') as AgencyCategory | null;
    const search = searchParams.get('search') || undefined;
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');

    const result = await getAgencyList({
      category: category || undefined,
      status: AgencyStatus.ACTIVE,
      showInMenu: true,
      search,
      page,
      pageSize,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error fetching public agencies:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to fetch agencies' },
      { status: 500 }
    );
  }
}
