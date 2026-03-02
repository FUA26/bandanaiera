import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { requirePermission } from '@/lib/auth/permissions';
import { eventStatusSchema } from '@/lib/validations/event';
import { updateEventStatus } from '@/lib/services/event-service';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await requirePermission(session.user.id, 'EVENTS_EDIT');

  const { id } = await params;
  const body = await request.json();
  const { status } = eventStatusSchema.parse({ ...body, id });

  const event = await updateEventStatus(id, status, session.user.id);
  return NextResponse.json(event);
}
