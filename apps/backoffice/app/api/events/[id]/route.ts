import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { requirePermission } from '@/lib/auth/permissions';
import { eventUpdateSchema } from '@/lib/validations/event';
import {
  getEventById,
  updateEvent,
  deleteEvent,
} from '@/lib/services/event-service';

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
  const event = await getEventById(id);

  if (!event) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(event);
}

export async function PUT(
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
  const data = eventUpdateSchema.parse({ ...body, id });

  const event = await updateEvent(id, data, session.user.id);
  return NextResponse.json(event);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await requirePermission(session.user.id, 'EVENTS_DELETE');

  const { id } = await params;
  const event = await deleteEvent(id, session.user.id);
  return NextResponse.json(event);
}
