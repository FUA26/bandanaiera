import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { getOpdActivityLogs } from '@/lib/services/opd-service';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');

    const result = await getOpdActivityLogs(id, page, pageSize);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error fetching opd logs:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to fetch opd logs' },
      { status: 500 }
    );
  }
}
