import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { getAgencyActivityLogs } from '@/lib/services/agency-service';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');

    const result = await getAgencyActivityLogs(params.id, page, pageSize);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error fetching agency logs:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to fetch agency logs' },
      { status: 500 }
    );
  }
}
