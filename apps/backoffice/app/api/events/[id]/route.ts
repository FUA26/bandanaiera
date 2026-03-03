import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { requirePermission } from '@/lib/auth/permissions';
import { eventUpdateSchema } from '@/lib/validations/event';
import {
  getEventById,
  updateEvent,
  deleteEvent,
} from '@/lib/services/event-service';
import { revalidatePath } from 'next/cache';

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
    const event = await getEventById(id);

    if (!event) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch event' },
      { status: error instanceof Error && error.message.includes('Forbidden') ? 403 : 500 }
    );
  }
}

export async function PUT(
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
    const data = eventUpdateSchema.parse({ ...body, id });

    const event = await updateEvent(id, data, session.user.id);

    // Trigger landing revalidation if published
    if (event.status === 'PUBLISHED') {
      await triggerLandingRevalidation('events');
      revalidatePath('/api/public/events');
      revalidatePath('/informasi-publik/agenda-kegiatan');
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update event' },
      { status: error instanceof Error && error.message.includes('Forbidden') ? 403 : 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await requirePermission(session.user.id, 'EVENTS_DELETE');

    const { id } = await params;
    const event = await deleteEvent(id, session.user.id);

    // Always revalidate landing on delete (event might have been published)
    await triggerLandingRevalidation('events');
    revalidatePath('/api/public/events');
    revalidatePath('/informasi-publik/agenda-kegiatan');

    return NextResponse.json(event);
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete event' },
      { status: error instanceof Error && error.message.includes('Forbidden') ? 403 : 500 }
    );
  }
}
