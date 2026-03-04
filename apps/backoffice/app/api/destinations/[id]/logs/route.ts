import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { requirePermission } from '@/lib/auth/permissions';
import { getDestinationActivityLogs } from '@/lib/services/destination-service';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await requirePermission(session.user.id, 'DESTINATIONS_VIEW');

    const logs = await getDestinationActivityLogs(params.id);
    return NextResponse.json(logs);
  } catch (error) {
    console.error('Error fetching destination logs:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch destination logs' },
      { status: error instanceof Error && error.message.includes('Forbidden') ? 403 : 500 }
    );
  }
}
