import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { requirePermission } from '@/lib/auth/permissions';
import { eventStatusSchema } from '@/lib/validations/event';
import { updateEventStatus } from '@/lib/services/event-service';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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
  } catch (error) {
    console.error('Error updating event status:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update status' },
      { status: error instanceof Error && error.message.includes('Forbidden') ? 403 : 500 }
    );
  }
}
