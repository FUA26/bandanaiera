import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { requirePermission } from '@/lib/auth/permissions';
import { getEventActivityLogs } from '@/lib/services/event-service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await requirePermission(session.user.id, 'EVENTS_VIEW');

    const { id } = await params;
    const logs = await getEventActivityLogs(id);
    return NextResponse.json(logs);
  } catch (error) {
    console.error('Error fetching event logs:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch logs' },
      { status: error instanceof Error && error.message.includes('Forbidden') ? 403 : 500 }
    );
  }
}
