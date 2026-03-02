import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { requirePermission } from '@/lib/auth/permissions';
import { eventReorderSchema } from '@/lib/validations/event';
import { reorderEvents } from '@/lib/services/event-service';

export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await requirePermission(session.user.id, 'EVENTS_REORDER');

  const body = await request.json();
  const { items } = eventReorderSchema.parse(body);

  await reorderEvents(items, session.user.id);
  return NextResponse.json({ success: true });
}
