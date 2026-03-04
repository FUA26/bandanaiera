import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { requirePermission } from '@/lib/auth/permissions';
import { eventQuerySchema, eventSchema } from '@/lib/validations/event';
import {
  getEventsList,
  createEvent,
} from '@/lib/services/event-service';
import { revalidatePath } from 'next/cache';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await requirePermission(session.user.id, 'EVENTS_VIEW');

    const searchParams = request.nextUrl.searchParams;
    const query = eventQuerySchema.parse(Object.fromEntries(searchParams));

    const result = await getEventsList(query);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch events' },
      { status: error instanceof Error && error.message.includes('Forbidden') ? 403 : 500 }
    );
  }
}

async function triggerLandingRevalidation(tag: 'events' | 'news') {
  const revalidateSecret = process.env.REVALIDATE_SECRET;
  const landingUrl = process.env.LANDING_URL || 'http://localhost:3000';

  if (revalidateSecret) {
    try {
      await fetch(`${landingUrl}/api/revalidate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret: revalidateSecret, tag }),
      });
    } catch (error) {
      console.error('Failed to revalidate landing:', error);
      // Don't fail the request if revalidation fails
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await requirePermission(session.user.id, 'EVENTS_CREATE');

    const body = await request.json();
    const data = eventSchema.parse(body);

    const event = await createEvent(data, session.user.id);

    // Trigger landing revalidation if published
    if (event.status === 'PUBLISHED') {
      await triggerLandingRevalidation('events');
      revalidatePath('/api/public/events');
      revalidatePath('/informasi-publik/agenda-kegiatan');
    }

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create event' },
      { status: error instanceof Error && error.message.includes('Forbidden') ? 403 : 500 }
    );
  }
}
