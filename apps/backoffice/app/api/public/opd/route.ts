import { NextRequest, NextResponse } from 'next/server';
import { getOpdList } from '@/lib/services/opd-service';
import { OpdCategory, OpdStatus } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const category = searchParams.get('category') as OpdCategory | null;
    const search = searchParams.get('search') || undefined;
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');

    const result = await getOpdList({
      category: category || undefined,
      status: OpdStatus.AKTIF,
      showInMenu: true,
      search,
      page,
      pageSize,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error fetching public opds:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to fetch opds' },
      { status: 500 }
    );
  }
}
