import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { requirePermission } from '@/lib/auth/permissions';
import { eventQuerySchema, eventSchema } from '@/lib/validations/event';
import {
  getEventsList,
  createEvent,
} from '@/lib/services/event-service';

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await requirePermission(session.user.id, 'EVENTS_VIEW');

  const searchParams = request.nextUrl.searchParams;
  const query = eventQuerySchema.parse(Object.fromEntries(searchParams));

  const result = await getEventsList(query);
  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await requirePermission(session.user.id, 'EVENTS_CREATE');

  const body = await request.json();
  const data = eventSchema.parse(body);

  const event = await createEvent(data, session.user.id);
  return NextResponse.json(event, { status: 201 });
}
