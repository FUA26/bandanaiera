import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { requirePermission } from '@/lib/auth/permissions';
import { getEventActivityLogs } from '@/lib/services/event-service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await requirePermission(session.user.id, 'EVENTS_VIEW');

  const { id } = await params;
  const logs = await getEventActivityLogs(id);
  return NextResponse.json(logs);
}
